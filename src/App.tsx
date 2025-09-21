import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider } from './context/AppContext';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { ResultsTable } from './components/ResultsTable';
import { Settings } from './components/Settings';
import { ToastContainer } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { useAnimationPreferences } from './hooks/useAnimationPreferences';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toasts, removeToast } = useToast();
  const { prefersReducedMotion } = useAnimationPreferences();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'results':
        return <ResultsTable />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const pageVariants = {
    initial: prefersReducedMotion ? {} : { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: prefersReducedMotion ? {} : { opacity: 0, y: -20 },
  };

  const pageTransition = {
    duration: prefersReducedMotion ? 0 : 0.3,
    ease: 'easeInOut',
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleMobileMenu={toggleMobileMenu}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>

        <ToastContainer toasts={toasts} onClose={removeToast} />

        {/* Mobile menu backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-25 z-20 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </div>
    </AppProvider>
  );
}

export default App;