import React, { useState } from 'react';
import { X, RotateCcw, Trophy, Bot, Users, Sparkles } from 'lucide-react';

// Unicode chess symbols
const PIECES = {
  K: '♔', Q: '♕', R: '♖', B: '♗', N: '♘', P: '♙',
  k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟'
};

const INITIAL_BOARD = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

export default function ChessGameWidget({ isOpen, onClose }) {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [selectedCell, setSelectedCell] = useState(null);
  const [turn, setTurn] = useState('white'); // 'white' (uppercase) or 'black' (lowercase)
  const [vsAI, setVsAI] = useState(true);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState('Your turn! (White)');
  const [captured, setCaptured] = useState({ white: [], black: [] });

  if (!isOpen) return null;

  const isWhitePiece = (p) => p && p === p.toUpperCase();
  const isBlackPiece = (p) => p && p === p.toLowerCase();

  const handleCellClick = (r, c) => {
    const piece = board[r][c];

    // If already selected a piece, try to move
    if (selectedCell) {
      const [fromR, fromC] = selectedCell;
      const movingPiece = board[fromR][fromC];

      // If clicked the same cell or another friendly piece, reselect
      if (r === fromR && c === fromC) {
        setSelectedCell(null);
        return;
      }
      if (turn === 'white' && isWhitePiece(piece)) {
        setSelectedCell([r, c]);
        return;
      }
      if (turn === 'black' && isBlackPiece(piece)) {
        setSelectedCell([r, c]);
        return;
      }

      // Execute move
      const targetPiece = board[r][c];
      const newBoard = board.map(row => [...row]);
      newBoard[r][c] = movingPiece;
      newBoard[fromR][fromC] = null;

      // Handle capture
      if (targetPiece) {
        if (isBlackPiece(targetPiece)) {
          setCaptured(prev => ({ ...prev, white: [...prev.white, targetPiece] }));
        } else {
          setCaptured(prev => ({ ...prev, black: [...prev.black, targetPiece] }));
        }
      }

      setBoard(newBoard);
      setSelectedCell(null);
      setHistory(prev => [...prev, { from: [fromR, fromC], to: [r, c], piece: movingPiece }]);

      // Check king capture
      if (targetPiece === 'k') {
        setStatus('Checkmate! White wins! 🏆');
        return;
      }
      if (targetPiece === 'K') {
        setStatus('Checkmate! Black wins! 🏆');
        return;
      }

      const nextTurn = turn === 'white' ? 'black' : 'white';
      setTurn(nextTurn);
      setStatus(nextTurn === 'white' ? 'Your turn! (White)' : (vsAI ? 'DevBot (AI) thinking...' : "Player 2's turn (Black)"));

      // Trigger simple AI move if enabled
      if (vsAI && nextTurn === 'black') {
        setTimeout(() => {
          makeAIMove(newBoard);
        }, 600);
      }
      return;
    }

    // Select friendly piece
    if (piece) {
      if ((turn === 'white' && isWhitePiece(piece)) || (turn === 'black' && isBlackPiece(piece))) {
        setSelectedCell([r, c]);
      }
    }
  };

  const makeAIMove = (currentBoard) => {
    const blackPieces = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        if (isBlackPiece(currentBoard[r][c])) {
          blackPieces.push({ r, c, piece: currentBoard[r][c] });
        }
      }
    }

    // Try to find a forward step or random valid move
    const possibleMoves = [];
    for (const bp of blackPieces) {
      const candidates = [
        [bp.r + 1, bp.c],
        [bp.r + 1, bp.c - 1],
        [bp.r + 1, bp.c + 1],
        [bp.r + 2, bp.c + 1],
        [bp.r + 2, bp.c - 1]
      ];
      for (const [tr, tc] of candidates) {
        if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
          const target = currentBoard[tr][tc];
          if (!target || isWhitePiece(target)) {
            possibleMoves.push({ from: [bp.r, bp.c], to: [tr, tc], piece: bp.piece, target });
          }
        }
      }
    }

    if (possibleMoves.length > 0) {
      // Prioritize captures
      const captureMoves = possibleMoves.filter(m => m.target && isWhitePiece(m.target));
      const chosen = captureMoves.length > 0
        ? captureMoves[Math.floor(Math.random() * captureMoves.length)]
        : possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      const nextBoard = currentBoard.map(row => [...row]);
      nextBoard[chosen.to[0]][chosen.to[1]] = chosen.piece;
      nextBoard[chosen.from[0]][chosen.from[1]] = null;

      if (chosen.target) {
        setCaptured(prev => ({ ...prev, black: [...prev.black, chosen.target] }));
        if (chosen.target === 'K') {
          setStatus('DevBot wins! 🤖 Checkmate!');
          setBoard(nextBoard);
          return;
        }
      }

      setBoard(nextBoard);
      setTurn('white');
      setStatus('Your turn! (White)');
    } else {
      setTurn('white');
      setStatus('Stalemate! Game drawn.');
    }
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setSelectedCell(null);
    setTurn('white');
    setHistory([]);
    setCaptured({ white: [], black: [] });
    setStatus('Your turn! (White)');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          width: '540px',
          maxWidth: '96vw',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '24px' }}>♟️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>
                Terrace Chess Lounge
              </h2>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Play a friendly match outdoors on the terrace
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: 'none',
              background: '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} color="#475569" />
          </button>
        </div>

        {/* Game Mode & Status Banner */}
        <div
          style={{
            padding: '12px 20px',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9'
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { setVsAI(true); resetGame(); }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: vsAI ? '#0284c7' : '#f1f5f9',
                color: vsAI ? '#ffffff' : '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Bot size={14} /> vs DevBot (AI)
            </button>
            <button
              onClick={() => { setVsAI(false); resetGame(); }}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: 'none',
                background: !vsAI ? '#0284c7' : '#f1f5f9',
                color: !vsAI ? '#ffffff' : '#64748b',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Users size={14} /> 2 Players
            </button>
          </div>

          <button
            onClick={resetGame}
            title="Reset Board"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              background: '#ffffff',
              color: '#475569',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RotateCcw size={14} /> New Game
          </button>
        </div>

        {/* Chessboard Area */}
        <div
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#f8fafc'
          }}
        >
          {/* Status badge */}
          <div
            style={{
              marginBottom: '12px',
              padding: '6px 16px',
              borderRadius: '20px',
              background: '#e0f2fe',
              color: '#0369a1',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Sparkles size={14} /> {status}
          </div>

          {/* 8x8 Grid */}
          <div
            style={{
              width: '384px',
              height: '384px',
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              border: '4px solid #78350f',
              borderRadius: '6px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
          >
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isBlackSquare = (r + c) % 2 === 1;
                const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    onClick={() => handleCellClick(r, c)}
                    style={{
                      width: '48px',
                      height: '48px',
                      background: isSelected
                        ? '#38bdf8'
                        : (isBlackSquare ? '#b45309' : '#fef3c7'),
                      border: 'none',
                      fontSize: '32px',
                      lineHeight: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: isWhitePiece(cell) ? '#ffffff' : '#0f172a',
                      textShadow: isWhitePiece(cell)
                        ? '0 1px 3px rgba(0,0,0,0.8), 0 0 1px #000'
                        : 'none',
                      transition: 'background 0.12s ease'
                    }}
                  >
                    {cell ? PIECES[cell] : ''}
                  </button>
                );
              })
            )}
          </div>

          {/* Captured Pieces Bar */}
          <div
            style={{
              marginTop: '16px',
              width: '384px',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              color: '#475569'
            }}
          >
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block' }}>Captured by White:</span>
              <span>{captured.white.map(p => PIECES[p]).join(' ') || 'None'}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block' }}>Captured by Black:</span>
              <span>{captured.black.map(p => PIECES[p]).join(' ') || 'None'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
