import React, { useState } from 'react';
import { X, Sparkles, RefreshCw, Copy, Check, MessageSquare, Coffee, Compass } from 'lucide-react';

/**
 * WatercoolerWidget: Accurate reproduction of Spot Virtual's WatercoolerWidget
 * from spotvirtual.com static/vite/WatercoolerWidget-C9mpHI6Q.js.
 * Provides curated team prompts, icebreakers, and casual banter questions for meeting warmups.
 */
export default function WatercoolerWidget({ isOpen, onClose }) {
  const prompts = [
    { category: 'Icebreaker', question: 'What was your dream job when you were 8 years old?' },
    { category: 'Tech & Work', question: 'What is the one developer tool or shortcut you could never live without?' },
    { category: 'Just For Fun', question: 'If you had to eat only one meal for the rest of your life, what is on the plate?' },
    { category: 'Deep Thoughts', question: 'What is the best piece of career advice anyone ever gave you?' },
    { category: 'Travel', question: 'What is the most memorable trip or city you have ever explored?' },
    { category: 'Tech & Work', question: 'Tabs or Spaces? Dark Mode or Light Mode? Defend your answer!' },
    { category: 'Icebreaker', question: 'What song or artist do you put on when you need 100% focus coding music?' },
    { category: 'Just For Fun', question: 'What is your most controversial pizza or food opinion?' },
    { category: 'Work Culture', question: 'What would your personal superpower be in the virtual office?' },
    { category: 'Icebreaker', question: 'What is a book, movie, or game that completely changed the way you think?' }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentPrompt = prompts[currentIndex];

  const nextPrompt = () => {
    setCurrentIndex((prev) => (prev + 1) % prompts.length);
    setCopied(false);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(currentPrompt.question);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(15, 23, 42, 0.72)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        width: '520px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        border: '1px solid #cbd5e1',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #10b981, #059669)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>☕</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Conference B: Watercooler Chat</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.85 }}>Spot Icebreaker & Warmup Prompt Generator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Card Body */}
        <div style={{ padding: '32px 24px', textAlign: 'center', background: '#f8fafc' }}>
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            borderRadius: '2rem',
            background: '#d1fae5',
            color: '#065f46',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            marginBottom: '16px'
          }}>
            {currentPrompt.category.toUpperCase()}
          </span>

          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.45,
            margin: '0 0 24px 0'
          }}>
            "{currentPrompt.question}"
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={nextPrompt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '2rem',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <RefreshCw size={16} />
              <span>Next Icebreaker</span>
            </button>

            <button
              onClick={copyPrompt}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 18px',
                borderRadius: '2rem',
                background: '#ffffff',
                color: '#334155',
                border: '1px solid #cbd5e1',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
              <span>{copied ? 'Copied to Chat!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          background: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.78rem',
          color: '#64748b'
        }}>
          <span>Prompt {currentIndex + 1} of {prompts.length}</span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#f1f5f9',
              color: '#334155',
              border: '1px solid #cbd5e1',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
