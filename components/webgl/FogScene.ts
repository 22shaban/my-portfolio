import * as THREE from "three";
import { hoverStore } from "@/lib/store";

const FOG_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FOG_FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform vec2  uRes;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform float uPointerStrength;
  uniform float uScroll;
  uniform float uTheme;
  uniform float uIntro;

  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < OCTAVES; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 asp = vec2(uRes.x / uRes.y, 1.0);
    vec2 p = uv * asp * 2.1;
    float t = uTime * 0.028;

    vec2 q = vec2(
      fbm(p + vec2(0.0, t)),
      fbm(p + vec2(5.2, 1.3) - t)
    );
    vec2 r = vec2(
      fbm(p + 2.6 * q + vec2(1.7, 9.2) + t * 1.3),
      fbm(p + 2.6 * q + vec2(8.3, 2.8) - t * 0.9)
    );
    float f = fbm(p + 2.4 * r + vec2(0.0, uScroll * 0.00005));

    vec2 d = (uv - uPointer) * asp;
    float bloom = exp(-dot(d, d) * 7.0) * uPointerStrength;
    f += bloom * 0.30;

    vec2 c = (uv - 0.5) * asp;
    float rad = length(c);

    vec3 fogCenter = vec3(0.937, 0.925, 0.902);
    vec3 fogEdge   = vec3(0.839, 0.827, 0.804);
    vec3 inkCenter = vec3(0.031, 0.031, 0.033);
    vec3 inkEdge   = vec3(0.0);

    vec3 fogBase = mix(fogCenter, fogEdge, smoothstep(0.0, 0.9, rad));
    vec3 inkBase = mix(inkCenter, inkEdge, smoothstep(0.0, 0.95, rad));

    float smoke = smoothstep(0.30, 0.86, f);
    vec3 fogCol = mix(fogBase, vec3(0.70, 0.69, 0.665), smoke * 0.36);
    vec3 inkCol = mix(inkBase, vec3(0.86, 0.85, 0.81), smoke * 0.11);

    vec3 col = mix(fogCol, inkCol, uTheme);

    float g = hash21(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5;
    col += g * 0.020;

    gl_FragColor = vec4(col, uIntro);
  }
`;

export class FogScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  private fogMat: THREE.ShaderMaterial;
  private last = 0;
  private started = 0;
  private raf = 0;
  private disposed = false;
  private intro = 0;
  private lastTheme = 0;
  private themeFrom = 0;
  private themeTo = 0;
  private themeT = 1;
  private frameAcc = 0;
  private frameCount = 0;
  private downgraded = false;

  constructor(canvas: HTMLCanvasElement) {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.35);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      stencil: false,
      depth: false,
    });
    this.renderer.setPixelRatio(dpr);
    this.renderer.setClearColor(0x000000, 0);

    const octaves = isMobile ? 3 : 4;

    this.fogMat = new THREE.ShaderMaterial({
      vertexShader: FOG_VERT,
      fragmentShader: FOG_FRAG,
      defines: { OCTAVES: octaves },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uPointerStrength: { value: 0 },
        uScroll: { value: 0 },
        uTheme: { value: 0 },
        uIntro: { value: 0 },
      },
    });

    const fog = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.fogMat);
    fog.frustumCulled = false;
    this.scene.add(fog);

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("pointermove", this.onPointer, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  private resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.fogMat.uniforms.uRes.value.set(w, h);
  };

  private onPointer = (e: PointerEvent) => {
    hoverStore.pointerX = e.clientX / window.innerWidth;
    hoverStore.pointerY = 1 - e.clientY / window.innerHeight;
    hoverStore.pointerStrength = 1;
  };

  private onVisibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
    } else if (!this.raf && !this.disposed) {
      this.last = performance.now();
      this.loop();
    }
  };

  start() {
    this.last = performance.now();
    this.started = this.last;
    this.loop();
  }

  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);

    const now = performance.now();
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    const time = (now - this.started) / 1000;

    // frame budget watchdog — drop resolution once if we're struggling
    if (!this.downgraded) {
      this.frameAcc += dt;
      this.frameCount++;
      if (this.frameCount > 90) {
        if (this.frameAcc / this.frameCount > 0.024) {
          this.downgraded = true;
          this.renderer.setPixelRatio(1);
          this.resize();
        }
        this.frameAcc = 0;
        this.frameCount = 0;
      }
    }

    this.intro = Math.min(1, this.intro + dt * 0.7);

    const themeTarget =
      document.documentElement.dataset.theme === "ink" ? 1 : 0;
    // reference: 1s power2.inOut crossfade of the shader hold uniform
    if (themeTarget !== this.themeTo) {
      this.themeFrom = this.lastTheme;
      this.themeTo = themeTarget;
      this.themeT = 0;
    }
    if (this.themeT < 1) {
      this.themeT = Math.min(1, this.themeT + dt);
      const p = this.themeT;
      const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      this.lastTheme = this.themeFrom + (this.themeTo - this.themeFrom) * e;
    }

    hoverStore.smoothX +=
      (hoverStore.pointerX - hoverStore.smoothX) * Math.min(1, dt * 5);
    hoverStore.smoothY +=
      (hoverStore.pointerY - hoverStore.smoothY) * Math.min(1, dt * 5);
    hoverStore.pointerStrength *= 0.965;

    const u = this.fogMat.uniforms;
    u.uTime.value = time;
    u.uPointer.value.set(hoverStore.smoothX, hoverStore.smoothY);
    u.uPointerStrength.value = hoverStore.pointerStrength * 0.9;
    u.uScroll.value = hoverStore.scroll;
    u.uTheme.value = this.lastTheme;
    u.uIntro.value = this.intro;

    this.renderer.render(this.scene, this.camera);
  };

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("pointermove", this.onPointer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
    });
    this.fogMat.dispose();
    this.renderer.dispose();
  }
}
