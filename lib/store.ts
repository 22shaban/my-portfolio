/**
 * Mutable, render-loop friendly store shared between React and the WebGL
 * scene. Deliberately outside React so pointer movement never re-renders.
 */
export const hoverStore = {
  pointerX: 0.5,
  pointerY: 0.5,
  smoothX: 0.5,
  smoothY: 0.5,
  pointerStrength: 0,
  scroll: 0,
  scrollVelocity: 0,
};
