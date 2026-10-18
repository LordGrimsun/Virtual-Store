import React, { useState } from 'react';
import { X, BarChart3, Plus, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PollWidget({ isOpen, onClose }) {
  const [question, setQuestion] = useState('Where should we host the Friday Virtual Social?');
  const [options, setOptions] = useState([
    { id: 1, text: 'Swimming Pool & Sun Deck 🏊', votes: 4 },
    { id: 2, text: 'Arcade & Game Zone 🎮', votes: 7 },
    { id: 3, text: 'Terrace Giant Chessboard ♟️', votes: 3 },
    { id: 4, text: 'Auditorium Presentation 🎤', votes: 1 }
  ]);
  const [userVotedId, setUserVotedId] = useState(2);
  const [isCreating, setIsCreating] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');

  if (!isOpen) return null;

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = (optId) => {
    if (userVotedId === optId) return;
    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === optId) return { ...opt, votes: opt.votes + 1 };
        if (opt.id === userVotedId) return { ...opt, votes: Math.max(0, opt.votes - 1) };
        return opt;
      })
    );
    setUserVotedId(optId);
  };

  const handleCreatePoll = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newOpt1.trim() || !newOpt2.trim()) return;
    setQuestion(newQuestion);
    setOptions([
      { id: 1, text: newOpt1, votes: 0 },
      { id: 2, text: newOpt2, votes: 0 }
    ]);
    setUserVotedId(null);
    setIsCreating(false);
    setNewQuestion('');
    setNewOpt1('');
    setNewOpt2('');
  };

  return (
    <div style={{
      position: 'fixed',
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '460px',
      maxWidth: '92vw',
      background: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
      border: '1px solid #cbd5e1',
      zIndex: 1300,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0284c7, #0369a1)',
        padding: '14px 18px',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={18} />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Live Team Poll</h3>
        </div>
        <button
          onClick={onClose}
          style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
        >
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: '20px' }}>
        {!isCreating ? (
          <div>
            <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>
              {question}
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {options.map((opt) => {
                const pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
                const isSelected = userVotedId === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleVote(opt.id)}
                    style={{
                      position: 'relative',
                      border: isSelected ? '2px solid #0284c7' : '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      background: isSelected ? '#f0f9ff' : '#f8fafc',
                      overflow: 'hidden',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {/* Animated Fill Bar */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      width: `${pct}%`,
                      background: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'rgba(226, 232, 240, 0.65)',
                      zIndex: 0,
                      transition: 'width 0.4s ease'
                    }} />

                    <div style={{
                      position: 'relative',
                      zIndex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isSelected && <CheckCircle2 size={16} color="#0284c7" />}
                        <span style={{ fontSize: '13px', fontWeight: isSelected ? 700 : 500, color: '#1e293b' }}>
                          {opt.text}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284c7' }}>
                        {pct}% ({opt.votes})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#64748b'
            }}>
              <span>{totalVotes} total responses</span>
              <button
                onClick={() => setIsCreating(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#0284c7',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                + Create new poll
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreatePoll}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#0f172a' }}>Create New Poll</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Poll question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                required
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <input
                type="text"
                placeholder="Option 1"
                value={newOpt1}
                onChange={(e) => setNewOpt1(e.target.value)}
                required
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
              <input
                type="text"
                placeholder="Option 2"
                value={newOpt2}
                onChange={(e) => setNewOpt2(e.target.value)}
                required
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                style={{ padding: '6px 12px', borderRadius: '6px', background: '#f1f5f9', border: 'none', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: '6px 14px', borderRadius: '6px', background: '#0284c7', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}
              >
                Launch Poll
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
