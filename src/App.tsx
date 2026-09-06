import { Header } from './components/layout/Header/Header';
import { Hero } from './components/home/Hero/Hero';
import { SelectedWork } from './components/home/SelectedWork/SelectedWork';
import { ShortStudies } from './components/home/ShortStudies/ShortStudies';
import { About } from './components/home/About/About';
import { Skills } from './components/home/Skills/Skills';
import { Contact } from './components/home/Contact/Contact';
import { Footer } from './components/layout/Footer/Footer';

function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <SelectedWork />
        <ShortStudies />
        <About />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </>
  );
}

export default App;