import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header/Header';
import { Footer } from '@/components/layout/Footer/Footer';
import { ScrollToTop } from '@/hooks/useScrollToTop';
import Home from '@/pages/Home';
import CasePage from '@/pages/CasePage';
import NotFound from '@/pages/NotFound';
import VisualStudiesPage from './pages/VisualPages';

function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="top">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case/:slug" element={<CasePage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/visual-studies" element={<VisualStudiesPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

export default App;