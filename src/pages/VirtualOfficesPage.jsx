import React from 'react';
import { Building2, Users, Monitor, Headphones, Palette, ShieldCheck, ArrowRight, Zap, Coffee, Sparkles } from 'lucide-react';

export default function VirtualOfficesPage({ openAuthModal, setCurrentPage }) {
  const highlights = [
    {
      icon: <Users size={22} />,
      title: 'Spontaneous Connections',
      description: 'Reclaim the hallway chat and watercooler moments that remote work stripped away. Walk over and talk without scheduling a 30-minute block.'
    },
    {
      icon: <Headphones size={22} />,
      title: 'Focus Pods & Quiet Zones',
      description: 'Put on your virtual noise-cancelling headphones when you need uninterrupted flow time. Your team knows you are in the zone.'
    },
    {
      icon: <Palette size={22} />,
      title: 'Fully Customizable Spaces',
      description: 'Rearrange furniture, customize floorplans, hang company art, and design unique team wings that reflect your company culture.'
    }
  ];

  const showcaseItems = [
    {
      title: 'Infinite multi-screen sharing for deep collaboration.',
      description: 'Why settle for one person presenting while everyone else drifts away? Multiple teammates can share screens simultaneously in high resolution. Compare UI mockups alongside live code, logs, and documentation.',
      image: 'https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Ftabs%2Fcollaboration.webp&w=1920&q=75',
      reversed: false
    },
    {
      title: 'Personal desks that give everyone an anchor.',
      description: 'Every team member gets their own customizable workspace. Leave sticky notes, decorate your desk, and see who is online, focused, or stepping away for a coffee break.',
      image: 'https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Ftabs%2Ffloorplans.webp&w=1920&q=75',
      reversed: true
    },
    {
      title: 'Meeting rooms that close the door when you need privacy.',
      description: 'Step into conference rooms, boardrooms, or 1-on-1 pods. The virtual door closes, isolating sound completely from the rest of the floor so sensitive discussions remain confidential.',
      image: 'https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Ftabs%2Fmeetings.webp&w=1920&q=75',
      reversed: false
    }
  ];

  return (
    <div className="VirtualOfficesPage_wrapper">
      {/* Hero Section */}
      <section className="virtual-offices_heroContainer">
        <div className="Section_container Section_normal">
          <div className="virtual-offices_hero">
            <div className="virtual-offices_left">
              <span style={{ color: '#59a7f0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem' }}>
                SPATIAL WORKSPACE
              </span>
              <h1 className="h1" style={{ lineHeight: 1.15 }}>
                A virtual office that <br />
                <span style={{ color: '#60c449' }}>actually feels like work.</span>
              </h1>
              <h2 className="bodyText" style={{ color: '#64748b', fontSize: '1.25rem', lineHeight: 1.6 }}>
                Cut scheduled video fatigue by 80%. Walk up to desks, gather around whiteboards, and feel the natural presence of your team every single day.
              </h2>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green"
                >
                  Create Your Free Office
                </button>
                <button
                  onClick={() => openAuthModal('demo')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline"
                >
                  Book Live Demo
                </button>
              </div>
            </div>

            <div className="virtual-offices_right">
              <img
                src="https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Ftabs%2Ffloorplans.webp&w=1920&q=75"
                alt="Virtual Office Overview"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 Value Pillars */}
      <section style={{ backgroundColor: '#ffffff', padding: '4rem 0' }}>
        <div className="Section_container Section_normal">
          <div className="virtual-offices_items">
            {highlights.map((item, idx) => (
              <div key={idx} className="virtual-offices_item">
                <div className="virtual-offices_bullet">
                  {item.icon}
                </div>
                <h3 className="h3" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                  {item.title}
                </h3>
                <p className="bodyText" style={{ color: '#64748b', lineHeight: 1.6 }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Dives / Screenshot Rows */}
      <section style={{ backgroundColor: '#fafbfd', padding: '4rem 0', borderTop: '1px solid #f1f5f9' }}>
        <div className="Section_container Section_normal">
          {showcaseItems.map((item, idx) => (
            <div
              key={idx}
              className={`virtual-offices_screenshotSection ${item.reversed ? 'virtual-offices_right' : ''}`}
            >
              <div className="virtual-offices_copy">
                <div style={{ color: '#59a7f0', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                  FEATURE SPOTLIGHT
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
              <div className="virtual-offices_imageContainer">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '5rem 0' }}>
        <div className="Section_container Section_normal">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#60c449', fontFamily: "'Space Grotesk', monospace" }}>
                80%
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.15rem', marginTop: '0.5rem' }}>
                Fewer scheduled video meetings
              </div>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#59a7f0', fontFamily: "'Space Grotesk', monospace" }}>
                3.4x
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.15rem', marginTop: '0.5rem' }}>
                More frequent cross-team check-ins
              </div>
            </div>
            <div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: '#f59e0b', fontFamily: "'Space Grotesk', monospace" }}>
                94%
              </div>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1.15rem', marginTop: '0.5rem' }}>
                Higher reported team cohesion
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="CTASection_section" style={{ backgroundColor: '#ffffff', padding: '5rem 0' }}>
        <div className="Section_container Section_normal">
          <div className="CTASection_banner">
            <div className="CTASection_content">
              <h2 className="CTASection_title h2">Build your company’s virtual headquarters today.</h2>
              <p className="CTASection_subtitle">
                Set up a custom office in less than 3 minutes. Zero credit card required to start.
              </p>
              <div className="CTASection_buttonWrapper">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green CTASection_button"
                >
                  Start 14-Day Free Trial
                </button>
                <button
                  onClick={() => setCurrentPage('pricing')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline CTASection_button"
                  style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}
                >
                  View All Plans
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
