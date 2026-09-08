import { Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { ScrollToTop } from './components/ScrollToTop/ScrollToTop';
import { HomePage } from './pages/HomePage/HomePage';
import { LoyaltyCasePage } from './pages/LoyaltyCasePage/LoyaltyCasePage';
import { SecurityPolicyCasePage } from './pages/SecurityPolicyCasePage/SecurityPolicyCasePage';

function App() {
  return (
    <>
      <ScrollToTop />

      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/case/multi-tenant-rewards"
            element={<LoyaltyCasePage />}
          />

          <Route
            path="/case/security-policy-builder"
            element={<SecurityPolicyCasePage />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;