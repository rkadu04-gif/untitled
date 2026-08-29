import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { BestCategoryPage } from './pages/BestCategoryPage';
import { CategoryPage } from './pages/CategoryPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { DealsPage } from './pages/DealsPage';
import { BuyingGuidesPage } from './pages/BuyingGuidesPage';
import { BuyingGuideDetailPage } from './pages/BuyingGuideDetailPage';
import { ComparePage } from './pages/ComparePage';
import { SearchPage } from './pages/SearchPage';
import { AffiliateDisclosurePage } from './pages/AffiliateDisclosurePage';
import { AboutPage, ContactPage, PrivacyPolicyPage, TermsPage } from './pages/StaticPages';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminRoute } from './components/layout/AdminRoute';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Layout Wrapper to inject navigate
const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900">
      <ScrollToTop />
      <Header currentPath={location.pathname} navigate={handleNavigate} />
      <main className="flex-grow">
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { navigate: handleNavigate } as any);
          }
          return child;
        })}
      </main>
      <Footer navigate={handleNavigate} />
    </div>
  );
};

// Route wrapper components to pass params and navigate
const BestCategoryPageWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = location.pathname.split('/').pop() || '';
  return <BestCategoryPage categoryId={categoryId} navigate={navigate} />;
};

const CategoryPageWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryId = location.pathname.split('/').pop() || '';
  return <CategoryPage categoryId={categoryId} navigate={navigate} />;
};

const ProductDetailPageWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.split('/').pop() || '';
  return <ProductDetailPage slug={slug} navigate={navigate} />;
};

const BuyingGuideDetailPageWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const slug = location.pathname.split('/').pop() || '';
  return <BuyingGuideDetailPage slug={slug} navigate={navigate} />;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage navigate={() => {}} />} />
            <Route path="/best/:categoryId" element={<BestCategoryPageWrapper />} />
            <Route path="/category/:categoryId" element={<CategoryPageWrapper />} />
            <Route path="/categories" element={<CategoriesPage navigate={() => {}} />} />
            <Route path="/product/:slug" element={<ProductDetailPageWrapper />} />
            <Route path="/deals" element={<DealsPage navigate={() => {}} />} />
            <Route path="/guides" element={<BuyingGuidesPage navigate={() => {}} />} />
            <Route path="/guides/:slug" element={<BuyingGuideDetailPageWrapper />} />
            <Route path="/compare" element={<ComparePage navigate={() => {}} />} />
            <Route path="/search" element={<SearchPage navigate={() => {}} />} />
            <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/admin/login" element={<AdminLogin navigate={() => {}} />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard navigate={() => {}} /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminDashboard navigate={() => {}} tab="products" /></AdminRoute>} />
            <Route path="/admin/import" element={<AdminRoute><AdminDashboard navigate={() => {}} tab="import" /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminDashboard navigate={() => {}} tab="categories" /></AdminRoute>} />
            <Route path="/admin/guides" element={<AdminRoute><AdminDashboard navigate={() => {}} tab="guides" /></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><AdminDashboard navigate={() => {}} tab="settings" /></AdminRoute>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
