import React from 'react';
import { Bot, Sparkles, Shield, Cpu, Zap, ArrowRight, Eye, Lock, MessageSquare, Terminal, CheckCircle2 } from 'lucide-react';

export default function AIAgentsPage({ openAuthModal, setCurrentPage }) {
  const valueProps = [
    {
      number: '01',
      title: 'Visible, Ambient Presence',
      description: "Unlike headless chatbots buried in a messaging channel, Spot AI agents sit at actual desks with live avatars. You can see when they're thinking, executing code, or waiting for feedback."
    },
    {
      number: '02',
      title: 'Context Without Disruption',
      description: 'Walk up to an agent’s desk or invite them into an active project room. They inherit spatial transcripts, screen context, and document data without requiring repetitive prompt engineering.'
    },
    {
      number: '03',
      title: 'Governed On Your Terms',
      description: 'Control agent boundaries with precision. Set room clearance levels, enforce human-in-the-loop approvals for sensitive API calls, and revoke access instantly if an agent goes off course.'
    }
  ];

  const controlFeatures = [
    {
      icon: <Lock size={24} color="#60c449" />,
      title: 'Spatial Access Zones',
      description: 'Restrict agents to specific project war rooms or development labs. Prevent agents from wandering into executive or private client rooms.'
    },
    {
      icon: <Shield size={24} color="#59a7f0" />,
      title: 'Human-in-the-Loop Signoffs',
      description: 'Configure high-impact actions (e.g. database commits, email broadcasts, production deployments) to require explicit confirmation from a team member.'
    },
    {
      icon: <Terminal size={24} color="#a855f7" />,
      title: 'Full Audit & Traceability',
      description: 'Review complete step-by-step reasoning logs, MCP tool invocations, token consumption, and response histories in an immutable audit dashboard.'
    }
  ];

  const agentCapabilities = [
    'Compatible with OpenClaw, LangChain, AutoGen, and custom MCP servers',
    'Real-time avatar animations indicating idle, thinking, and executing states',
    'Walk-up proximity audio & text queries directly at the agent’s desk',
    'Multi-agent war rooms where multiple autonomous agents cooperate',
    'Instant knowledge indexing of shared room whiteboards and files'
  ];

  return (
    <div className="AIAgentsPage_wrapper" style={{ backgroundColor: '#111827', color: '#ffffff' }}>
      {/* Hero Section */}
      <section className="ai-agents_heroSection">
        <div className="Section_container Section_normal">
          <div className="ai-agents_hero">
            <div className="ai-agents_heroCopy">
              <div className="ai-agents_eyebrow">
                <span className="ai-agents_liveDot" />
                Spot AI Agents &bull; Powered by OpenClaw
              </div>
              <h1 className="h1" style={{ color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
                Give your AI agents <br />
                <span style={{ color: '#60c449' }}>a desk in the office.</span>
              </h1>
              <p className="ai-agents_heroDescription">
                Bring autonomous AI teammates directly into your team's virtual workspace. They have visible avatars, ambient room awareness, walk-up interaction, and governed permissions right alongside human teammates.
              </p>
              <div className="ai-agents_heroActions">
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_green"
                >
                  Deploy an Agent <ArrowRight size={18} style={{ marginLeft: 8 }} />
                </button>
                <a
                  href="https://github.com/spotvirtual"
                  target="_blank"
                  rel="noreferrer"
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline-white"
                >
                  OpenClaw SDK Docs
                </a>
              </div>
            </div>

            <div className="ai-agents_heroVisual">
              <div className="ai-agents_heroImage">
                <img
                  src="https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Ftabs%2Ffloorplans.webp&w=1920&q=75"
                  alt="Spot AI Agent Workspace"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>

              {/* Floating Active Bot Pill */}
              <div className="ai-agents_agentBadge">
                <div className="ai-agents_agentAvatar">
                  <Bot size={20} color="#ffffff" />
                </div>
                <div className="ai-agents_agentIdentity">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <strong>DevBot Alpha</strong>
                    <span className="ai-agents_botLabel">AI Agent</span>
                  </div>
                  <span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60c449', display: 'inline-block' }} />
                    Analyzing PR #342 in Engineering Lab
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Section */}
      <section className="ai-agents_valueSection">
        <div className="Section_container Section_normal">
          <div className="ai-agents_valueIntro">
            <div className="ai-agents_darkEyebrow">Why Spatial AI?</div>
            <h2 className="h2" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              AI belongs in the workspace, not trapped in a sidebar.
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.15rem' }}>
              When AI agents inhabit the same virtual environment as your team, collaboration becomes intuitive, visible, and spontaneous.
            </p>
          </div>

          <div className="ai-agents_valueGrid">
            {valueProps.map((prop, idx) => (
              <div key={idx} className="ai-agents_valueProp">
                <div className="ai-agents_valueNumber">{prop.number}</div>
                <h3 className="h3" style={{ fontSize: '1.35rem', fontWeight: 700 }}>
                  {prop.title}
                </h3>
                <p>{prop.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcase 1: Walk-up Collaboration */}
      <section style={{ backgroundColor: '#ffffff', color: '#1e293b', padding: '6rem 0' }}>
        <div className="Section_container Section_normal">
          <div className="ai-agents_feature">
            <div className="ai-agents_featureCopy">
              <div className="ai-agents_sectionEyebrow">Natural Interaction</div>
              <h2 className="h2">Walk up to your agent’s desk and just talk.</h2>
              <p>
                No context-switching, no awkward copy-pasting into prompt windows. When you walk your avatar over to an agent’s desk, proximity audio connects instantly. Ask questions about the current build, brainstorm new product ideas, or ask them to generate unit tests with immediate visual feedback.
              </p>
            </div>
            <div className="ai-agents_featureVisual">
              <img
                src="https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Ftabs%2Fcollaboration.webp&w=1920&q=75"
                alt="Walk-up Agent Interaction"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase 2: Multi-Agent Teams */}
      <section style={{ backgroundColor: '#f8fafc', color: '#1e293b', padding: '6rem 0' }}>
        <div className="Section_container Section_normal">
          <div className="ai-agents_feature ai-agents_featureReversed">
            <div className="ai-agents_featureCopy">
              <div className="ai-agents_sectionEyebrow">Autonomous Workflows</div>
              <h2 className="h2">Coordinate multi-agent swarms in dedicated war rooms.</h2>
              <p>
                Group multiple AI agents into dedicated rooms where they work autonomously on complex pipelines. Watch the Research Agent pass data to the Synthesizer Agent, which writes documentation for your Engineering team to review when they clock in.
              </p>
            </div>
            <div className="ai-agents_featureVisual">
              <img
                src="https://www.spotvirtual.com/_next/image?url=%2Fimages%2Fpages%2Fhome%2Ftabs%2Fmeetings.webp&w=1920&q=75"
                alt="Multi-agent collaboration"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Governance & Controls Section */}
      <section className="ai-agents_controlSection">
        <div className="Section_container Section_normal">
          <div className="ai-agents_controlHeading">
            <div className="ai-agents_sectionEyebrow">Enterprise Governance</div>
            <h2 className="h2" style={{ color: '#1e293b', marginBottom: '1rem' }}>
              Full human oversight, zero rogue actions.
            </h2>
            <p className="bodyText" style={{ color: '#64748b' }}>
              You wouldn't grant an intern unrestricted root access on day one. Spot provides rigorous spatial and API guardrails for every agent in your space.
            </p>
          </div>

          <div className="ai-agents_controlGrid">
            {controlFeatures.map((feat, idx) => (
              <div key={idx} className="ai-agents_controlCard">
                <div style={{ marginBottom: '1.25rem' }}>{feat.icon}</div>
                <h3 className="h3" style={{ fontSize: '1.25rem' }}>{feat.title}</h3>
                <p>{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities & Protocol Compatibility */}
      <section className="ai-agents_availabilitySection">
        <div className="Section_container Section_normal">
          <div className="ai-agents_availability">
            <div>
              <div className="ai-agents_sectionEyebrow">Open Integration</div>
              <h2 className="h2" style={{ color: '#1e293b', marginBottom: '1.25rem' }}>
                Connect any agent framework in minutes.
              </h2>
              <p className="bodyText" style={{ color: '#64748b', marginBottom: '2rem' }}>
                Spot supports standard WebSockets and Model Context Protocol (MCP) bridges. Bring your own model from OpenAI, Anthropic, Google Gemini, or run local models via Ollama.
              </p>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="ButtonLink_button ButtonLink_regular ButtonLink_blue"
                >
                  Get API Key
                </button>
                <a
                  href="https://github.com/spotvirtual"
                  target="_blank"
                  rel="noreferrer"
                  className="ButtonLink_button ButtonLink_regular ButtonLink_outline"
                >
                  GitHub Repository
                </a>
              </div>
            </div>

            <div>
              <ul className="ai-agents_capabilityList">
                {agentCapabilities.map((cap, idx) => (
                  <li key={idx}>
                    <div className="ai-agents_capabilityIcon">
                      <CheckCircle2 size={18} />
                    </div>
                    <span>{cap}</span>
                  </li>
                ))}
              </ul>
              <div className="ai-agents_boundaryNote">
                * Zero prompt retention: Spot does not train models on your internal organizational discussions or agent actions.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dark Theme Bottom CTA */}
      <section style={{ backgroundColor: '#0b0f17', padding: '6rem 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="Section_container Section_normal">
          <div style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto' }}>
            <h2 className="h2" style={{ color: '#ffffff', marginBottom: '1.25rem' }}>
              Ready to introduce AI agents to your team?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
              Create your virtual office, invite your human teammates, and deploy your first OpenClaw bot in under 5 minutes.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => openAuthModal('signup')}
                className="ButtonLink_button ButtonLink_regular ButtonLink_green"
              >
                Deploy AI Agents Now
              </button>
              <button
                onClick={() => setCurrentPage('home')}
                className="ButtonLink_button ButtonLink_regular ButtonLink_outline-white"
              >
                Tour the Virtual Office
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
