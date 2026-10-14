import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, Building, Mail, Lock, User } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'signup', selectedPlan = 'Growth' }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [plan, setPlan] = useState(selectedPlan);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="Modal_backdrop" onClick={resetAndClose}>
      <div className="Modal_card" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="Modal_close"
          onClick={resetAndClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Check size={32} />
            </div>
            <h2 className="mediumHeading" style={{ marginBottom: '0.75rem' }}>
              Welcome to Spot!
            </h2>
            <p className="mediumBodyText" style={{ marginBottom: '2rem' }}>
              Your workspace <strong>{companyName || 'Virtual HQ'}</strong> on the <strong>{plan}</strong> plan is ready to launch.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="ButtonLink_button ButtonLink_green ButtonLink_regular"
              style={{ width: '100%', borderRadius: '2rem' }}
            >
              Enter Virtual Workspace
            </button>
          </div>
        ) : (
          <div style={{ padding: '2.5rem' }}>
            {/* Modal Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ width: '1.75rem', height: '1.75rem', borderRadius: '50%', background: '#60c449', display: 'inline-block' }} />
                <span style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Spot</span>
              </div>
              <h2 className="smallHeading" style={{ fontSize: '1.35rem', color: '#1e293b' }}>
                {mode === 'signin' ? 'Sign in to your virtual HQ' : 'Create your virtual workspace'}
              </h2>
              <p className="smallBodyText" style={{ color: '#64748b', marginTop: '0.25rem' }}>
                {mode === 'signin' ? 'Welcome back! Enter your credentials below.' : '100% Free Forever. No credit card required.'}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '0.75rem', padding: '0.25rem', marginBottom: '1.75rem' }}>
              <button
                type="button"
                onClick={() => setMode('signup')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  background: mode === 'signup' ? '#ffffff' : 'transparent',
                  color: mode === 'signup' ? '#0f172a' : '#64748b',
                  boxShadow: mode === 'signup' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Instant Free Access
              </button>
              <button
                type="button"
                onClick={() => setMode('signin')}
                style={{
                  flex: 1,
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  background: mode === 'signin' ? '#ffffff' : 'transparent',
                  color: mode === 'signin' ? '#0f172a' : '#64748b',
                  boxShadow: mode === 'signin' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                Sign in
              </button>
            </div>

            {/* Google SSO Button */}
            <button
              type="button"
              onClick={() => setIsSuccess(true)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1e293b',
                backgroundColor: '#ffffff',
                marginBottom: '1.25rem',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', color: '#94a3b8', fontSize: '0.8rem' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mode === 'signup' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        required
                        placeholder="Alex Morgan"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.5rem', borderRadius: '0.65rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                      Company / Workspace Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Building size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                      <input
                        type="text"
                        required
                        placeholder="Acme Studio"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.5rem', borderRadius: '0.65rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Work Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    placeholder="alex@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.5rem', borderRadius: '0.65rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.85rem 0.65rem 2.5rem', borderRadius: '0.65rem', border: '1px solid #cbd5e1', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="ButtonLink_button ButtonLink_green ButtonLink_regular"
                style={{ width: '100%', borderRadius: '2rem', marginTop: '0.75rem' }}
              >
                {mode === 'signin' ? 'Sign in' : 'Create Free Workspace (100% Free)'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
