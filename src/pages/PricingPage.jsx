import React, { useState } from 'react';
import { Check, X, ChevronDown, Sparkles, Shield, Zap, Users, ArrowRight, Heart, Gift, Globe, Bot, Building2 } from 'lucide-react';

export default function PricingPage({ openAuthModal, setCurrentPage }) {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const freePillars = [
    {
      icon: <Building2 size={24} color="#60c449" />,
      title: 'Unlimited Virtual Offices',
      items: [
        'Unlimited customizable spaces & rooms',
        'Custom furniture & floorplan editor',
        'Private focus pods & sound-isolated doors',
        'Interactive whiteboards & shared screens'
      ]
    },
    {
      icon: <Bot size={24} color="#59a7f0" />,
      title: 'Full AI Agent Access',
      items: [
        'OpenClaw autonomous agent integration',
        'Live spatial avatar presence at desks',
        'Walk-up proximity voice & text queries',
        'Multi-agent collaborative war rooms'
      ]
    },
    {
      icon: <Users size={24} color="#a855f7" />,
      title: 'Zero Member Limits',
      items: [
        'Unlimited teammates and members',
        'Instant frictionless guest drop-in links',
        'Simultaneous multi-display screen sharing',
        'Native macOS, Windows, Linux, & Web apps'
      ]
    }
  ];

  const comparisonRows = [
    { feature: 'Always-on 2D/3D spatial presence', spot: '$0 (Included)', slack: 'No', zoom: 'No', teams: 'No' },
    { feature: 'Walk-up audio & proximity conversation', spot: '$0 (Included)', slack: 'No', zoom: 'No', teams: 'No' },
    { feature: 'Integrated OpenClaw AI Agents', spot: '$0 (Included)', slack: 'No', zoom: 'No', teams: 'No' },
    { feature: 'Simultaneous multi-screen sharing', spot: '$0 (Included)', slack: 'No', zoom: '$13.33/user', teams: '$4/user' },
    { feature: 'Customizable virtual floorplans & desks', spot: '$0 (Included)', slack: 'No', zoom: 'No', teams: 'No' },
    { feature: 'Instant guest drop-in without login', spot: '$0 (Included)', slack: 'No', zoom: '$13.33/user', teams: 'No' },
    { feature: 'In-space whiteboards & casual games', spot: '$0 (Included)', slack: 'No', zoom: 'No', teams: 'No' },
    { feature: 'Automated AI meeting summaries', spot: '$0 (Included)', slack: '$8.75/user', zoom: '$13.33/user', teams: '$4/user' },
    { feature: 'Monthly cost per user', spot: '$0 (Free Forever)', slack: '$8.75 / mo', zoom: '$13.33 / mo', teams: '$4.00 / mo' }
  ];

  const faqs = [
    {
      question: 'Is Spot really 100% free?',
      answer: 'Yes! Spot is completely free to use. There are no paid tiers, no subscription fees, and no feature paywalls. You get unlimited team members, unlimited spaces, and full access to everything.'
    },
    {
      question: 'Are there any hidden limits or time-restricted trials?',
      answer: 'No. There are no 14-day trials or hidden limitations. Your workspace will never expire, and all features—including AI Agent integrations, multi-screen sharing, and custom floorplans—are permanently available.'
    },
    {
      question: 'Do I need a credit card to sign up or use Spot?',
      answer: 'Never. No credit card is required. You can launch a space or join an existing office with zero payment information.'
    },
    {
      question: 'How many team members and guests can I invite?',
      answer: 'You can invite as many team members and guests as you like. We do not enforce artificial seat limits or charge per-user licenses.'
    },
    {
      question: 'Are the AI Agent features included for free?',
      answer: 'Yes! Spot natively supports OpenClaw and Model Context Protocol (MCP) agents right out of the box at no additional platform fee.'
    },
    {
      question: 'What devices and operating systems does Spot support?',
      answer: 'Spot runs natively in all modern web browsers (Chrome, Edge, Safari, Firefox, Brave) and also provides dedicated high-performance desktop apps for macOS (Intel & Apple Silicon), Windows 10/11, and Linux.'
    }
  ];

  return (
    <div className="PricingPage_wrapper">
      {/* Hero Section */}
      <section className="HeroSection_pricingHero">
        <div className="Section_container Section_normal">
          <div className="HeroSection_contentWrapper_pricing">
            <div className="HeroSection_heroTextWrapper_pricing">
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(96, 196, 73, 0.15)',
                color: '#2e7d32',
                padding: '6px 14px',
                borderRadius: '2rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                width: 'fit-content'
              }}>
                <Gift size={16} color="#60c449" />
                100% Free &amp; Open Access
              </div>

              <h1 className="HeroSection_heroTitle_pricing h1">
                Everything is free. <br />
                <span className="HeroSection_green">Free to access &amp; use everything.</span>
              </h1>
              <div className="HeroSection_heroSubWrapper">
                <div className="HeroSection_highPerformerBadge">
                  <div style={{
                    background: '#60c449',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    lineHeight: '1.2'
                  }}>
                    $0 Forever Free
                  </div>
                </div>
                <div className="HeroSection_heroSubText bodyText">
                  No credit card required. No subscriptions. No seat limits. Complete access to virtual offices, AI agents, and events for everyone.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green"
                >
                  Launch Free Workspace <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </button>
                <button
                  onClick={() => setCurrentPage('ai-agents')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline"
                >
                  Explore AI Agents
                </button>
              </div>
            </div>

            <div className="HeroSection_imageWrapper_pricing">
              <img
                src="https://www.spotvirtual.com/images/pages/pricing/office.webp"
                alt="Spot Virtual Office Overview"
                className="HeroSection_office"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 100% Free Showcase Section */}
      <section className="PricingOptionsSection_section">
        <div className="Section_container Section_normal">
          <div className="PricingOptionsSection_contentWrapper">
            <div style={{ textAlign: 'center', maxWidth: '42rem' }}>
              <h2 className="h2" style={{ marginBottom: '0.75rem' }}>
                All features unlocked. Zero paywalls.
              </h2>
              <p className="bodyText" style={{ color: '#64748b' }}>
                We believe remote collaboration should be open, human, and accessible to every team, startup, and community on Earth.
              </p>
            </div>

            {/* Single Giant All-Access Free Banner Card */}
            <div style={{
              width: '100%',
              maxWidth: '960px',
              background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 50%, #f0f9ff 100%)',
              border: '2px solid #86efac',
              borderRadius: '2rem',
              padding: '3.5rem 3rem',
              boxShadow: '0 20px 50px rgba(96, 196, 73, 0.12)',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '-14px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#60c449',
                color: '#fff',
                padding: '6px 20px',
                borderRadius: '2rem',
                fontSize: '0.85rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                boxShadow: '0 4px 12px rgba(96, 196, 73, 0.35)'
              }}>
                100% Free For Everyone
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem', marginBottom: '2.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '4.5rem', fontWeight: 900, color: '#166534', fontFamily: "'Space Grotesk', monospace", lineHeight: 1 }}>
                      $0
                    </span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#475569' }}>
                      / forever free
                    </span>
                  </div>
                  <p style={{ color: '#4b5563', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Full unrestricted access for teams, universities, and open source communities.
                  </p>
                </div>

                <div>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="ButtonLink_button ButtonLink_regular ButtonLink_green"
                    style={{ fontSize: '1.15rem', padding: '1rem 2.5rem', borderRadius: '2rem' }}
                  >
                    Start Using Spot Free
                  </button>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '2rem',
                borderTop: '1px solid #dcfce7',
                paddingTop: '2.5rem'
              }}>
                {freePillars.map((pillar, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        borderRadius: '10px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {pillar.icon}
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b' }}>
                        {pillar.title}
                      </h3>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      {pillar.items.map((item, itemIdx) => (
                        <li key={itemIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', color: '#334155' }}>
                          <Check size={16} color="#60c449" strokeWidth={3} style={{ flexShrink: 0 }} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Free Spot vs Expensive Paid Competitors */}
      <section className="ComparisonSection_section_pricing">
        <div className="Section_container Section_normal">
          <div className="ComparisonSection_contentWrapper_pricing">
            <div className="ComparisonSection_header_pricing">
              <h2 className="h2" style={{ marginBottom: '1rem' }}>How Spot compares</h2>
              <p className="bodyText" style={{ color: '#64748b' }}>
                Why pay thousands of dollars in seat licenses when Spot gives your team superior spatial collaboration for free?
              </p>
            </div>

            <div className="ComparisonSection_comparisonGrid">
              {/* Header Row */}
              <div className="ComparisonSection_topRowBlock" style={{ justifyContent: 'flex-start', paddingLeft: '1.5rem' }}>
                Feature / Capability
              </div>
              <div className="ComparisonSection_topRowBlock ComparisonSection_spotBlock" style={{ color: '#15803d', fontWeight: 800 }}>
                Spot (100% Free)
              </div>
              <div className="ComparisonSection_topRowBlock">Slack</div>
              <div className="ComparisonSection_topRowBlock">Zoom</div>
              <div className="ComparisonSection_topRowBlock">MS Teams</div>

              {/* Rows */}
              {comparisonRows.map((row, idx) => {
                const isGray = idx % 2 === 1;
                const isCostRow = idx === comparisonRows.length - 1;

                return (
                  <React.Fragment key={idx}>
                    <div className={`ComparisonSection_gridBlock ${isGray ? 'ComparisonSection_gray' : ''}`} style={isCostRow ? { fontWeight: 800, color: '#0f172a' } : {}}>
                      {row.feature}
                    </div>

                    {/* Spot Column */}
                    <div className={`ComparisonSection_gridBlock ComparisonSection_bullet ComparisonSection_spotBlock`} style={isCostRow ? { color: '#166534', fontWeight: 800 } : {}}>
                      {isCostRow ? (
                        <span>{row.spot}</span>
                      ) : (
                        <div style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          borderRadius: '50%',
                          backgroundColor: '#60c449',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Slack Column */}
                    <div className={`ComparisonSection_gridBlock ComparisonSection_bullet ${isGray ? 'ComparisonSection_gray' : ''}`}>
                      {isCostRow ? (
                        <span style={{ color: '#dc2626', fontWeight: 600 }}>{row.slack}</span>
                      ) : row.slack === 'No' ? (
                        <X size={18} color="#cbd5e1" />
                      ) : (
                        <Check size={18} color="#60c449" />
                      )}
                    </div>

                    {/* Zoom Column */}
                    <div className={`ComparisonSection_gridBlock ComparisonSection_bullet ${isGray ? 'ComparisonSection_gray' : ''}`}>
                      {isCostRow ? (
                        <span style={{ color: '#dc2626', fontWeight: 600 }}>{row.zoom}</span>
                      ) : row.zoom === 'No' ? (
                        <X size={18} color="#cbd5e1" />
                      ) : (
                        <Check size={18} color="#60c449" />
                      )}
                    </div>

                    {/* Teams Column */}
                    <div className={`ComparisonSection_gridBlock ComparisonSection_bullet ${isGray ? 'ComparisonSection_gray' : ''}`}>
                      {isCostRow ? (
                        <span style={{ color: '#dc2626', fontWeight: 600 }}>{row.teams}</span>
                      ) : row.teams === 'No' ? (
                        <X size={18} color="#cbd5e1" />
                      ) : (
                        <Check size={18} color="#60c449" />
                      )}
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonial */}
      <section className="TestimonialSection_section_pricing">
        <div className="Section_container Section_normal">
          <div className="TestimonialSection_card">
            <div className="TestimonialSection_bottomWrapper">
              <div className="TestimonialSection_left">
                <img
                  src="https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Fuser-contrast.webp&w=640&q=75"
                  alt="Stian Sandsgaard"
                  className="TestimonialSection_image"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div className="TestimonialSection_right">
                <span style={{ fontSize: '2.5rem', color: '#59a7f0', lineHeight: 1 }}>“</span>
                <p className="TestimonialSection_quote_pricing h3" style={{ fontWeight: 600 }}>
                  Spot has completely revolutionized how our distributed team works together. We don't have to schedule 30-minute meetings just to ask a quick 30-second question. We walk over, talk, solve problems together, and get right back to work.
                </p>
                <div>
                  <div className="TestimonialSection_author">Stian Sandsgaard</div>
                  <div className="TestimonialSection_authorRole">Co-founder &amp; CTO, Contrast</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="FaqSection_section">
        <div className="Section_container Section_normal">
          <div className="FaqSection_contentWrapper">
            <div className="FaqSection_header">
              <h2 className="h2" style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h2>
              <p className="bodyText" style={{ color: '#64748b' }}>
                Everything you need to know about free and open access in Spot.
              </p>
            </div>

            <div className="FaqSection_faqWrapper">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div key={index} className="FaqSection_faqBlock">
                    <div
                      className="FaqSection_faqTop"
                      onClick={() => toggleFaq(index)}
                      role="button"
                      tabIndex={0}
                    >
                      <span className="FaqSection_question">{faq.question}</span>
                      <ChevronDown
                        size={20}
                        className={`FaqSection_chevron ${isOpen ? 'FaqSection_open' : ''}`}
                      />
                    </div>
                    {isOpen && (
                      <div className="FaqSection_faqContent">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="CTASection_section" style={{ backgroundColor: '#ffffff', padding: '5rem 0' }}>
        <div className="Section_container Section_normal">
          <div className="CTASection_banner">
            <div className="CTASection_content">
              <h2 className="CTASection_title h2">Ready to bring your team together for free?</h2>
              <p className="CTASection_subtitle">
                Create your custom virtual office in seconds. Free forever, no credit card required.
              </p>
              <div className="CTASection_buttonWrapper">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green CTASection_button"
                >
                  Start Free
                </button>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline CTASection_button"
                  style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}
                >
                  Explore Virtual Office
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
