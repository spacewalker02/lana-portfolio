import { Hero } from '../../components/home/Hero/Hero';
import { SelectedWork } from '../../components/home/SelectedWork/SelectedWork';
import { ShortStudies } from '../../components/home/ShortStudies/ShortStudies';
import { About } from '../../components/home/About/About';
import { Skills } from '../../components/home/Skills/Skills';
import { Contact } from '../../components/home/Contact/Contact';

export function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <ShortStudies />
      <About />
      <Skills />
      <Contact />
    </>
  );
}