import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RotateCcw, Flag, Trophy, ChevronDown, Settings2, Brain, Clock, ArrowLeft } from 'lucide-react';

// ─────────────────────────────────────────────
//  CHESS ENGINE — Piece Types, Colors, Logic
// ─────────────────────────────────────────────

const PIECE = { PAWN: 'P', KNIGHT: 'N', BISHOP: 'B', ROOK: 'R', QUEEN: 'Q', KING: 'K' };
const COLOR = { WHITE: 'w', BLACK: 'b' };

// Unicode chess pieces
const PIECE_UNICODE = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

// Piece values for evaluation
const PIECE_VALUE = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 };

// Piece-square tables for positional evaluation
const PST = {
  P: [
    0,  0,  0,  0,  0,  0,  0,  0,
   50, 50, 50, 50, 50, 50, 50, 50,
   10, 10, 20, 30, 30, 20, 10, 10,
    5,  5, 10, 25, 25, 10,  5,  5,
    0,  0,  0, 20, 20,  0,  0,  0,
    5, -5,-10,  0,  0,-10, -5,  5,
    5, 10, 10,-20,-20, 10, 10,  5,
    0,  0,  0,  0,  0,  0,  0,  0
  ],
  N: [
   -50,-40,-30,-30,-30,-30,-40,-50,
   -40,-20,  0,  0,  0,  0,-20,-40,
   -30,  0, 10, 15, 15, 10,  0,-30,
   -30,  5, 15, 20, 20, 15,  5,-30,
   -30,  0, 15, 20, 20, 15,  0,-30,
   -30,  5, 10, 15, 15, 10,  5,-30,
   -40,-20,  0,  5,  5,  0,-20,-40,
   -50,-40,-30,-30,-30,-30,-40,-50
  ],
  B: [
   -20,-10,-10,-10,-10,-10,-10,-20,
   -10,  0,  0,  0,  0,  0,  0,-10,
   -10,  0,  5, 10, 10,  5,  0,-10,
   -10,  5,  5, 10, 10,  5,  5,-10,
   -10,  0, 10, 10, 10, 10,  0,-10,
   -10, 10, 10, 10, 10, 10, 10,-10,
   -10,  5,  0,  0,  0,  0,  5,-10,
   -20,-10,-10,-10,-10,-10,-10,-20
  ],
  R: [
    0,  0,  0,  0,  0,  0,  0,  0,
    5, 10, 10, 10, 10, 10, 10,  5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
   -5,  0,  0,  0,  0,  0,  0, -5,
    0,  0,  0,  5,  5,  0,  0,  0
  ],
  Q: [
   -20,-10,-10, -5, -5,-10,-10,-20,
   -10,  0,  0,  0,  0,  0,  0,-10,
   -10,  0,  5,  5,  5,  5,  0,-10,
    -5,  0,  5,  5,  5,  5,  0, -5,
     0,  0,  5,  5,  5,  5,  0, -5,
   -10,  5,  5,  5,  5,  5,  0,-10,
   -10,  0,  5,  0,  0,  0,  0,-10,
   -20,-10,-10, -5, -5,-10,-10,-20
  ],
  K: [
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -30,-40,-40,-50,-50,-40,-40,-30,
   -20,-30,-30,-40,-40,-30,-30,-20,
   -10,-20,-20,-20,-20,-20,-20,-10,
    20, 20,  0,  0,  0,  0, 20, 20,
    20, 30, 10,  0,  0, 10, 30, 20
  ]
};

// Initial board state — 64-square array. null = empty
function createInitialBoard() {
  const b = Array(64).fill(null);
  const order = ['R','N','B','Q','K','B','N','R'];
  for (let i = 0; i < 8; i++) {
    b[i]    = { type: order[i], color: COLOR.BLACK };
    b[8+i]  = { type: PIECE.PAWN, color: COLOR.BLACK };
    b[48+i] = { type: PIECE.PAWN, color: COLOR.WHITE };
    b[56+i] = { type: order[i], color: COLOR.WHITE };
  }
  return b;
}

// sq → {row, col}
const sqToRC = (sq) => ({ row: Math.floor(sq / 8), col: sq % 8 });
const rcToSq = (r, c) => r * 8 + c;
const inBounds = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;

// Generate pseudo-legal moves for a piece at sq
function getPseudoMoves(board, sq, enPassantSq, castlingRights) {
  const piece = board[sq];
  if (!piece) return [];
  const { row, col } = sqToRC(sq);
  const moves = [];
  const { type, color } = piece;
  const opp = color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
  const dir = color === COLOR.WHITE ? -1 : 1;

  const addIfEmpty = (r, c) => {
    if (inBounds(r, c) && !board[rcToSq(r, c)]) moves.push(rcToSq(r, c));
  };
  const addIfCapture = (r, c) => {
    if (inBounds(r, c)) {
      const t = board[rcToSq(r, c)];
      if (t && t.color === opp) moves.push(rcToSq(r, c));
    }
  };
  const addSlide = (dr, dc) => {
    let r = row + dr, c = col + dc;
    while (inBounds(r, c)) {
      const tsq = rcToSq(r, c);
      if (board[tsq]) {
        if (board[tsq].color === opp) moves.push(tsq);
        break;
      }
      moves.push(tsq);
      r += dr; c += dc;
    }
  };

  switch (type) {
    case PIECE.PAWN: {
      // Forward
      if (inBounds(row + dir, col) && !board[rcToSq(row + dir, col)]) {
        moves.push(rcToSq(row + dir, col));
        // Double push from start rank
        const startRow = color === COLOR.WHITE ? 6 : 1;
        if (row === startRow && !board[rcToSq(row + 2 * dir, col)]) {
          moves.push(rcToSq(row + 2 * dir, col));
        }
      }
      // Captures
      for (const dc of [-1, 1]) {
        if (inBounds(row + dir, col + dc)) {
          const tsq = rcToSq(row + dir, col + dc);
          if (board[tsq] && board[tsq].color === opp) moves.push(tsq);
          if (tsq === enPassantSq) moves.push(tsq);
        }
      }
      break;
    }
    case PIECE.KNIGHT: {
      for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) {
        if (inBounds(row+dr, col+dc)) {
          const tsq = rcToSq(row+dr, col+dc);
          if (!board[tsq] || board[tsq].color === opp) moves.push(tsq);
        }
      }
      break;
    }
    case PIECE.BISHOP: addSlide(-1,-1); addSlide(-1,1); addSlide(1,-1); addSlide(1,1); break;
    case PIECE.ROOK:   addSlide(-1,0); addSlide(1,0); addSlide(0,-1); addSlide(0,1); break;
    case PIECE.QUEEN:
      addSlide(-1,-1); addSlide(-1,1); addSlide(1,-1); addSlide(1,1);
      addSlide(-1,0); addSlide(1,0); addSlide(0,-1); addSlide(0,1);
      break;
    case PIECE.KING: {
      for (const [dr, dc] of [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]) {
        if (inBounds(row+dr, col+dc)) {
          const tsq = rcToSq(row+dr, col+dc);
          if (!board[tsq] || board[tsq].color === opp) moves.push(tsq);
        }
      }
      // Castling
      if (castlingRights) {
        const back = color === COLOR.WHITE ? 7 : 0;
        if (row === back) {
          // Kingside
          if (castlingRights[color + 'K'] && !board[rcToSq(back,5)] && !board[rcToSq(back,6)]) {
            moves.push(rcToSq(back, 6));
          }
          // Queenside
          if (castlingRights[color + 'Q'] && !board[rcToSq(back,3)] && !board[rcToSq(back,2)] && !board[rcToSq(back,1)]) {
            moves.push(rcToSq(back, 2));
          }
        }
      }
      break;
    }
  }
  return moves;
}

// Check if a square is attacked by color
function isAttackedBy(board, sq, color) {
  const opp = color;
  for (let s = 0; s < 64; s++) {
    if (board[s] && board[s].color === opp) {
      const moves = getPseudoMoves(board, s, null, null);
      if (moves.includes(sq)) return true;
    }
  }
  return false;
}

// Find king square for a color
function findKing(board, color) {
  for (let s = 0; s < 64; s++) {
    if (board[s] && board[s].type === PIECE.KING && board[s].color === color) return s;
  }
  return -1;
}

// Apply move, return new board + metadata
function applyMove(board, from, to, promotion = 'Q', enPassantSq = null, castlingRights = null) {
  const newBoard = [...board];
  const piece = newBoard[from];
  const { row: fr, col: fc } = sqToRC(from);
  const { row: tr, col: tc } = sqToRC(to);
  let newEP = null;
  let newCR = castlingRights ? { ...castlingRights } : { wK: true, wQ: true, bK: true, bQ: true };
  let captured = newBoard[to];

  // En passant capture
  if (piece.type === PIECE.PAWN && to === enPassantSq) {
    const capturedPawnSq = rcToSq(fr, tc);
    captured = newBoard[capturedPawnSq];
    newBoard[capturedPawnSq] = null;
  }

  // Double pawn push → set en passant
  if (piece.type === PIECE.PAWN && Math.abs(tr - fr) === 2) {
    newEP = rcToSq((fr + tr) / 2, fc);
  }

  // Castling move
  if (piece.type === PIECE.KING && Math.abs(tc - fc) === 2) {
    const back = piece.color === COLOR.WHITE ? 7 : 0;
    if (tc === 6) { // kingside
      newBoard[rcToSq(back, 5)] = newBoard[rcToSq(back, 7)];
      newBoard[rcToSq(back, 7)] = null;
    } else { // queenside
      newBoard[rcToSq(back, 3)] = newBoard[rcToSq(back, 0)];
      newBoard[rcToSq(back, 0)] = null;
    }
  }

  // Move piece
  newBoard[to] = piece;
  newBoard[from] = null;

  // Pawn promotion
  if (piece.type === PIECE.PAWN && (tr === 0 || tr === 7)) {
    newBoard[to] = { type: promotion, color: piece.color };
  }

  // Update castling rights
  if (piece.type === PIECE.KING) {
    if (piece.color === COLOR.WHITE) { newCR.wK = false; newCR.wQ = false; }
    else { newCR.bK = false; newCR.bQ = false; }
  }
  if (from === 63 || to === 63) newCR.wK = false;
  if (from === 56 || to === 56) newCR.wQ = false;
  if (from === 7  || to === 7 ) newCR.bK = false;
  if (from === 0  || to === 0 ) newCR.bQ = false;

  return { board: newBoard, enPassantSq: newEP, castlingRights: newCR, captured };
}

// Get all legal moves for a color
function getLegalMoves(board, color, enPassantSq, castlingRights) {
  const moves = [];
  const opp = color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
  for (let sq = 0; sq < 64; sq++) {
    if (!board[sq] || board[sq].color !== color) continue;
    const pseudo = getPseudoMoves(board, sq, enPassantSq, castlingRights);
    for (const to of pseudo) {
      const { board: nb } = applyMove(board, sq, to, 'Q', enPassantSq, castlingRights);
      const kingSq = findKing(nb, color);
      if (!isAttackedBy(nb, kingSq, opp)) {
        moves.push({ from: sq, to });
      }
    }
  }
  return moves;
}

// Is current player in check?
function isInCheck(board, color) {
  const kingSq = findKing(board, color);
  const opp = color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
  return isAttackedBy(board, kingSq, opp);
}

// ─────────────────────────────────────────────
//  MINIMAX AI with Alpha-Beta Pruning
// ─────────────────────────────────────────────

function evaluateBoard(board, color) {
  let score = 0;
  for (let sq = 0; sq < 64; sq++) {
    const p = board[sq];
    if (!p) continue;
    const pstIdx = p.color === COLOR.WHITE ? sq : 63 - sq;
    const val = PIECE_VALUE[p.type] + (PST[p.type] ? PST[p.type][pstIdx] : 0);
    score += p.color === color ? val : -val;
  }
  return score;
}

function minimax(board, depth, alpha, beta, maximizing, aiColor, enPassantSq, castlingRights) {
  const curColor = maximizing ? aiColor : (aiColor === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE);
  const moves = getLegalMoves(board, curColor, enPassantSq, castlingRights);

  if (depth === 0 || moves.length === 0) {
    if (moves.length === 0) {
      if (isInCheck(board, curColor)) {
        return maximizing ? -99999 : 99999;
      }
      return 0; // stalemate
    }
    return evaluateBoard(board, aiColor);
  }

  if (maximizing) {
    let best = -Infinity;
    for (const move of moves) {
      const { board: nb, enPassantSq: nep, castlingRights: ncr } = applyMove(board, move.from, move.to, 'Q', enPassantSq, castlingRights);
      const score = minimax(nb, depth - 1, alpha, beta, false, aiColor, nep, ncr);
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break;
    }
    return best;
  } else {
    let best = Infinity;
    for (const move of moves) {
      const { board: nb, enPassantSq: nep, castlingRights: ncr } = applyMove(board, move.from, move.to, 'Q', enPassantSq, castlingRights);
      const score = minimax(nb, depth - 1, alpha, beta, true, aiColor, nep, ncr);
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break;
    }
    return best;
  }
}

function getBestMove(board, aiColor, depth, enPassantSq, castlingRights) {
  const moves = getLegalMoves(board, aiColor, enPassantSq, castlingRights);
  if (moves.length === 0) return null;

  let bestMove = null;
  let bestScore = -Infinity;
  const opp = aiColor === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;

  for (const move of moves) {
    const { board: nb, enPassantSq: nep, castlingRights: ncr } = applyMove(board, move.from, move.to, 'Q', enPassantSq, castlingRights);
    const score = minimax(nb, depth - 1, -Infinity, Infinity, false, aiColor, nep, ncr);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
}

// ─────────────────────────────────────────────
//  Move Notation Helper
// ─────────────────────────────────────────────

const FILES = 'abcdefgh';
const RANKS = '87654321';
function sqToAlgebraic(sq) {
  const { row, col } = sqToRC(sq);
  return FILES[col] + RANKS[row];
}

// ─────────────────────────────────────────────
//  REACT CHESS COMPONENT
// ─────────────────────────────────────────────

const DIFFICULTY = {
  easy: { depth: 1, label: 'Easy', color: 'text-emerald-400' },
  medium: { depth: 2, label: 'Medium', color: 'text-amber-400' },
  hard: { depth: 3, label: 'Hard', color: 'text-rose-400' }
};

export const ValChess = () => {
  const [board, setBoard] = useState(createInitialBoard);
  const [turn, setTurn] = useState(COLOR.WHITE);
  const [selected, setSelected] = useState(null);
  const [legalTargets, setLegalTargets] = useState([]);
  const [enPassantSq, setEnPassantSq] = useState(null);
  const [castlingRights, setCastlingRights] = useState({ wK: true, wQ: true, bK: true, bQ: true });
  const [capturedW, setCapturedW] = useState([]);
  const [capturedB, setCapturedB] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [status, setStatus] = useState('playing'); // 'playing' | 'check' | 'checkmate' | 'stalemate'
  const [aiColor, setAiColor] = useState(COLOR.BLACK);
  const [difficulty, setDifficulty] = useState('medium');
  const [aiThinking, setAiThinking] = useState(false);
  const [promotionPending, setPromotionPending] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [flippedBoard, setFlippedBoard] = useState(false);
  const [lastMove, setLastMove] = useState(null);
  const [gameTime, setGameTime] = useState({ w: 0, b: 0 });
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (status !== 'playing') { clearInterval(timerRef.current); return; }
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setGameTime(prev => ({ ...prev, [turn]: prev[turn] + 1 }));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [turn, status]);

  // AI move effect
  useEffect(() => {
    if (turn !== aiColor || status !== 'playing') return;
    setAiThinking(true);
    const timer = setTimeout(() => {
      const depth = DIFFICULTY[difficulty].depth;
      const best = getBestMove(board, aiColor, depth, enPassantSq, castlingRights);
      if (best) {
        doMove(board, best.from, best.to, 'Q', enPassantSq, castlingRights, aiColor);
      }
      setAiThinking(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [turn, aiColor, status]);

  const doMove = useCallback((currentBoard, from, to, promo, ep, cr, currentTurn) => {
    const { board: nb, enPassantSq: nep, castlingRights: ncr, captured } = applyMove(currentBoard, from, to, promo, ep, cr);
    const nextTurn = currentTurn === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;

    // Record move notation
    const piece = currentBoard[from];
    const notation = (piece.type !== PIECE.PAWN ? piece.type : '') + sqToAlgebraic(from) + (captured ? 'x' : '') + sqToAlgebraic(to);

    if (captured) {
      if (captured.color === COLOR.WHITE) setCapturedW(prev => [...prev, captured]);
      else setCapturedB(prev => [...prev, captured]);
    }

    setBoard(nb);
    setEnPassantSq(nep);
    setCastlingRights(ncr);
    setLastMove({ from, to });
    setMoveHistory(prev => [...prev, notation]);
    setSelected(null);
    setLegalTargets([]);

    // Check game state for next turn
    const nextLegal = getLegalMoves(nb, nextTurn, nep, ncr);
    if (nextLegal.length === 0) {
      if (isInCheck(nb, nextTurn)) {
        setStatus('checkmate');
      } else {
        setStatus('stalemate');
      }
    } else if (isInCheck(nb, nextTurn)) {
      setStatus('check');
      setTurn(nextTurn);
    } else {
      setStatus('playing');
      setTurn(nextTurn);
    }
  }, []);

  const handleSquareClick = (sq) => {
    if (aiThinking || turn === aiColor || status === 'checkmate' || status === 'stalemate') return;

    if (selected === null) {
      const p = board[sq];
      if (!p || p.color !== turn) return;
      const legal = getLegalMoves(board, turn, enPassantSq, castlingRights)
        .filter(m => m.from === sq)
        .map(m => m.to);
      setSelected(sq);
      setLegalTargets(legal);
    } else {
      if (legalTargets.includes(sq)) {
        const piece = board[selected];
        const { row: tr } = sqToRC(sq);
        if (piece.type === PIECE.PAWN && (tr === 0 || tr === 7)) {
          setPromotionPending({ from: selected, to: sq });
          return;
        }
        doMove(board, selected, sq, 'Q', enPassantSq, castlingRights, turn);
      } else {
        const p = board[sq];
        if (p && p.color === turn) {
          const legal = getLegalMoves(board, turn, enPassantSq, castlingRights)
            .filter(m => m.from === sq)
            .map(m => m.to);
          setSelected(sq);
          setLegalTargets(legal);
        } else {
          setSelected(null);
          setLegalTargets([]);
        }
      }
    }
  };

  const handlePromotion = (type) => {
    const { from, to } = promotionPending;
    doMove(board, from, to, type, enPassantSq, castlingRights, turn);
    setPromotionPending(null);
  };

  const resetGame = () => {
    setBoard(createInitialBoard());
    setTurn(COLOR.WHITE);
    setSelected(null);
    setLegalTargets([]);
    setEnPassantSq(null);
    setCastlingRights({ wK: true, wQ: true, bK: true, bQ: true });
    setCapturedW([]);
    setCapturedB([]);
    setMoveHistory([]);
    setStatus('playing');
    setLastMove(null);
    setGameTime({ w: 0, b: 0 });
    setAiThinking(false);
    setPromotionPending(null);
  };

  const formatTime = (sec) => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;

  const squareOrder = flippedBoard 
    ? Array.from({ length: 64 }, (_, i) => 63 - i) 
    : Array.from({ length: 64 }, (_, i) => i);

  return (
    <div className="flex h-full w-full bg-[#1A1A1C] text-white font-sans select-none overflow-hidden" style={{ fontFamily: "'SF Pro Display', -apple-system, sans-serif" }}>
      
      {/* Left Panel — Game Info */}
      <div className="w-56 border-r border-white/10 flex flex-col bg-[#202023]/80 p-3 gap-3 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm font-bold text-white/90">
          <span className="text-2xl">♟</span>
          <span>Chess</span>
        </div>

        {/* Player & Timer cards */}
        {[
          { color: COLOR.BLACK, name: 'AI Engine', flag: '🤖' },
          { color: COLOR.WHITE, name: 'You', flag: '🧑‍💻' }
        ].map(p => (
          <div key={p.color} className={`p-3 rounded-xl border transition-all ${
            turn === p.color && status === 'playing'
              ? 'bg-[#007AFF]/20 border-[#007AFF]/50 shadow-lg shadow-[#007AFF]/20'
              : 'bg-white/5 border-white/10'
          }`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="text-lg">{p.flag}</span>
                <div>
                  <div className="text-xs font-bold">{p.name}</div>
                  <div className="text-[10px] text-white/50">{p.color === COLOR.WHITE ? 'White' : 'Black'}</div>
                </div>
              </div>
              <div className={`font-mono text-sm font-bold ${turn === p.color && status === 'playing' ? 'text-[#007AFF]' : 'text-white/60'}`}>
                {formatTime(gameTime[p.color === COLOR.WHITE ? 'w' : 'b'])}
              </div>
            </div>
            {/* Captured pieces */}
            <div className="mt-2 text-sm text-white/60 min-h-[20px] flex flex-wrap gap-0.5">
              {(p.color === COLOR.WHITE ? capturedB : capturedW).map((cp, i) => (
                <span key={i} className="text-sm leading-none">{PIECE_UNICODE[cp.color + cp.type]}</span>
              ))}
            </div>
          </div>
        ))}

        {/* Difficulty */}
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-white/40 uppercase font-mono mb-1">AI Difficulty</div>
          <div className="flex gap-1">
            {Object.entries(DIFFICULTY).map(([key, d]) => (
              <button
                key={key}
                onClick={() => { setDifficulty(key); resetGame(); }}
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                  difficulty === key ? 'bg-[#007AFF] text-white' : 'bg-white/10 text-white/50 hover:bg-white/20'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Move History */}
        <div className="flex-1 p-2 rounded-xl bg-white/5 border border-white/10 overflow-y-auto">
          <div className="text-[10px] text-white/40 uppercase font-mono mb-2">Move History</div>
          <div className="space-y-0.5">
            {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, i) => (
              <div key={i} className="flex gap-2 text-[10px]">
                <span className="text-white/30 w-5">{i + 1}.</span>
                <span className="text-white/80 font-mono">{moveHistory[i * 2] || ''}</span>
                <span className="text-white/60 font-mono">{moveHistory[i * 2 + 1] || ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={resetGame}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw size={13} /> New Game
          </button>
          <button
            onClick={() => setFlippedBoard(f => !f)}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
          >
            Flip Board
          </button>
        </div>
      </div>

      {/* CENTER — Chess Board */}
      <div className="flex-1 flex flex-col items-center justify-center bg-[#1A1A1C] p-6 relative">
        
        {/* Status Banner */}
        <div className="mb-4 h-8 flex items-center justify-center">
          {status === 'checkmate' && (
            <div className="px-4 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-300 text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <Trophy size={14} /> Checkmate! {turn === aiColor ? '🎉 You Win!' : '🤖 AI Wins!'}
            </div>
          )}
          {status === 'stalemate' && (
            <div className="px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 text-sm font-bold flex items-center gap-2 animate-in fade-in">
              <Flag size={14} /> Stalemate — Draw!
            </div>
          )}
          {status === 'check' && (
            <div className="px-4 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 text-sm font-bold flex items-center gap-2 animate-in fade-in">
              ⚠️ Check!
            </div>
          )}
          {status === 'playing' && aiThinking && (
            <div className="px-4 py-1.5 rounded-full bg-[#007AFF]/20 border border-[#007AFF]/50 text-[#007AFF] text-xs font-bold flex items-center gap-2">
              <Brain size={13} className="animate-spin" /> AI is thinking...
            </div>
          )}
        </div>

        {/* Board */}
        <div className="relative">
          {/* File labels top */}
          <div className="flex mb-1 pl-5">
            {(flippedBoard ? 'hgfedcba' : 'abcdefgh').split('').map(f => (
              <div key={f} className="w-12 text-center text-[10px] text-white/30 font-mono">{f}</div>
            ))}
          </div>

          <div className="flex">
            {/* Rank labels */}
            <div className="flex flex-col">
              {(flippedBoard ? '12345678' : '87654321').split('').map(r => (
                <div key={r} className="h-12 flex items-center justify-center text-[10px] text-white/30 font-mono w-5">{r}</div>
              ))}
            </div>

            {/* Board squares */}
            <div className="grid grid-cols-8 border-2 border-[#3A3A3E] rounded-lg overflow-hidden shadow-2xl"
              style={{ boxShadow: '0 0 60px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.1)' }}
            >
              {squareOrder.map((sq) => {
                const { row, col } = sqToRC(sq);
                const isLight = (row + col) % 2 === 0;
                const piece = board[sq];
                const isSelected = selected === sq;
                const isLegalTarget = legalTargets.includes(sq);
                const isLastFrom = lastMove?.from === sq;
                const isLastTo = lastMove?.to === sq;
                const isKingInCheck = status === 'check' && piece?.type === PIECE.KING && piece?.color === turn;

                let bgClass = isLight ? 'bg-[#F0D9B5]' : 'bg-[#B58863]';
                if (isSelected) bgClass = 'bg-[#F6F669]';
                else if (isLastFrom || isLastTo) bgClass = isLight ? 'bg-[#CDD16F]' : 'bg-[#AABA44]';
                if (isKingInCheck) bgClass = 'bg-rose-500';

                return (
                  <div
                    key={sq}
                    onClick={() => handleSquareClick(sq)}
                    className={`w-12 h-12 flex items-center justify-center relative cursor-pointer transition-all duration-75 ${bgClass}`}
                  >
                    {/* Legal move indicator */}
                    {isLegalTarget && !piece && (
                      <div className="w-3.5 h-3.5 rounded-full bg-black/25" />
                    )}
                    {isLegalTarget && piece && (
                      <div className="absolute inset-0 rounded-sm border-4 border-black/30 pointer-events-none" />
                    )}

                    {/* Piece */}
                    {piece && (
                      <span
                        className="text-[30px] leading-none select-none z-10"
                        style={{
                          textShadow: piece.color === COLOR.WHITE
                            ? '0 1px 3px rgba(0,0,0,0.7)'
                            : '0 1px 3px rgba(0,0,0,0.5)',
                          filter: isSelected ? 'drop-shadow(0 0 8px rgba(255,255,0,0.8))' : 'none',
                          transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                          transition: 'all 0.1s ease'
                        }}
                      >
                        {PIECE_UNICODE[piece.color + piece.type]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Promotion Modal */}
        {promotionPending && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in">
            <div className="macos-glass p-6 rounded-3xl border border-white/20 shadow-2xl text-center space-y-4">
              <h3 className="text-sm font-bold text-white">Pawn Promotion</h3>
              <div className="flex gap-4">
                {['Q', 'R', 'B', 'N'].map(type => (
                  <button
                    key={type}
                    onClick={() => handlePromotion(type)}
                    className="w-16 h-16 rounded-2xl bg-white/10 hover:bg-[#007AFF]/50 border border-white/20 flex items-center justify-center text-4xl transition-all hover:scale-110"
                  >
                    {PIECE_UNICODE[turn + type]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
