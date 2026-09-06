import { Header } from './components/layout/Header/Header';
import { Hero } from './components/home/Hero/Hero';
import { SelectedWork } from './components/home/SelectedWork/SelectedWork';
import { ShortStudies } from './components/home/ShortStudies/ShortStudies';

function App() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <SelectedWork />
        <ShortStudies />
      </main>
    </>
  );
}

export default App;