import React, { useState } from 'react';
import { Globe, ChevronUp, Twitter, Instagram, Facebook, Linkedin, ArrowUpRight } from 'lucide-react';

export default function Footer({ setCurrentPage, openAuthModal }) {
  const [localeOpen, setLocaleOpen] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState('English');

  const locales = ['English', 'Deutsch', 'Español', '한국어', 'Português'];

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="Footer_footerWrapper">
      <div className="Section_container Section_normal">
        <div className="Footer_mainRow">
          {/* Logo & Social Links */}
          <div className="Footer_leftWrapper">
            <a
              href="#home"
              onClick={(e) => { e.preventDefault(); navigateTo('home'); }}
              className="Footer_logoLink"
              aria-label="Spot Virtual Home"
            >
              <svg width="130" height="42" viewBox="0 0 130 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="21" cy="21" r="16" fill="#60C449" />
                <circle cx="21" cy="21" r="6" fill="#FFFFFF" />
                <text x="44" y="28" fill="#232A30" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="23" letterSpacing="-0.5px">
                  Spot
                </text>
              </svg>
            </a>

            <div className="Footer_socialWrapper">
              <a
                href="https://twitter.com/SpotVirtualHQ"
                target="_blank"
                rel="noreferrer"
                className="Footer_socialButton"
                aria-label="Spot Twitter"
              >
                <Twitter size={15} />
              </a>
              <a
                href="https://www.instagram.com/spotvirtualhq/"
                target="_blank"
                rel="noreferrer"
                className="Footer_socialButton"
                aria-label="Spot Instagram"
              >
                <Instagram size={15} />
              </a>
              <a
                href="https://www.facebook.com/spotvirtualhq"
                target="_blank"
                rel="noreferrer"
                className="Footer_socialButton"
                aria-label="Spot Facebook"
              >
                <Facebook size={15} />
              </a>
              <a
                href="https://www.linkedin.com/company/spotvirtual/"
                target="_blank"
                rel="noreferrer"
                className="Footer_socialButton"
                aria-label="Spot LinkedIn"
              >
                <Linkedin size={15} />
              </a>
            </div>
          </div>

          {/* Menus & CTA */}
          <div className="Footer_rightWrapper">
            <div className="Footer_menuWrapper">
              {/* Product */}
              <div className="Footer_block">
                <a href="#virtual-offices" onClick={(e) => { e.preventDefault(); navigateTo('virtual-offices'); }} className="Footer_link smallBodyText">
                  Virtual Offices
                </a>
                <a href="#virtual-events" onClick={(e) => { e.preventDefault(); navigateTo('virtual-events'); }} className="Footer_link smallBodyText">
                  Virtual Events
                </a>
                <a href="#ai-agents" onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }} className="Footer_link smallBodyText">
                  AI Agents
                </a>
              </div>

              {/* Free Access & Downloads */}
              <div className="Footer_block">
                <a href="#pricing" onClick={(e) => { e.preventDefault(); navigateTo('pricing'); }} className="Footer_link smallBodyText">
                  Free Access
                </a>
                <a href="#downloads" onClick={(e) => { e.preventDefault(); navigateTo('downloads'); }} className="Footer_link smallBodyText">
                  Download
                </a>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="Footer_link smallBodyText">
                  Support
                </a>
              </div>

              {/* Company */}
              <div className="Footer_block">
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="Footer_link smallBodyText">
                  Blog
                </a>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="Footer_link smallBodyText">
                  Media Kit
                </a>
                <a href="mailto:info@spotvirtual.com" className="Footer_link smallBodyText">
                  Contact Us
                </a>
              </div>

              {/* Developers */}
              <div className="Footer_block">
                <a href="#ai-agents" onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }} className="Footer_link smallBodyText">
                  Developers
                </a>
                <a href="#ai-agents" onClick={(e) => { e.preventDefault(); navigateTo('ai-agents'); }} className="Footer_link smallBodyText">
                  OpenClaw
                </a>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="Footer_link smallBodyText">
                  Partners
                </a>
                <a href="https://status.spotvirtual.com/" target="_blank" rel="noreferrer" className="Footer_link smallBodyText">
                  Status
                </a>
              </div>

              {/* Legal & Trust */}
              <div className="Footer_block">
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="Footer_link smallBodyText">
                  Privacy Policy
                </a>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="Footer_link smallBodyText">
                  Terms of Service
                </a>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="Footer_link smallBodyText">
                  Community Guidelines
                </a>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="Footer_link smallBodyText">
                  Trust
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => openAuthModal('demo')}
              className="ButtonLink_button ButtonLink_blue ButtonLink_regular Footer_button"
            >
              Schedule Demo
            </button>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="Footer_bottomRow">
          <div className="LocalePicker_self smallBodyText" onClick={() => setLocaleOpen(!localeOpen)}>
            <Globe size={16} />
            <span>{selectedLocale}</span>
            <ChevronUp size={14} style={{ transform: localeOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />

            {localeOpen && (
              <div className="LocalePicker_popup">
                {locales.map((locale) => (
                  <div
                    key={locale}
                    className="LocalePicker_popupItem"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocale(locale);
                      setLocaleOpen(false);
                    }}
                  >
                    {locale}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="smallBodyText" style={{ color: '#94a3b8' }}>
            Copyright © {new Date().getFullYear()}. All rights reserved. Spot Virtual Inc.
          </div>
        </div>
      </div>
    </footer>
  );
}
