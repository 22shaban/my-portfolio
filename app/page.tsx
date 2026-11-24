import Preloader from "@/components/preloader/Preloader";
import WebGLStage from "@/components/webgl/WebGLStage";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/hero/Hero";
import About from "@/components/about/About";
import Interlude from "@/components/about/Interlude";
import Studio from "@/components/about/Studio";
import WorkList from "@/components/work/WorkList";

export default function Page() {
  return (
    <>
      <Preloader />
      <WebGLStage />
      <Header />
      <main>
        <Hero />
        <About />
        <Interlude />
        <Studio />
        <WorkList />
      </main>
      <Footer />
    </>
  );
}
