import { Route, Routes } from 'react-router-dom';
import { Header } from './components/layout/Header/Header';
import { Footer } from './components/layout/Footer/Footer';
import { HomePage } from './pages/HomePage/HomePage';
import { LoyaltyCasePage } from './pages/LoyaltyCasePage/LoyaltyCasePage';

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route
            path="/case/multi-tenant-rewards"
            element={<LoyaltyCasePage />}
          />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;