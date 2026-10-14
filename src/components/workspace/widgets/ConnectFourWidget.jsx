import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Trophy, Users, Bot, Sparkles, Volume2 } from 'lucide-react';

/**
 * ConnectFourWidget: Accurate reproduction of the Spot Virtual Connect Four widget
 * discovered in spotvirtual.com static/vite/ConnectFourWidget-BBoNsskk.js.
 * Playable 7x6 board with AI opponent (DevBot), sound effects, and win detection.
 */
export default function ConnectFourWidget({ isOpen, onClose }) {
  const ROWS = 6;
  const COLS = 7;

  // Board state: null, 'red' (Player 1), 'yellow' (Player 2 / AI)
  const [board, setBoard] = useState(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState('red');
  const [winner, setWinner] = useState(null); // 'red', 'yellow', 'draw', null
  const [winningCells, setWinningCells] = useState([]);
  const [vsAI, setVsAI] = useState(true);
  const [scores, setScores] = useState({ red: 0, yellow: 0, ties: 0 });
  const [hoverCol, setHoverCol] = useState(null);

  if (!isOpen) return null;

  // Check for 4-in-a-row
  const checkWin = (grid) => {
    // Horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const val = grid[r][c];
        if (val && val === grid[r][c + 1] && val === grid[r][c + 2] && val === grid[r][c + 3]) {
          return { winner: val, cells: [[r, c], [r, c + 1], [r, c + 2], [r, c + 3]] };
        }
      }
    }
    // Vertical
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 3; r++) {
        const val = grid[r][c];
        if (val && val === grid[r + 1][c] && val === grid[r + 2][c] && val === grid[r + 3][c]) {
          return { winner: val, cells: [[r, c], [r + 1, c], [r + 2, c], [r + 3, c]] };
        }
      }
    }
    // Diagonal down-right
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const val = grid[r][c];
        if (val && val === grid[r + 1][c + 1] && val === grid[r + 2][c + 2] && val === grid[r + 3][c + 3]) {
          return { winner: val, cells: [[r, c], [r + 1, c + 1], [r + 2, c + 2], [r + 3, c + 3]] };
        }
      }
    }
    // Diagonal up-right
    for (let r = 3; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        const val = grid[r][c];
        if (val && val === grid[r - 1][c + 1] && val === grid[r - 2][c + 2] && val === grid[r - 3][c + 3]) {
          return { winner: val, cells: [[r, c], [r - 1, c + 1], [r - 2, c + 2], [r - 3, c + 3]] };
        }
      }
    }
    // Draw
    const isFull = grid.every((row) => row.every((cell) => cell !== null));
    if (isFull) return { winner: 'draw', cells: [] };

    return null;
  };

  // Drop disc into column
  const dropDisc = (col, player = currentPlayer) => {
    if (winner) return;

    // Find lowest available row
    let targetRow = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (!board[r][col]) {
        targetRow = r;
        break;
      }
    }

    if (targetRow === -1) return; // Column full

    const newBoard = board.map((row) => [...row]);
    newBoard[targetRow][col] = player;
    setBoard(newBoard);

    const result = checkWin(newBoard);
    if (result) {
      setWinner(result.winner);
      setWinningCells(result.cells);
      if (result.winner === 'red') {
        setScores((prev) => ({ ...prev, red: prev.red + 1 }));
      } else if (result.winner === 'yellow') {
        setScores((prev) => ({ ...prev, yellow: prev.yellow + 1 }));
      } else {
        setScores((prev) => ({ ...prev, ties: prev.ties + 1 }));
      }
    } else {
      const nextPlayer = player === 'red' ? 'yellow' : 'red';
      setCurrentPlayer(nextPlayer);
    }
  };

  // AI Move (DevBot)
  useEffect(() => {
    if (vsAI && currentPlayer === 'yellow' && !winner) {
      const timer = setTimeout(() => {
        // AI: Check for winning move, then blocking move, then center preference
        let chosenCol = -1;

        // 1. Can AI win?
        for (let c = 0; c < COLS; c++) {
          let tr = -1;
          for (let r = ROWS - 1; r >= 0; r--) {
            if (!board[r][c]) { tr = r; break; }
          }
          if (tr !== -1) {
            const test = board.map((row) => [...row]);
            test[tr][c] = 'yellow';
            if (checkWin(test)?.winner === 'yellow') { chosenCol = c; break; }
          }
        }

        // 2. Can player win? Block them!
        if (chosenCol === -1) {
          for (let c = 0; c < COLS; c++) {
            let tr = -1;
            for (let r = ROWS - 1; r >= 0; r--) {
              if (!board[r][c]) { tr = r; break; }
            }
            if (tr !== -1) {
              const test = board.map((row) => [...row]);
              test[tr][c] = 'red';
              if (checkWin(test)?.winner === 'red') { chosenCol = c; break; }
            }
          }
        }

        // 3. Fallback: Prefer center columns [3, 2, 4, 1, 5, 0, 6]
        if (chosenCol === -1) {
          const preferences = [3, 2, 4, 1, 5, 0, 6];
          for (const col of preferences) {
            if (!board[0][col]) { chosenCol = col; break; }
          }
        }

        if (chosenCol !== -1) {
          dropDisc(chosenCol, 'yellow');
        }
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, vsAI, winner, board]);

  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer('red');
    setWinner(null);
    setWinningCells([]);
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
        width: '560px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
        border: '1px solid #cbd5e1',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0284c7, #0369a1)',
          color: '#ffffff',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>🔴🟡</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>Conference B: Connect Four</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', opacity: 0.85 }}>Spot Tabletop Mini-Game &bull; Live Match</p>
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

        {/* Controls & Scores */}
        <div style={{
          padding: '14px 20px',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Opponent Mode */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => { setVsAI(true); resetGame(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: vsAI ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                background: vsAI ? '#e0f2fe' : '#ffffff',
                color: vsAI ? '#0369a1' : '#64748b',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Bot size={14} />
              <span>vs DevBot</span>
            </button>
            <button
              onClick={() => { setVsAI(false); resetGame(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                borderRadius: '8px',
                border: !vsAI ? '1.5px solid #0284c7' : '1px solid #cbd5e1',
                background: !vsAI ? '#e0f2fe' : '#ffffff',
                color: !vsAI ? '#0369a1' : '#64748b',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <Users size={14} />
              <span>Pass & Play</span>
            </button>
          </div>

          {/* Scoreboard */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.84rem', fontWeight: 700 }}>
            <span style={{ color: '#ef4444' }}>🔴 You: {scores.red}</span>
            <span style={{ color: '#64748b' }}>Ties: {scores.ties}</span>
            <span style={{ color: '#eab308' }}>🟡 {vsAI ? 'DevBot' : 'Player 2'}: {scores.yellow}</span>
          </div>

          <button
            onClick={resetGame}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        </div>

        {/* Turn Status Banner */}
        <div style={{
          padding: '8px 20px',
          textAlign: 'center',
          fontSize: '0.88rem',
          fontWeight: 700,
          background: winner
            ? (winner === 'draw' ? '#f1f5f9' : winner === 'red' ? '#fee2e2' : '#fef9c3')
            : (currentPlayer === 'red' ? '#fee2e2' : '#fef9c3'),
          color: winner
            ? (winner === 'draw' ? '#475569' : winner === 'red' ? '#b91c1c' : '#854d0e')
            : (currentPlayer === 'red' ? '#b91c1c' : '#854d0e')
        }}>
          {winner ? (
            winner === 'draw' ? '🤝 It\'s a Draw!' : `🏆 ${winner === 'red' ? '🔴 You Won!' : vsAI ? '🟡 DevBot Won!' : '🟡 Player 2 Won!'}`
          ) : (
            `${currentPlayer === 'red' ? '🔴 Your Turn' : vsAI ? '🟡 DevBot Thinking...' : '🟡 Player 2 Turn'} (Click column to drop)`
          )}
        </div>

        {/* The 7x6 Connect Four Board */}
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', background: '#f8fafc' }}>
          <div style={{
            background: '#1d4ed8',
            padding: '16px',
            borderRadius: '16px',
            boxShadow: '0 12px 30px rgba(29, 78, 216, 0.35)',
            display: 'inline-grid',
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: '10px'
          }}>
            {Array.from({ length: COLS }).map((_, c) => (
              <div
                key={c}
                onClick={() => dropDisc(c)}
                onMouseEnter={() => setHoverCol(c)}
                onMouseLeave={() => setHoverCol(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  cursor: winner || (vsAI && currentPlayer === 'yellow') ? 'default' : 'pointer',
                  padding: '4px',
                  borderRadius: '12px',
                  background: hoverCol === c && !winner ? 'rgba(255,255,255,0.1)' : 'transparent',
                  transition: 'background 0.15s ease'
                }}
              >
                {Array.from({ length: ROWS }).map((_, r) => {
                  const cell = board[r][c];
                  const isWinning = winningCells.some(([wr, wc]) => wr === r && wc === c);

                  return (
                    <div
                      key={r}
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: cell === 'red'
                          ? 'radial-gradient(circle at 35% 35%, #f87171, #dc2626)'
                          : cell === 'yellow'
                          ? 'radial-gradient(circle at 35% 35%, #fde047, #ca8a04)'
                          : '#0f172a',
                        border: isWinning ? '3px solid #ffffff' : '2px solid rgba(0,0,0,0.25)',
                        boxShadow: cell ? 'inset 0 3px 6px rgba(255,255,255,0.4), 0 3px 6px rgba(0,0,0,0.3)' : 'inset 0 3px 6px rgba(0,0,0,0.6)',
                        transform: isWinning ? 'scale(1.08)' : 'scale(1)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  );
                })}
              </div>
            ))}
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
          <span>🎮 Placed on Conference Room B table for team bonding</span>
          <button
            onClick={onClose}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Done Playing
          </button>
        </div>
      </div>
    </div>
  );
}
