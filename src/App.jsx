import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import GuestOnboardingModal from './components/workspace/GuestOnboardingModal';

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
  const [guestModal, setGuestModal] = useState({
    isOpen: false,
    orgName: 'Sunnkesh',
    orgSlug: 'sunnkesh-4c24f4f3d747fffc',
    spaceName: 'Office',
    spaceSlug: 'office',
    roomName: 'Lobby',
    roomSlug: 'lobby'
  });
  const [isPlatformActive, setIsPlatformActive] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    fullName: 'Ayush',
    email: 'user@spotvirtual.com',
    companyName: 'Spot Virtual HQ',
    spaceSlug: 'office',
    spaceName: 'Office',
    targetRoom: 'Boardroom'
  });

  // Handle Spot deep linking (/org/space/room) and URL hash navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const pathname = window.location.pathname;
      const hash = window.location.hash.replace('#', '').trim();

      // Check if pathname or hash matches Spot URL structure (/@org/@space/@room)
      if (pathname.includes('/@') || hash.includes('/@') || hash.includes('@conference') || hash.includes('spotvirtual.com')) {
        const fullUri = pathname.includes('/@') ? pathname : hash;
        let wsName = 'Sunnkesh';
        let wsSlug = 'sunnkesh-4c24f4f3d747fffc';
        let spaceSlug = 'office';
        let spaceName = 'Office';
        let targetRoom = 'Lobby';
        let roomSlug = 'lobby';

        if (fullUri.includes('ser-emY') || fullUri.includes('/@ser') || fullUri.includes('office-a')) {
          spaceSlug = 'ser-emY';
          spaceName = 'ser';
          targetRoom = 'Office A';
          roomSlug = 'office-a';
        } else if (fullUri.includes('boardroom')) {
          targetRoom = 'Boardroom';
          roomSlug = 'boardroom';
        } else if (fullUri.includes('auditorium')) {
          targetRoom = 'Auditorium';
          roomSlug = 'auditorium';
        } else if (fullUri.includes('conference-b')) {
          targetRoom = 'Conference B';
          roomSlug = 'conference-b';
        } else if (fullUri.includes('conference-a')) {
          targetRoom = 'Conference A';
          roomSlug = 'conference-a';
        } else if (fullUri.includes('chat-a')) {
          targetRoom = 'Chat A';
          roomSlug = 'chat-a';
        } else if (fullUri.includes('chat-b')) {
          targetRoom = 'Chat B';
          roomSlug = 'chat-b';
        } else if (fullUri.includes('lobby')) {
          targetRoom = 'Lobby';
          roomSlug = 'lobby';
        } else if (fullUri.includes('lounge-a')) {
          targetRoom = 'Lounge A';
          roomSlug = 'lounge-a';
        } else if (fullUri.includes('lounge-b')) {
          targetRoom = 'Lounge B';
          roomSlug = 'lounge-b';
        } else if (fullUri.includes('lounge-c')) {
          targetRoom = 'Lounge C';
          roomSlug = 'lounge-c';
        } else if (fullUri.includes('patio')) {
          targetRoom = 'Patio';
          roomSlug = 'patio';
        } else if (fullUri.includes('workspace')) {
          targetRoom = 'Workspace A';
          roomSlug = 'workspace-a';
        }

        // Show authentic guest onboarding flow for visitor deep links
        setGuestModal({
          isOpen: true,
          orgName: wsName,
          orgSlug: wsSlug,
          spaceName: spaceName,
          spaceSlug: spaceSlug,
          roomName: targetRoom,
          roomSlug: roomSlug
        });
        return;
      }

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

    handleUrlChange();
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
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
    try {
      window.history.pushState({}, '', '/#home');
    } catch (e) {
      window.location.hash = 'home';
    }
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

      {/* Spot Authentic Guest Onboarding & Knock Modal */}
      <GuestOnboardingModal
        isOpen={guestModal.isOpen}
        orgName={guestModal.orgName}
        orgSlug={guestModal.orgSlug}
        spaceName={guestModal.spaceName}
        spaceSlug={guestModal.spaceSlug}
        roomName={guestModal.roomName}
        roomSlug={guestModal.roomSlug}
        onClose={() => setGuestModal((prev) => ({ ...prev, isOpen: false }))}
        onComplete={(guestData) => {
          setGuestModal((prev) => ({ ...prev, isOpen: false }));
          setCurrentUser({
            fullName: guestData.fullName || 'Guest Engineer',
            email: `${(guestData.fullName || 'guest').toLowerCase().replace(/\s+/g, '.')}@guest.spotvirtual.com`,
            companyName: 'Sunnkesh',
            workspaceSlug: '@sunnkesh-4c24f4f3d747fffc',
            spaceSlug: guestData.spaceSlug || guestModal.spaceSlug,
            spaceName: guestModal.spaceName,
            targetRoom: guestModal.roomName,
            targetRoomId: guestModal.roomSlug,
            skinTone: guestData.skinTone,
            isMicOn: guestData.isMicOn,
            isVideoOn: guestData.isVideoOn
          });
          setIsPlatformActive(true);
        }}
      />
    </div>
  );
}
