import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import PricingPage from './pages/PricingPage';
import AIAgentsPage from './pages/AIAgentsPage';
import VirtualOfficesPage from './pages/VirtualOfficesPage';
import VirtualEventsPage from './pages/VirtualEventsPage';
import DownloadsPage from './pages/DownloadsPage';
import WorkspacePlatform from './pages/WorkspacePlatform';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [authModal, setAuthModal] = useState({ isOpen: false, initialMode: 'signin' });
  const [isPlatformActive, setIsPlatformActive] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    fullName: 'Ayush',
    email: 'user@spotvirtual.com',
    companyName: 'Spot Virtual HQ'
  });

  // Handle URL hash changes for deep linking & browser history
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      const validPages = ['home', 'pricing', 'ai-agents', 'virtual-offices', 'virtual-events', 'downloads', 'platform'];
      if (validPages.includes(hash)) {
        if (hash === 'platform') {
          setIsPlatformActive(true);
        } else {
          setIsPlatformActive(false);
          setCurrentPage(hash);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changePage = (page) => {
    if (page === 'platform') {
      launchPlatform();
      return;
    }
    setIsPlatformActive(false);
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const launchPlatform = (userData) => {
    if (userData) {
      setCurrentUser(userData);
    }
    setIsPlatformActive(true);
    window.location.hash = 'platform';
  };

  const exitPlatform = () => {
    setIsPlatformActive(false);
    window.location.hash = 'home';
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openAuthModal = (mode = 'signin') => {
    setAuthModal({ isOpen: true, initialMode: mode });
  };

  const closeAuthModal = () => {
    setAuthModal({ ...authModal, isOpen: false });
  };

  // If in active virtual office platform mode, render the full-screen platform
  if (isPlatformActive) {
    return (
      <WorkspacePlatform
        user={currentUser}
        onExit={exitPlatform}
      />
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'pricing':
        return <PricingPage openAuthModal={openAuthModal} setCurrentPage={changePage} />;
      case 'ai-agents':
        return <AIAgentsPage openAuthModal={openAuthModal} setCurrentPage={changePage} />;
      case 'virtual-offices':
        return <VirtualOfficesPage openAuthModal={openAuthModal} setCurrentPage={changePage} />;
      case 'virtual-events':
        return <VirtualEventsPage openAuthModal={openAuthModal} setCurrentPage={changePage} />;
      case 'downloads':
        return <DownloadsPage openAuthModal={openAuthModal} setCurrentPage={changePage} />;
      case 'home':
      default:
        return <HomePage openAuthModal={openAuthModal} setCurrentPage={changePage} />;
    }
  };

  return (
    <div className="SpotApp_root">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={changePage}
        openAuthModal={openAuthModal}
        onLaunchPlatform={() => launchPlatform()}
      />

      {/* Main Page Content */}
      <main className="SpotApp_mainContent">
        {renderPage()}
      </main>

      {/* Shared Footer */}
      <Footer
        setCurrentPage={changePage}
        openAuthModal={openAuthModal}
      />

      {/* Authentication & Booking Modal */}
      <AuthModal
        isOpen={authModal.isOpen}
        onClose={closeAuthModal}
        initialMode={authModal.initialMode}
        onLoginSuccess={(userData) => launchPlatform(userData)}
      />
    </div>
  );
}
