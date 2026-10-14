import React from 'react';
import FeatureTabs from '../components/FeatureTabs';
import ComparisonSlider from '../components/ComparisonSlider';
import WorkspaceLiveDemo from '../components/WorkspaceLiveDemo';
import { Star, ArrowRight } from 'lucide-react';

export default function HomePage({ setCurrentPage, openAuthModal }) {
  const brandLogos = [
    { name: 'Uber', url: 'https://www.spotvirtual.com/_next/static/media/uber.b7bc7fb9.svg' },
    { name: 'Bungie', url: 'https://www.spotvirtual.com/_next/static/media/bungie.e5317b98.svg' },
    { name: 'American Express', url: 'https://www.spotvirtual.com/_next/static/media/american-express.e8442c00.svg' },
    { name: 'Rolls Royce', url: 'https://www.spotvirtual.com/_next/static/media/rolls-royce.6a86e5bf.svg' },
    { name: 'Apple', url: 'https://www.spotvirtual.com/_next/static/media/apple.df280f46.svg' },
    { name: 'Google', url: 'https://www.spotvirtual.com/_next/static/media/google.646de0b3.svg' },
    { name: 'Amazon', url: 'https://www.spotvirtual.com/_next/static/media/amazon.1901fe50.svg' },
    { name: 'Meta', url: 'https://www.spotvirtual.com/_next/static/media/meta.781a698d.svg' }
  ];

  return (
    <div className="HomePage_wrapper">
      {/* 1. Hero Section with Background Video */}
      <div className="index_backgroundVideoWrapper">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="BackgroundVideo_backgroundVideo"
          preload="auto"
        >
          <source src="https://www.spotvirtual.com/videos/hero.mp4" type="video/mp4" />
        </video>

        <section className="Section_section HeroSection_section">
          <div className="Section_container Section_normal">
            <div className="HeroSection_heroTextWrapper">
              <h1 className="HeroSection_heroTitle">
                The virtual workspace for humans and agents
              </h1>
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="ButtonLink_button ButtonLink_green ButtonLink_regular HeroSection_heroButton"
              >
                Start your free trial
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* 2. Social Proof Section */}
      <section className="Section_section SocialProofSection_section">
        <div className="Section_container Section_normal">
          <div className="SocialProofSection_contentWrapper">
            <div className="SocialProofSection_textWrapper smallBodyText">
              <div className="SocialProofSection_line" />
              <div>Loved by teams at</div>
              <div className="SocialProofSection_line" />
            </div>

            <div className="SocialProofSection_logosGrid">
              {brandLogos.map((brand, i) => (
                <img
                  key={i}
                  src={brand.url}
                  alt={`${brand.name} logo`}
                  className="SocialProofSection_logoImage"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section (5 Interactive Tabs) */}
      <FeatureTabs />

      {/* 4. Comparison Section (Old Way vs Spot Way) */}
      <ComparisonSlider />

      {/* 5. Quotes & Customer Reviews Section */}
      <section className="Section_section QuotesSection_section">
        <div className="Section_container Section_narrow">
          <div className="QuotesSection_contentWrapper">
            <img
              src="https://www.spotvirtual.com/_next/static/media/quotation.10867842.svg"
              alt="Quotation mark"
              className="QuotesSection_quotationMark"
            />
            <div>
              <div className="QuotesSection_mainTestimonialWrapper">
                <span className="xlargeHeading">
                  "I didn’t think the metaverse was for us, but I actually really like it."
                </span>
                <div className="QuotesSection_mainTestimonial">
                  <span className="mediumBodyText" style={{ color: '#cbd5e1' }}>
                    "When I first found Spot, I had seen one of their LinkedIn ads for a template that looked great for a company holiday party. We initially used it as an alternative to zoom happy hour for our remote team, and after that we were hooked. Our team found it fun and engaging, and it had a low barrier to entry. Giving everyone an instantaneous connection to their mic and video."
                  </span>
                  <div className="QuotesSection_testimonialsRating">
                    <div className="QuotesSection_starsWrapper">
                      {[...Array(5)].map((_, i) => (
                        <img
                          key={i}
                          src="https://www.spotvirtual.com/_next/static/media/star.915300b9.svg"
                          alt="5 star rating"
                        />
                      ))}
                    </div>
                    <div className="mediumBodyText QuotesSection_testimonialDate">
                      February 28, 2022
                    </div>
                  </div>
                </div>
              </div>

              <div className="QuotesSection_divider" />

              <div className="QuotesSection_shortTestimonialGrid">
                <div className="QuotesSection_shortTestimonial">
                  <span className="mediumBodyText">"The new era of working remotely"</span>
                  <div className="QuotesSection_testimonialsRating">
                    <div className="QuotesSection_starsWrapper">
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src="https://www.spotvirtual.com/_next/static/media/star.915300b9.svg" alt="star" />
                      ))}
                    </div>
                    <div className="smallBodyText QuotesSection_testimonialDate">June 11, 2022</div>
                  </div>
                </div>

                <div className="QuotesSection_shortTestimonial">
                  <span className="mediumBodyText">"Tried a few, liked Spot the best"</span>
                  <div className="QuotesSection_testimonialsRating">
                    <div className="QuotesSection_starsWrapper">
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src="https://www.spotvirtual.com/_next/static/media/star.915300b9.svg" alt="star" />
                      ))}
                    </div>
                    <div className="smallBodyText QuotesSection_testimonialDate">February 28, 2022</div>
                  </div>
                </div>

                <div className="QuotesSection_shortTestimonial">
                  <span className="mediumBodyText">"A game changer for team connectivity"</span>
                  <div className="QuotesSection_testimonialsRating">
                    <div className="QuotesSection_starsWrapper">
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src="https://www.spotvirtual.com/_next/static/media/star.915300b9.svg" alt="star" />
                      ))}
                    </div>
                    <div className="smallBodyText QuotesSection_testimonialDate">February 28, 2022</div>
                  </div>
                </div>

                <div className="QuotesSection_shortTestimonial">
                  <span className="mediumBodyText">"No dialing in, self navigate to meetings, 1:1s and Group chats."</span>
                  <div className="QuotesSection_testimonialsRating">
                    <div className="QuotesSection_starsWrapper">
                      {[...Array(5)].map((_, i) => (
                        <img key={i} src="https://www.spotvirtual.com/_next/static/media/star.915300b9.svg" alt="star" />
                      ))}
                    </div>
                    <div className="smallBodyText QuotesSection_testimonialDate">May 25, 2021</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Statistics Section */}
      <section className="Section_section StatisticsSection_section">
        <div className="Section_container Section_narrow">
          <div className="StatisticsSection_contentWrapper">
            <div className="StatisticsSection_topWrapper">
              <span className="mediumHeading">Spot the difference.</span>
              <div className="StatisticsSection_statsWrapper">
                <div className="StatisticsSection_statBlock">
                  <div className="StatisticsSection_stat">94% 🥰</div>
                  <div className="StatisticsSection_metric">
                    Say they <b>feel more connected</b> with their colleagues
                  </div>
                </div>

                <div className="StatisticsSection_statBlock">
                  <div className="StatisticsSection_stat">98% 👩‍💻</div>
                  <div className="StatisticsSection_metric">
                    Of <b>productivity increase</b> reported <b>per employee per day</b>
                  </div>
                </div>

                <div className="StatisticsSection_statBlock">
                  <div className="StatisticsSection_stat">0% 🤦</div>
                  <div className="StatisticsSection_metric">
                    Awkward <b>Zoom happy hours</b> or dead “fun” channels
                  </div>
                </div>
              </div>
            </div>

            <div className="StatisticsSection_divider" />

            <div className="StatisticsSection_bottomWrapper">
              <span className="smallHeading">Create a virtual workspace that your team love.</span>
              <button
                type="button"
                onClick={() => openAuthModal('signup')}
                className="ButtonLink_button ButtonLink_green ButtonLink_regular"
                style={{ borderRadius: '2rem' }}
              >
                Start your free trial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Detailed Customer Case Studies */}
      <section className="Section_section TestimonialsSection_section">
        <div className="Section_container Section_narrow">
          <div className="TestimonialsSection_contentWrapper">
            <h2 className="TestimonialsSection_header xlargeHeading">
              Why teams around the world ❤️ Spot
            </h2>

            <div className="TestimonialsSection_testimonialBlocks">
              {/* Case 1: Smart.vet */}
              <div className="TestimonialsSection_blockWrapper">
                <div className="TestimonialsSection_blockTextWrapper">
                  <div className="mediumHeading" style={{ maxWidth: '28ch', color: '#1e293b' }}>
                    Say goodbye to disconnect. Say hello to frictionless communication.
                  </div>
                  <div className="TestimonialsSection_quote mediumBodyText">
                    "We knew chat and video calls were stifling our team's communications, but we thought it was the only way to do things. Then when we switched to Spot, the difference was <i>immediate</i>. Now we can just walk up to each other's desks to chat about work, life, and everything in between, just like we used to in the office."
                  </div>
                  <div className="TestimonialsSection_authorWrapper smallBodyText">
                    <div className="TestimonialsSection_author">Michael Parent</div>
                    <div className="TestimonialsSection_dividerSmall" />
                    <span>Co-founder at Smart.vet</span>
                  </div>
                </div>

                <div className="TestimonialsSection_blockImageWrapper" style={{ backgroundColor: '#EDF9FE' }}>
                  <img
                    src="https://www.spotvirtual.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsmartvet-screenshot.ceeb8c42.png&w=1920&q=100"
                    alt="SmartVet office screenshot"
                    className="bgScreenshot"
                  />
                  <div className="TestimonialsSection_companyLogoWrapper">
                    <img
                      src="https://www.spotvirtual.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsmartvet.78dffb97.png&w=640&q=75"
                      alt="SmartVet logo"
                    />
                  </div>
                </div>
              </div>

              {/* Case 2: Swoop */}
              <div className="TestimonialsSection_blockWrapper">
                <div className="TestimonialsSection_blockTextWrapper">
                  <div className="mediumHeading" style={{ maxWidth: '28ch', color: '#1e293b' }}>
                    Feel like a close-knit team again, not a collection of green dots.
                  </div>
                  <div className="TestimonialsSection_quote mediumBodyText">
                    "You don’t realize what an impact it has on team spirit to not be able to watch a funny video together or high-five a colleague for a big win. Then you step into Spot and you suddenly feel like a close-knit team again. It’s magic."
                  </div>
                  <div className="TestimonialsSection_authorWrapper smallBodyText">
                    <div className="TestimonialsSection_author">Michael Gropper</div>
                    <div className="TestimonialsSection_dividerSmall" />
                    <span>Head of People and Culture at Swoop</span>
                  </div>
                </div>

                <div className="TestimonialsSection_blockImageWrapper" style={{ backgroundColor: '#FEF9ED' }}>
                  <img
                    src="https://www.spotvirtual.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fswoop-screenshot.e88b68a8.png&w=1920&q=100"
                    alt="Swoop office screenshot"
                    className="bgScreenshot"
                  />
                  <div className="TestimonialsSection_companyLogoWrapper">
                    <img
                      src="https://www.spotvirtual.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fswoop.62138c25.png&w=1200&q=75"
                      alt="Swoop logo"
                    />
                  </div>
                </div>
              </div>

              {/* Case 3: SDWAN */}
              <div className="TestimonialsSection_blockWrapper">
                <div className="TestimonialsSection_blockTextWrapper">
                  <div className="mediumHeading" style={{ maxWidth: '32ch', color: '#1e293b' }}>
                    A productivity tool that adapts to your team, not the other way around.
                  </div>
                  <div className="TestimonialsSection_quote mediumBodyText">
                    "Our team loves the whiteboards, self-navigating to meetings, multiple screen shares, KPIs on the walls, headphone mode, built-in call recording... long story short, Spot hasn’t just made us feel like a team again, it’s sent our productivity through the roof."
                  </div>
                  <div className="TestimonialsSection_authorWrapper smallBodyText">
                    <div className="TestimonialsSection_author">Anthony Senter</div>
                    <div className="TestimonialsSection_dividerSmall" />
                    <span>CEO at SDWAN</span>
                  </div>
                </div>

                <div className="TestimonialsSection_blockImageWrapper" style={{ backgroundColor: '#F5EDFE' }}>
                  <img
                    src="https://www.spotvirtual.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsdwan-screenshot.b645fb1e.png&w=1920&q=100"
                    alt="SDWAN office screenshot"
                    className="bgScreenshot"
                  />
                  <div className="TestimonialsSection_companyLogoWrapper">
                    <img
                      src="https://www.spotvirtual.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fsdwan.a53fe835.png&w=1920&q=75"
                      alt="SDWAN logo"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Humans + AI Agents Banner */}
      <section className="Section_section AgentWorkspaceSection_section">
        <div className="Section_container Section_normal AgentWorkspaceSection_content">
          <div className="AgentWorkspaceSection_copy">
            <div className="AgentWorkspaceSection_eyebrow">Humans + AI agents</div>
            <h2 className="largeHeading">Did we mention AI agents?</h2>
            <p>
              Connect your own AI agent through Spot's robust, agent-friendly API. Give it a visible bot identity, governed access to live text conversations, and native ways to collaborate in channels and threads—without asking your team to work in another tool.
            </p>
            <div className="AgentWorkspaceSection_actions">
              <button
                type="button"
                onClick={() => { setCurrentPage('ai-agents'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="ButtonLink_button ButtonLink_green ButtonLink_regular"
                style={{ borderRadius: '2rem' }}
              >
                Explore AI Agents
              </button>
              <button
                type="button"
                onClick={() => { setCurrentPage('ai-agents'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="ButtonLink_button ButtonLink_outline-white ButtonLink_regular"
                style={{ borderRadius: '2rem' }}
              >
                Connect OpenClaw
              </button>
            </div>
          </div>

          <figure className="AgentWorkspaceSection_visual">
            <div className="AgentWorkspaceSection_screenshot">
              <img
                src="https://www.spotvirtual.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Favatar-presence.96c4548d.png&w=1920&q=75"
                alt="A teammate and a bot avatar sharing a Spot virtual office"
              />
            </div>
            <figcaption className="AgentWorkspaceSection_caption">
              <span className="AgentWorkspaceSection_liveDot" aria-hidden="true" />
              OpenClaw Agent — present in Spot
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 9. Interactive Live Workspace Simulator */}
      <section className="Section_section" style={{ padding: '4rem 8rem', background: '#0f172a' }}>
        <div className="Section_container Section_normal">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#ffffff' }}>
            <span style={{ color: '#60c449', fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Hands-On Simulation
            </span>
            <h2 className="largeHeading" style={{ marginTop: '0.5rem', color: '#fff' }}>
              Experience the Spot Virtual HQ
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: '50ch', margin: '0.5rem auto 0' }}>
              Walk around with your avatar, approach team pods, wave at the OpenClaw AI agent, and trigger celebratory emotes.
            </p>
          </div>
          <WorkspaceLiveDemo />
        </div>
      </section>

      {/* 10. Call to Action Banner */}
      <section className="Section_section">
        <div className="Section_container Section_normal">
          <div className="CallToAction_contentWrapper">
            <div className="CallToAction_topWrapper">
              <div className="CallToAction_circles">
                <img
                  src="https://www.spotvirtual.com/_next/static/media/circles.4f97ee20.svg"
                  alt=""
                />
              </div>
              <h2 className="CallToAction_title mediumHeading">
                Join 20,000+ teams using Spot to make this new way of working, work.
              </h2>
              <p className="CallToAction_subtext mediumBodyText">
                Embrace the new normal with your very own, customizable online workspace that gives you the best of in-person and remote working.
              </p>
              <div className="CallToAction_buttonWrapper">
                <div className="CallToAction_greenBlur" />
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_blue ButtonLink_regular CallToAction_button"
                >
                  Start free trial
                </button>
              </div>
            </div>

            <div className="CallToAction_socialProofWrapper">
              <div className="smallBodyText">Join teams like...</div>
              <div className="CallToAction_logosGrid">
                {brandLogos.slice(0, 6).map((brand, i) => (
                  <div key={i} className="CallToAction_logoBox">
                    <img src={brand.url} alt={`${brand.name} logo`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
