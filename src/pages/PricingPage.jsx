import React, { useState } from 'react';
import { Check, X, ChevronDown, Sparkles, Shield, Zap, Users, ArrowRight } from 'lucide-react';

export default function PricingPage({ openAuthModal, setCurrentPage }) {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const pricingPlans = [
    {
      id: 'basic',
      name: 'Basic',
      price: isYearly ? '$6' : '$8',
      period: 'per user / month',
      description: 'Small teams who want to build a shared space to work together asynchronously & in real-time.',
      buttonText: 'Start Free Trial',
      buttonStyle: 'ButtonLink_outline',
      isPopular: false,
      features: [
        'Up to 25 active members',
        'Unlimited guest passes',
        '1 dedicated customizable space',
        '2 simultaneous screen shares',
        'Permanent chat history & search',
        'OpenClaw AI Bot ready',
        'Standard floorplan library'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: isYearly ? '$10' : '$13',
      period: 'per user / month',
      description: 'Growing companies looking to boost communication, spontaneous collaboration, and team culture.',
      buttonText: 'Start Free Trial',
      buttonStyle: 'ButtonLink_green',
      isPopular: true,
      features: [
        'Everything in Basic, plus:',
        'Up to 100 active members',
        'Unlimited customizable spaces',
        '5 simultaneous screen shares',
        'Priority email & chat support',
        'AI meeting transcriptions & notes',
        'Advanced roles and permissions',
        'Custom asset library & office branding'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: "Let's chat",
      period: 'custom agreement',
      description: 'Large organizations that need advanced security, dedicated compliance, and custom onboarding.',
      buttonText: 'Contact Sales',
      buttonStyle: 'ButtonLink_blue',
      isPopular: false,
      features: [
        'Everything in Growth, plus:',
        'Unlimited members and spaces',
        'Dedicated Account Manager & 99.9% SLA',
        'SAML 2.0 Single Sign-On (Okta, Google, Azure)',
        'Custom Security Review & SOC2/DPA',
        'Compliance audit logs & export APIs',
        'Tailored team onboarding & architecture'
      ]
    }
  ];

  const comparisonRows = [
    { feature: 'Always-on 2D/3D spatial presence', spot: true, slack: false, zoom: false, teams: false },
    { feature: 'Walk-up audio & proximity conversation', spot: true, slack: false, zoom: false, teams: false },
    { feature: 'Integrated OpenClaw AI Agents', spot: true, slack: false, zoom: false, teams: false },
    { feature: 'Simultaneous multi-screen sharing', spot: true, slack: false, zoom: true, teams: true },
    { feature: 'Customizable virtual floorplans & desks', spot: true, slack: false, zoom: false, teams: false },
    { feature: 'Instant guest drop-in without login', spot: true, slack: false, zoom: true, teams: false },
    { feature: 'In-space whiteboards & casual games', spot: true, slack: false, zoom: false, teams: false },
    { feature: 'Automated AI meeting summaries', spot: true, slack: true, zoom: true, teams: true }
  ];

  const faqs = [
    {
      question: 'Can I try Spot for free?',
      answer: 'Yes! Every organization gets a full 14-day free trial with unlimited access to all features on the Growth plan. No credit card is required to sign up.'
    },
    {
      question: 'How does guest access work?',
      answer: 'Guests can enter your Spot space without creating an account or installing anything via a simple, secure link. You can restrict guest access to specific lobbies or meeting rooms.'
    },
    {
      question: 'Can I upgrade, downgrade, or cancel at any time?',
      answer: 'Yes, your subscription is completely flexible. You can adjust user seats, switch between monthly and annual billing, or cancel anytime directly from your team settings.'
    },
    {
      question: 'Do you offer non-profit or educational discounts?',
      answer: 'We provide a 30% discount for registered non-profit organizations, accredited schools, and student research labs. Contact our sales team with your organization details to apply.'
    },
    {
      question: 'What devices and operating systems does Spot support?',
      answer: 'Spot runs natively in modern web browsers (Chrome, Edge, Safari, Firefox, Brave) and also provides dedicated high-performance desktop apps for macOS (Intel & Apple Silicon), Windows 10/11, and Linux.'
    },
    {
      question: 'How secure is our audio, video, and communication data?',
      answer: 'Security is paramount at Spot. All media streams use encrypted WebRTC connections with DTLS/SRTP. Data at rest is encrypted using AES-256, and data in transit is protected with TLS 1.3.'
    }
  ];

  return (
    <div className="PricingPage_wrapper">
      {/* Hero Section */}
      <section className="HeroSection_pricingHero">
        <div className="Section_container Section_normal">
          <div className="HeroSection_contentWrapper_pricing">
            <div className="HeroSection_heroTextWrapper_pricing">
              <h1 className="HeroSection_heroTitle_pricing h1">
                Fair pricing, <br />
                <span className="HeroSection_green">no fluff.</span>
              </h1>
              <div className="HeroSection_heroSubWrapper">
                <div className="HeroSection_highPerformerBadge">
                  <div style={{
                    background: '#ff4d4f',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    fontWeight: '800',
                    fontSize: '0.75rem',
                    lineHeight: '1.2'
                  }}>
                    G2 High Performer
                  </div>
                </div>
                <div className="HeroSection_heroSubText bodyText">
                  No credit card required. Free 14-day trial on all tiers. Upgrade or cancel anytime.
                </div>
              </div>
            </div>

            <div className="HeroSection_imageWrapper_pricing">
              <img
                src="https://www.spotvirtual.com/images/pages/pricing/office.webp"
                alt="Spot Virtual Office Overview"
                className="HeroSection_office"
                onError={(e) => {
                  // Fallback to high-res vector graphic if image loading fails
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Options Section */}
      <section className="PricingOptionsSection_section">
        <div className="Section_container Section_normal">
          <div className="PricingOptionsSection_contentWrapper">
            {/* Toggle Switch */}
            <div
              className="PricingOptionsSection_buttonWrapper"
              onClick={() => setIsYearly(!isYearly)}
              role="button"
              tabIndex={0}
              aria-label="Toggle annual or monthly billing"
            >
              <span style={{ color: !isYearly ? '#1e293b' : '#64748b' }}>Monthly</span>
              <div className={`PricingOptionsSection_toggleButton ${isYearly ? 'PricingOptionsSection_yearly' : ''}`}>
                <div className="PricingOptionsSection_toggleCircle" />
              </div>
              <span className="PricingOptionsSection_yearlyText" style={{ color: isYearly ? '#1e293b' : '#64748b' }}>
                Yearly
                <span className="PricingOptionsSection_discountDisclaimer">20% off</span>
              </span>
            </div>

            {/* Pricing Cards Grid */}
            <div className="PricingOptionsSection_optionsGrid">
              {pricingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`PricingOptionsSection_optionBlock ${plan.isPopular ? 'PricingOptionsSection_active' : ''}`}
                >
                  {plan.isPopular && (
                    <div className="PricingOptionsSection_popularTag">Most Popular</div>
                  )}

                  <div>
                    <h3 className="h3" style={{ marginBottom: '0.5rem', fontWeight: 800 }}>
                      {plan.name}
                    </h3>
                    <div className="PricingOptionsSection_title">
                      <span className="h1" style={{ fontSize: '2.75rem', fontWeight: 800, color: '#1e293b' }}>
                        {plan.price}
                      </span>
                      <span className="PricingOptionsSection_perUserText">/{plan.period}</span>
                    </div>
                    <p className="PricingOptionsSection_perfectFor xsmallBodyText">
                      {plan.description}
                    </p>

                    <div className="PricingOptionsSection_bulletWrapper">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
                          <Check size={18} color="#60c449" style={{ flexShrink: 0 }} />
                          <span style={{ color: '#334155' }}>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => openAuthModal(plan.id === 'enterprise' ? 'demo' : 'signup')}
                    className={`ButtonLink_button ButtonLink_regular PricingOptionsSection_button ${plan.buttonStyle}`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Matrix */}
      <section className="ComparisonSection_section_pricing">
        <div className="Section_container Section_normal">
          <div className="ComparisonSection_contentWrapper_pricing">
            <div className="ComparisonSection_header_pricing">
              <h2 className="h2" style={{ marginBottom: '1rem' }}>How Spot compares</h2>
              <p className="bodyText" style={{ color: '#64748b' }}>
                See why forward-thinking remote and hybrid teams replace disconnected tools with Spot.
              </p>
            </div>

            <div className="ComparisonSection_comparisonGrid">
              {/* Header Row */}
              <div className="ComparisonSection_topRowBlock" style={{ justifyContent: 'flex-start', paddingLeft: '1.5rem' }}>
                Feature / Capability
              </div>
              <div className="ComparisonSection_topRowBlock ComparisonSection_spotBlock" style={{ color: '#0284c7' }}>
                Spot Virtual
              </div>
              <div className="ComparisonSection_topRowBlock">Slack</div>
              <div className="ComparisonSection_topRowBlock">Zoom</div>
              <div className="ComparisonSection_topRowBlock">MS Teams</div>

              {/* Rows */}
              {comparisonRows.map((row, idx) => {
                const isGray = idx % 2 === 1;
                return (
                  <React.Fragment key={idx}>
                    <div className={`ComparisonSection_gridBlock ${isGray ? 'ComparisonSection_gray' : ''}`}>
                      {row.feature}
                    </div>
                    <div className={`ComparisonSection_gridBlock ComparisonSection_bullet ComparisonSection_spotBlock`}>
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
                    </div>
                    <div className={`ComparisonSection_gridBlock ComparisonSection_bullet ${isGray ? 'ComparisonSection_gray' : ''}`}>
                      {row.slack ? (
                        <Check size={18} color="#60c449" />
                      ) : (
                        <X size={18} color="#cbd5e1" />
                      )}
                    </div>
                    <div className={`ComparisonSection_gridBlock ComparisonSection_bullet ${isGray ? 'ComparisonSection_gray' : ''}`}>
                      {row.zoom ? (
                        <Check size={18} color="#60c449" />
                      ) : (
                        <X size={18} color="#cbd5e1" />
                      )}
                    </div>
                    <div className={`ComparisonSection_gridBlock ComparisonSection_bullet ${isGray ? 'ComparisonSection_gray' : ''}`}>
                      {row.teams ? (
                        <Check size={18} color="#60c449" />
                      ) : (
                        <X size={18} color="#cbd5e1" />
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
                Everything you need to know about Spot plans, onboarding, and billing.
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
              <h2 className="CTASection_title h2">Ready to bring your team together?</h2>
              <p className="CTASection_subtitle">
                Create your custom virtual office in seconds. Free 14-day trial, no credit card required.
              </p>
              <div className="CTASection_buttonWrapper">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green CTASection_button"
                >
                  Start Free Trial
                </button>
                <button
                  onClick={() => openAuthModal('demo')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline CTASection_button"
                  style={{ borderColor: 'rgba(255,255,255,0.7)', color: '#fff' }}
                >
                  Book a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
