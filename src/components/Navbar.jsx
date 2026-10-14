import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Sparkles, Building2, Calendar, Bot } from 'lucide-react';

export default function Navbar({ currentPage, setCurrentPage, openAuthModal, onLaunchPlatform, theme = 'light' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 220);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isDarkPage = currentPage === 'ai-agents' || theme === 'dark';

  return (
    <>
      {/* Top News Banner & Standard Header */}
      <header className={`Navbar_section ${isDarkPage ? 'dark-theme-header' : ''}`}>
        <div className="Section_container Section_normal">
          {/* News Banner */}
          <div className={`Navbar_newsBanner ${isDarkPage ? 'Navbar_inverted' : ''} xsmallBodyText`}>
            <div>Find it again: introducing improved message search in Spot</div>
            <button
              onClick={() => navigateTo('home')}
              className="Navbar_newsLink"
            >
              Learn More
            </button>
          </div>

          <div
            className="Navbar_divider"
            style={{ backgroundColor: isDarkPage ? 'rgba(255, 255, 255, 0.15)' : '#E2E2E2' }}
          />

          {/* Main Navigation Bar */}
          <nav className="Navbar_navbarWrapper">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
              className="Navbar_logoLink"
              aria-label="Spot Virtual Home"
            >
              {/* Spot Virtual Crisp Logo */}
              <svg width="128" height="42" viewBox="0 0 128 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="21" cy="21" r="16" fill="#60C449" />
                <circle cx="21" cy="21" r="6" fill="#FFFFFF" />
                <text x="44" y="28" fill={isDarkPage ? '#FFFFFF' : '#232A30'} fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="23" letterSpacing="-0.5px">
                  Spot
                </text>
              </svg>
            </a>

            {/* Desktop Navigation Links */}
            <div className={`Navbar_navbarRight ${mobileMenuOpen ? 'Navbar_open' : ''}`} ref={dropdownRef}>
              <div className="Navbar_menuWrapper">
                {/* Product Dropdown */}
                <div className="NavLink_dropdownWrapper">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('product')}
                    className={`NavLink_link NavLink_dropdownToggleLink ${isDarkPage ? 'NavLink_linkWhite' : ''}`}
                    aria-expanded={activeDropdown === 'product'}
                  >
                    Product
                    <ChevronDown size={14} className={`NavLink_chevron ${activeDropdown === 'product' ? 'NavLink_open' : ''}`} />
                  </button>

                  {activeDropdown === 'product' && (
                    <div className="NavLink_dropdownMenu">
                      <a
                        href="#virtual-offices"
                        onClick={(e) => { e.preventDefault(); navigateTo('virtual-offices'); }}
                        className="NavLink_dropdownLink"
                      >
                        <Building2 size={16} color="#59a7f0" />
                        Virtual Offices
                      </a>
                      <a
                        href="#virtual-events"
                        onClick={(e) => { e.preventDefault(); navigateTo('virtual-events'); }}
                        className="NavLink_dropdownLink"
                      >
                        <Calendar size={16} color="#ec4899" />
                        Virtual Events
                      </a>
                      <a
                        href="#ai-agents"
                        onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }}
                        className="NavLink_dropdownLink"
                      >
                        <Bot size={16} color="#60c449" />
                        AI Agents
                      </a>
                    </div>
                  )}
                </div>

                {/* Company Dropdown */}
                <div className="NavLink_dropdownWrapper">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('company')}
                    className={`NavLink_link NavLink_dropdownToggleLink ${isDarkPage ? 'NavLink_linkWhite' : ''}`}
                    aria-expanded={activeDropdown === 'company'}
                  >
                    Company
                    <ChevronDown size={14} className={`NavLink_chevron ${activeDropdown === 'company' ? 'NavLink_open' : ''}`} />
                  </button>

                  {activeDropdown === 'company' && (
                    <div className="NavLink_dropdownMenu">
                      <a
                        href="#home"
                        onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                        className="NavLink_dropdownLink"
                      >
                        About Us
                      </a>
                      <a
                        href="#home"
                        onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                        className="NavLink_dropdownLink"
                      >
                        Blog
                      </a>
                      <a
                        href="#home"
                        onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                        className="NavLink_dropdownLink"
                      >
                        Media Kit
                      </a>
                    </div>
                  )}
                </div>

                {/* Free Access Link */}
                <a
                  href="#pricing"
                  onClick={(e) => { e.preventDefault(); navigateTo('pricing'); }}
                  className={`NavLink_link ${currentPage === 'pricing' ? 'active-link' : ''} ${isDarkPage ? 'NavLink_linkWhite' : ''}`}
                >
                  Free Access
                </a>

                {/* Resources Dropdown */}
                <div className="NavLink_dropdownWrapper">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('resources')}
                    className={`NavLink_link NavLink_dropdownToggleLink ${isDarkPage ? 'NavLink_linkWhite' : ''}`}
                    aria-expanded={activeDropdown === 'resources'}
                  >
                    Resources
                    <ChevronDown size={14} className={`NavLink_chevron ${activeDropdown === 'resources' ? 'NavLink_open' : ''}`} />
                  </button>

                  {activeDropdown === 'resources' && (
                    <div className="NavLink_dropdownMenu">
                      <a
                        href="#ai-agents"
                        onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }}
                        className="NavLink_dropdownLink"
                      >
                        <Bot size={16} color="#10b981" />
                        OpenClaw Connector
                      </a>
                      <a
                        href="#ai-agents"
                        onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }}
                        className="NavLink_dropdownLink"
                      >
                        <Sparkles size={16} color="#6366f1" />
                        API Documentation
                      </a>
                      <a
                        href="#home"
                        onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
                        className="NavLink_dropdownLink"
                      >
                        Support Center
                      </a>
                      <a
                        href="https://status.spotvirtual.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="NavLink_dropdownLink"
                      >
                        System Status
                      </a>
                    </div>
                  )}
                </div>

                {/* Downloads Link */}
                <a
                  href="#downloads"
                  onClick={(e) => { e.preventDefault(); navigateTo('downloads'); }}
                  className={`NavLink_link ${currentPage === 'downloads' ? 'active-link' : ''} ${isDarkPage ? 'NavLink_linkWhite' : ''}`}
                >
                  Download
                </a>
              </div>

              {/* Action Buttons */}
              <div className="Navbar_buttonWrapper">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className={`ButtonLink_button ${isDarkPage ? 'ButtonLink_outline-white' : 'ButtonLink_outline'} ButtonLink_small Navbar_navButton`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={onLaunchPlatform}
                  className="ButtonLink_button ButtonLink_green ButtonLink_small Navbar_navButton"
                  style={{ gap: '6px' }}
                >
                  <Sparkles size={14} />
                  <span>Access Platform</span>
                </button>
              </div>
            </div>

            {/* Mobile Nav Button & Hamburger Toggle */}
            <div className="Navbar_mobileNavbarRight">
              <button
                type="button"
                onClick={onLaunchPlatform}
                className="ButtonLink_button ButtonLink_green Navbar_mobileNavButton"
                style={{ gap: '4px' }}
              >
                <Sparkles size={13} />
                <span>Platform</span>
              </button>
              <button
                type="button"
                className="Navbar_menuButton"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X size={20} color={isDarkPage ? '#fff' : '#232a30'} /> : <Menu size={20} color={isDarkPage ? '#fff' : '#232a30'} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Floating Fixed Navbar (Shown on Scroll) */}
      <header className={`Navbar_section Navbar_fixed ${isScrolled ? 'Navbar_visible' : ''}`}>
        <div className="Section_container Section_normal">
          <nav className="Navbar_navbarWrapper" style={{ paddingTop: 0 }}>
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
              className="Navbar_logoLink"
              aria-label="Spot Virtual Home"
            >
              <svg width="128" height="42" viewBox="0 0 128 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="21" cy="21" r="16" fill="#60C449" />
                <circle cx="21" cy="21" r="6" fill="#FFFFFF" />
                <text x="44" y="28" fill="#232A30" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="23" letterSpacing="-0.5px">
                  Spot
                </text>
              </svg>
            </a>

            <div className="Navbar_navbarRight">
              <div className="Navbar_menuWrapper">
                <div className="NavLink_dropdownWrapper">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('fixed-product')}
                    className="NavLink_link NavLink_dropdownToggleLink"
                  >
                    Product
                    <ChevronDown size={14} className={`NavLink_chevron ${activeDropdown === 'fixed-product' ? 'NavLink_open' : ''}`} />
                  </button>

                  {activeDropdown === 'fixed-product' && (
                    <div className="NavLink_dropdownMenu">
                      <a href="#virtual-offices" onClick={(e) => { e.preventDefault(); navigateTo('virtual-offices'); }} className="NavLink_dropdownLink">
                        <Building2 size={16} color="#59a7f0" /> Virtual Offices
                      </a>
                      <a href="#virtual-events" onClick={(e) => { e.preventDefault(); navigateTo('virtual-events'); }} className="NavLink_dropdownLink">
                        <Calendar size={16} color="#ec4899" /> Virtual Events
                      </a>
                      <a href="#ai-agents" onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }} className="NavLink_dropdownLink">
                        <Bot size={16} color="#60c449" /> AI Agents
                      </a>
                    </div>
                  )}
                </div>

                <div className="NavLink_dropdownWrapper">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('fixed-company')}
                    className="NavLink_link NavLink_dropdownToggleLink"
                  >
                    Company
                    <ChevronDown size={14} className={`NavLink_chevron ${activeDropdown === 'fixed-company' ? 'NavLink_open' : ''}`} />
                  </button>

                  {activeDropdown === 'fixed-company' && (
                    <div className="NavLink_dropdownMenu">
                      <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="NavLink_dropdownLink">About Us</a>
                      <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="NavLink_dropdownLink">Blog</a>
                      <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="NavLink_dropdownLink">Media Kit</a>
                    </div>
                  )}
                </div>

                <a
                  href="#pricing"
                  onClick={(e) => { e.preventDefault(); navigateTo('pricing'); }}
                  className="NavLink_link"
                >
                  Free Access
                </a>

                <div className="NavLink_dropdownWrapper">
                  <button
                    type="button"
                    onClick={() => toggleDropdown('fixed-resources')}
                    className="NavLink_link NavLink_dropdownToggleLink"
                  >
                    Resources
                    <ChevronDown size={14} className={`NavLink_chevron ${activeDropdown === 'fixed-resources' ? 'NavLink_open' : ''}`} />
                  </button>

                  {activeDropdown === 'fixed-resources' && (
                    <div className="NavLink_dropdownMenu">
                      <a href="#ai-agents" onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }} className="NavLink_dropdownLink">
                        <Bot size={16} color="#10b981" /> OpenClaw Connector
                      </a>
                      <a href="#ai-agents" onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }} className="NavLink_dropdownLink">
                        <Sparkles size={16} color="#6366f1" /> Developer API
                      </a>
                      <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="NavLink_dropdownLink">Support</a>
                      <a href="https://status.spotvirtual.com/" target="_blank" rel="noreferrer" className="NavLink_dropdownLink">Status</a>
                    </div>
                  )}
                </div>

                <a
                  href="#downloads"
                  onClick={(e) => { e.preventDefault(); navigateTo('downloads'); }}
                  className="NavLink_link"
                >
                  Download
                </a>
              </div>

              <div className="Navbar_buttonWrapper">
                <button
                  type="button"
                  onClick={() => openAuthModal('signin')}
                  className="ButtonLink_button ButtonLink_outline ButtonLink_small Navbar_navButton"
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={onLaunchPlatform}
                  className="ButtonLink_button ButtonLink_green ButtonLink_small Navbar_navButton"
                  style={{ gap: '6px' }}
                >
                  <Sparkles size={14} />
                  <span>Access Platform</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
