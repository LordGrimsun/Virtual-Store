import React, { useState } from 'react';
import { Download, Monitor, Apple, Globe, Terminal, CheckCircle2, Shield, Zap, Sparkles } from 'lucide-react';

export default function DownloadsPage({ openAuthModal, setCurrentPage }) {
  const [downloadSuccess, setDownloadSuccess] = useState(null);

  const handleDownload = (platform, filename) => {
    setDownloadSuccess(`Spot ${platform} installer (${filename}) initiated!`);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 4500);
  };

  const platforms = [
    {
      id: 'mac',
      name: 'macOS',
      icon: <Apple size={36} color="#1e293b" />,
      arch: 'Universal (Apple Silicon & Intel)',
      version: 'v3.4.2',
      requirement: 'macOS 11.0 Big Sur or newer',
      primaryBtn: 'Download for Mac (.dmg)',
      filename: 'Spot-3.4.2-universal.dmg',
      accentColor: '#59a7f0',
      badge: 'Recommended for Mac'
    },
    {
      id: 'windows',
      name: 'Windows',
      icon: <Monitor size={36} color="#0078d4" />,
      arch: '64-bit Windows Installer',
      version: 'v3.4.2',
      requirement: 'Windows 10 or Windows 11 (64-bit)',
      primaryBtn: 'Download for Windows (.exe)',
      filename: 'SpotSetup-3.4.2.exe',
      accentColor: '#0078d4',
      badge: 'Windows 10/11'
    },
    {
      id: 'linux',
      name: 'Linux',
      icon: <Terminal size={36} color="#e11d48" />,
      arch: 'x86_64 / arm64 AppImage & DEB',
      version: 'v3.4.2',
      requirement: 'Ubuntu 20.04+, Debian 11+, Fedora 36+',
      primaryBtn: 'Download .AppImage',
      filename: 'Spot-3.4.2.AppImage',
      accentColor: '#e11d48',
      badge: 'Linux x64'
    },
    {
      id: 'web',
      name: 'Web Browser',
      icon: <Globe size={36} color="#60c449" />,
      arch: 'No installation required',
      version: 'Always Latest',
      requirement: 'Chrome, Edge, Safari, Firefox, Brave',
      primaryBtn: 'Launch in Browser',
      filename: null,
      accentColor: '#60c449',
      badge: 'Zero Install'
    }
  ];

  const desktopAdvantages = [
    {
      title: 'Global Push-to-Talk Hotkey',
      desc: 'Mute or unmute instantly while in any other application using your configured global keyboard shortcut.'
    },
    {
      title: 'Hardware Acceleration',
      desc: 'GPU-optimized audio/video encoding consumes up to 50% less battery and CPU during active screen shares.'
    },
    {
      title: 'Multi-Monitor Selection',
      desc: 'Select individual displays or specific application windows without browser permission prompts.'
    },
    {
      title: 'Native OS Notifications',
      desc: 'Receive direct notification alerts when teammates knock on your door or summon your assistance.'
    }
  ];

  return (
    <div className="DownloadsPage_wrapper">
      {/* Hero Section */}
      <section style={{ padding: '6rem 0 3rem', background: 'linear-gradient(180deg, #f0f7fc 0%, #ffffff 100%)' }}>
        <div className="Section_container Section_normal">
          <div style={{ textAlign: 'center', maxWidth: '42rem', margin: '0 auto' }}>
            <span style={{ color: '#59a7f0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem' }}>
              OFFICIAL DESKTOP CLIENTS
            </span>
            <h1 className="h1" style={{ margin: '1rem 0 1.25rem', lineHeight: 1.15 }}>
              Download Spot <br />
              <span style={{ color: '#60c449' }}>for Mac, Windows, &amp; Linux.</span>
            </h1>
            <p className="bodyText" style={{ color: '#64748b', fontSize: '1.2rem', lineHeight: 1.6 }}>
              Get the smoothest spatial experience with dedicated hardware acceleration, global push-to-talk, and deep desktop integration.
            </p>

            {downloadSuccess && (
              <div style={{
                marginTop: '1.5rem',
                padding: '0.85rem 1.5rem',
                backgroundColor: '#dcfce7',
                border: '1px solid #86efac',
                color: '#166534',
                borderRadius: '8px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={18} />
                {downloadSuccess}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Platform Cards Grid */}
      <section style={{ backgroundColor: '#ffffff', padding: '3rem 0 5rem' }}>
        <div className="Section_container Section_normal">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem'
          }}>
            {platforms.map((p) => (
              <div
                key={p.id}
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '1.25rem',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1.75rem',
                  background: '#ffffff',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  position: 'relative',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '1rem',
                      background: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e2e8f0'
                    }}>
                      {p.icon}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      color: p.accentColor,
                      background: `${p.accentColor}18`,
                      padding: '4px 10px',
                      borderRadius: '1rem'
                    }}>
                      {p.badge}
                    </span>
                  </div>

                  <h3 className="h3" style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.35rem' }}>
                    {p.name}
                  </h3>
                  <div style={{ color: '#475569', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    {p.arch}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                    Requires {p.requirement} &bull; {p.version}
                  </div>
                </div>

                <div>
                  {p.id === 'web' ? (
                    <button
                      onClick={() => openAuthModal('signin')}
                      className="ButtonLink_button ButtonLink_regular ButtonLink_green"
                      style={{ width: '100%', borderRadius: '2rem' }}
                    >
                      {p.primaryBtn}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDownload(p.name, p.filename)}
                      className="ButtonLink_button ButtonLink_regular ButtonLink_blue"
                      style={{ width: '100%', borderRadius: '2rem', gap: '8px' }}
                    >
                      <Download size={18} />
                      {p.primaryBtn}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop App Advantages */}
      <section style={{ backgroundColor: '#fafbfd', padding: '5rem 0', borderTop: '1px solid #f1f5f9' }}>
        <div className="Section_container Section_normal">
          <div style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto 4rem' }}>
            <h2 className="h2">Why use the Desktop App?</h2>
            <p className="bodyText" style={{ color: '#64748b' }}>
              Built with Chromium and native C++ WebRTC bindings for ultra-low latency and minimal resource footprint.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            {desktopAdvantages.map((adv, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  padding: '2rem',
                  borderRadius: '1rem',
                  border: '1px solid #e2e8f0'
                }}
              >
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem'
                }}>
                  <Zap size={18} />
                </div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>
                  {adv.title}
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.55 }}>
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="CTASection_section" style={{ backgroundColor: '#ffffff', padding: '5rem 0' }}>
        <div className="Section_container Section_normal">
          <div className="CTASection_banner">
            <div className="CTASection_content">
              <h2 className="CTASection_title h2">Ready to jump into your team's space?</h2>
              <p className="CTASection_subtitle">
                Create your space in seconds or log in to an existing workspace.
              </p>
              <div className="CTASection_buttonWrapper">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green CTASection_button"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => openAuthModal('signin')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline CTASection_button"
                  style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
