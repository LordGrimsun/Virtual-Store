import React from 'react';
import { Calendar, Users, Radio, Sparkles, Award, MessageSquare, ArrowRight, CheckCircle2, Megaphone, Presentation } from 'lucide-react';

export default function VirtualEventsPage({ openAuthModal, setCurrentPage }) {
  const eventFeatures = [
    {
      title: 'Main Stage Auditoriums',
      desc: 'Broadcast keynotes to hundreds of attendees with crystal-clear audio, dynamic presentation slides, and low-latency video streaming.'
    },
    {
      title: 'Spontaneous Networking Lounges',
      desc: 'Attendees mingle freely by walking between cocktail tables and lounges. When two people get close, spatial audio connects them instantly.'
    },
    {
      title: 'Interactive Sponsor Booths',
      desc: 'Sponsors get dedicated branded booths with live product demos, embedded websites, downloadable collateral, and booth reps.'
    },
    {
      title: 'Breakout Workshops',
      desc: 'Seamlessly shift from a 500-person keynote into 20 hands-on roundtables without juggling complex breakout room links.'
    },
    {
      title: 'Host Megaphone & Announcements',
      desc: 'Event hosts can broadcast urgent announcements or transition cues across the entire venue with a single click.'
    },
    {
      title: 'Frictionless Guest Passes',
      desc: 'Guests join directly from any modern web browser using a single click. Zero app downloads or mandatory account registrations required.'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Choose or customize your venue',
      desc: 'Select from professionally designed conference halls, expo floors, campus quads, or build a custom floorplan from scratch.'
    },
    {
      step: '02',
      title: 'Distribute secure guest links',
      desc: 'Send invitations with calendar invites, VIP privileges, and custom ticketing integration.'
    },
    {
      step: '03',
      title: 'Run your event with host superpowers',
      desc: 'Control stage access, mute rogue audio, broadcast messages, and review real-time attendee engagement metrics.'
    }
  ];

  return (
    <div className="VirtualEventsPage_wrapper">
      {/* Hero Section */}
      <section className="virtual-events_heroContainer">
        <div className="Section_container Section_normal">
          <div className="virtual-events_hero">
            <div className="virtual-events_heroContent">
              <span style={{ color: '#8b5cf6', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem' }}>
                SPATIAL EXPERIENCES
              </span>
              <h1 className="h1" style={{ lineHeight: 1.15 }}>
                Host unforgettable <br />
                <span style={{ color: '#7c3aed' }}>virtual events.</span>
              </h1>
              <p className="bodyText" style={{ color: '#64748b', fontSize: '1.25rem', lineHeight: 1.6 }}>
                Say goodbye to passive, exhausting webinars. In Spot, attendees move freely between auditoriums, networking lounges, sponsor booths, and workshop tables just like a real summit.
              </p>
              <div className="virtual-events_actions">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green"
                >
                  Create an Event Space
                </button>
                <button
                  onClick={() => openAuthModal('demo')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline"
                >
                  Talk to Event Specialist
                </button>
              </div>
            </div>

            <div style={{ width: '50%', maxWidth: '540px' }}>
              <img
                src="https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Ftabs%2Fmeetings.webp&w=1920&q=75"
                alt="Spot Virtual Events Space"
                style={{ width: '100%', borderRadius: '1.5rem', boxShadow: '0 20px 45px rgba(124, 58, 237, 0.15)' }}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6 Event Capabilities Grid */}
      <section className="virtual-events_eventBulletsContainer">
        <div className="Section_container Section_normal virtual-events_container">
          <h3 className="h2">Everything your conference needs</h3>
          <div className="virtual-events_eventBullets">
            {eventFeatures.map((feat, idx) => (
              <div key={idx} className="virtual-events_eventBullet" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="virtual-events_iconContainer">
                    <CheckCircle2 size={16} />
                  </div>
                  <strong style={{ fontSize: '1.1rem', color: '#1e293b' }}>{feat.title}</strong>
                </div>
                <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.5, margin: 0 }}>
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 Steps Section */}
      <section style={{ backgroundColor: '#ffffff', padding: '6rem 0' }}>
        <div className="Section_container Section_normal">
          <div style={{ textAlign: 'center', maxWidth: '36rem', margin: '0 auto 4rem' }}>
            <div style={{ color: '#59a7f0', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              SIMPLE WORKFLOW
            </div>
            <h2 className="h2">How to launch your event in 3 steps</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }}>
            {steps.map((step, idx) => (
              <div
                key={idx}
                style={{
                  padding: '2.5rem 2rem',
                  borderRadius: '1.25rem',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc'
                }}
              >
                <div style={{ fontSize: '2rem', fontWeight: 800, color: '#60c449', marginBottom: '1rem', fontFamily: "'Space Grotesk', monospace" }}>
                  {step.step}
                </div>
                <h3 className="h3" style={{ fontSize: '1.25rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                  {step.title}
                </h3>
                <p style={{ color: '#64748b', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizer Testimonial */}
      <section style={{ backgroundColor: '#faf5ff', padding: '5rem 0', borderTop: '1px solid #ede9fe' }}>
        <div className="Section_container Section_normal">
          <div style={{ maxWidth: '44rem', margin: '0 auto', textAlign: 'center' }}>
            <span style={{ fontSize: '3rem', color: '#8b5cf6', lineHeight: 1 }}>“</span>
            <p className="h3" style={{ fontWeight: 600, color: '#3b0764', margin: '1rem 0 2rem' }}>
              Spot turned our annual developer conference from a static 4-hour Zoom webinar into a bustling summit where people actually made friends, engaged sponsors, and closed deals in the expo hall.
            </p>
            <div style={{ fontWeight: 700, color: '#1e293b' }}>Sarah Chen</div>
            <div style={{ color: '#7c3aed', fontSize: '0.95rem' }}>Head of Global Community, CloudNative Summit</div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="CTASection_section" style={{ backgroundColor: '#ffffff', padding: '5rem 0' }}>
        <div className="Section_container Section_normal">
          <div className="CTASection_banner">
            <div className="CTASection_content">
              <h2 className="CTASection_title h2">Ready to plan your next summit?</h2>
              <p className="CTASection_subtitle">
                Talk to our event producers about custom venue design, sponsor onboarding, and live day-of production assistance.
              </p>
              <div className="CTASection_buttonWrapper">
                <button
                  onClick={() => openAuthModal('demo')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green CTASection_button"
                >
                  Book Event Consultation
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline CTASection_button"
                  style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}
                >
                  Create Free Event Space
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
