import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { RequestQuoteModal } from './components/RequestQuoteModal';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { PoTzPage } from './pages/PoTzPage';
import { PostavkaPage } from './pages/PostavkaPage';
import { KontaktyPage } from './pages/KontaktyPage';
import { TRANSFORMER_CATEGORIES, getCategoryBySlug } from './data/transformerCatalog';
import { Grid, FileText, Truck, Phone, Zap } from 'lucide-react';

const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '');

const normalizePath = (fullPath: string): string => {
  let p = fullPath;
  if (BASE && p.startsWith(BASE)) {
    p = p.slice(BASE.length);
  }
  return p.replace(/\/$/, '') || '/';
};

export const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined'
      ? normalizePath(window.location.pathname)
      : '/';
  });

  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [modalCategorySlug, setModalCategorySlug] = useState<string | undefined>();
  const [modalPower, setModalPower] = useState<string | undefined>();

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    const targetRelative = path.startsWith('/') ? path : `/${path}`;
    const targetFull = `${BASE}${targetRelative}`;
    setCurrentPath(normalizePath(targetRelative));
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', targetFull);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openQuoteModal = (categorySlug?: string, power?: string) => {
    setModalCategorySlug(categorySlug);
    setModalPower(power);
    setIsQuoteModalOpen(true);
  };

  // Router matching logic
  const renderPage = () => {
    const cleanPath = currentPath;

    // 1. Home
    if (cleanPath === '/' || cleanPath === '/index.html') {
      return <HomePage onNavigate={navigate} onOpenQuoteModal={openQuoteModal} />;
    }

    // 2. Catalog Main
    if (cleanPath === '/katalog' || cleanPath === '/katalog.html') {
      return <CatalogPage onNavigate={navigate} onOpenQuoteModal={openQuoteModal} />;
    }

    // 3. Category Detail Pages (support /katalog/:slug or direct /:slug)
    let categorySlug: string | undefined;
    if (cleanPath.startsWith('/katalog/')) {
      categorySlug = cleanPath.replace('/katalog/', '').replace('.html', '');
    } else {
      const directSlug = cleanPath.replace(/^\//, '').replace('.html', '');
      if (TRANSFORMER_CATEGORIES.some((c) => c.slug === directSlug)) {
        categorySlug = directSlug;
      }
    }

    if (categorySlug) {
      const category = getCategoryBySlug(categorySlug);
      if (category) {
        return (
          <CategoryDetailPage
            category={category}
            onNavigate={navigate}
            onOpenQuoteModal={openQuoteModal}
          />
        );
      }
    }

    // 4. Custom Manufacturing (по ТЗ)
    if (cleanPath === '/po-tz' || cleanPath === '/po-tz.html') {
      return <PoTzPage onNavigate={navigate} onOpenQuoteModal={openQuoteModal} />;
    }

    // 5. Delivery & Import (поставка)
    if (cleanPath === '/postavka' || cleanPath === '/postavka.html') {
      return <PostavkaPage onNavigate={navigate} onOpenQuoteModal={openQuoteModal} />;
    }

    // 6. Contacts
    if (cleanPath === '/kontakty' || cleanPath === '/kontakty.html') {
      return <KontaktyPage onOpenQuoteModal={() => openQuoteModal()} />;
    }

    // Fallback: Catalog Page
    return <CatalogPage onNavigate={navigate} onOpenQuoteModal={openQuoteModal} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f6f8fa] text-[#1d2733] font-sans">
      {/* Header */}
      <Header
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenQuoteModal={openQuoteModal}
      />

      {/* Main Content */}
      <main className="flex-1 pb-16">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer onNavigate={navigate} onOpenQuoteModal={openQuoteModal} />

      {/* Global RFQ / Quote Modal */}
      <RequestQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        initialCategorySlug={modalCategorySlug}
        initialPower={modalPower}
      />

      {/* Sticky Mobile Floating Bottom Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-surface-border px-2 py-1.5 shadow-2xl flex items-center justify-between gap-1">
        <button
          type="button"
          onClick={() => navigate('/katalog')}
          className={`flex-1 py-1 flex flex-col items-center text-[10px] font-bold ${
            currentPath.includes('katalog') ? 'text-[#0b3d66]' : 'text-slate-600'
          }`}
        >
          <Grid className="w-4 h-4 mb-0.5" />
          Каталог
        </button>

        <button
          type="button"
          onClick={() => navigate('/po-tz')}
          className={`flex-1 py-1 flex flex-col items-center text-[10px] font-bold ${
            currentPath.includes('po-tz') ? 'text-[#0b3d66]' : 'text-slate-600'
          }`}
        >
          <FileText className="w-4 h-4 mb-0.5" />
          По ТЗ
        </button>

        <button
          type="button"
          onClick={() => navigate('/postavka')}
          className={`flex-1 py-1 flex flex-col items-center text-[10px] font-bold ${
            currentPath.includes('postavka') ? 'text-[#0b3d66]' : 'text-slate-600'
          }`}
        >
          <Truck className="w-4 h-4 mb-0.5" />
          FCA
        </button>

        <a
          href="tel:+73431234567"
          className="flex-1 py-1 flex flex-col items-center text-[10px] font-bold text-slate-600"
        >
          <Phone className="w-4 h-4 mb-0.5 text-[#e6a417]" />
          Звонок
        </a>

        <button
          type="button"
          onClick={() => openQuoteModal()}
          className="flex-1 py-2 px-2 bg-[#e6a417] hover:bg-[#d2930f] text-[#072640] font-black text-xs rounded-xl shadow-md flex items-center justify-center active:scale-95 transition-transform"
        >
          <Zap className="w-3.5 h-3.5 mr-1" />
          КП
        </button>
      </div>
    </div>
  );
};

export default App;
