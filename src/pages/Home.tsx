import { Hero } from "@/components/home/Hero/Hero";
import { SelectedWork } from "@/components/home/SelectedWork/SelectedWork";
import { VisualStudies } from "@/components/home/VisualStudies/VisualStudies";
import { About } from "@/components/home/About/About";
import { Skills } from "@/components/home/Skills/Skills";
import { Contact } from "@/components/home/Contact/Contact";

export default function Home() {
  return (
    <>
        <Hero />
        <SelectedWork />
        <VisualStudies/>
        <About />
        <Skills />
        <Contact />
    </>
  );
}