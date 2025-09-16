// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';

// // Improved React Native Chess with:
// // - Castling, en-passant, pawn promotion chooser
// // - Iterative deepening + alpha-beta with move ordering
// // - Quiescence search for tactical stability
// // - Transposition table (simple Zobrist hashing)
// // - Better evaluation: material + piece-square tables + mobility
// // Notes: still simplified (no 50-move rule, no threefold detection persistence) but much stronger AI.

// const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// // Utilities: board representation as 8x8 array with '' for empty
// function fenToBoard(fen) {
//   const parts = fen.split(' ');
//   const rows = parts[0].split('/');
//   const board = [];
//   for (let r = 0; r < 8; r++) {
//     const row = [];
//     let fenRow = rows[r];
//     for (let i = 0; i < fenRow.length; i++) {
//       const ch = fenRow[i];
//       if (!isNaN(+ch)) {
//         for (let k = 0; k < +ch; k++) row.push('');
//       } else row.push(ch);
//     }
//     board.push(row);
//   }
//   return {
//     board,
//     turn: parts[1] === 'w' ? 'w' : 'b',
//     castling: parts[2],
//     enPassant: parts[3] === '-' ? null : parts[3],
//   };
// }

// function boardToFen(state) {
//   const rows = state.board.map(r => {
//     let s = '';
//     let empty = 0;
//     for (const c of r) {
//       if (!c) empty++;
//       else { if (empty) { s += empty; empty = 0; } s += c; }
//     }
//     if (empty) s += empty;
//     return s;
//   });
//   const ep = state.enPassant || '-';
//   return `${rows.join('/') } ${state.turn} ${state.castling || '-'} ${ep} 0 1`;
// }

// const WHITE = 'w';
// const BLACK = 'b';

// // Piece values and piece-square tables (simple)
// const pieceValue = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
// const pst = {
//   p: [
//     [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]
//   ],
//   n: [
//     [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]
//   ],
//   b: [
//     [-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],[-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]
//   ],
//   r: [
//     [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[ -5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]
//   ],
//   q: [
//     [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]
//   ],
//   k: [
//     [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]
//   ]
// };

// // Zobrist hashing
// function makeZobrist() {
//   const rnd = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
//   const table = {};
//   const pieces = ['P','N','B','R','Q','K','p','n','b','r','q','k'];
//   for (let p of pieces) {
//     table[p] = Array.from({ length: 64 }, rnd);
//   }
//   const turn = rnd();
//   const castling = {
//     K: rnd(), Q: rnd(), k: rnd(), q: rnd()
//   };
//   const ep = Array.from({ length: 64 }, rnd);
//   return { table, turn, castling, ep };
// }
// const zob = makeZobrist();

// function hashState(state) {
//   let h = 0n;
//   for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
//     const p = state.board[r][c]; if (!p) continue;
//     h ^= BigInt(zob.table[p][r * 8 + c]);
//   }
//   if (state.turn === 'w') h ^= BigInt(zob.turn);
//   if (state.castling) {
//     for (const ch of state.castling) if (zob.castling[ch]) h ^= BigInt(zob.castling[ch]);
//   }
//   if (state.enPassant) {
//     const file = state.enPassant.charCodeAt(0) - 97; // a-h
//     const rank = parseInt(state.enPassant[1], 10) - 1;
//     h ^= BigInt(zob.ep[rank * 8 + file]);
//   }
//   return h.toString();
// }

// // Movement generation with legal move checks including castling and en-passant
// function cloneBoard(bd) { return bd.map(r => r.slice()); }
// function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8 }
// function pieceColor(p){ if(!p) return null; return p === p.toUpperCase() ? WHITE : BLACK }
// function isEnemy(a,b){ if(!a || !b) return false; return pieceColor(a) !== pieceColor(b); }

// function algebraic(rc){ return String.fromCharCode(97 + rc[1]) + (8-rc[0]); }
// function fromAlgebraic(s){ const file = s.charCodeAt(0)-97; const rank = 8-parseInt(s[1],10); return [rank,file]; }

// function generatePseudoLegalMoves(state){
//   const bd = state.board; const moves = [];
//   for (let r=0;r<8;r++) for (let c=0;c<8;c++){
//     const p = bd[r][c]; if(!p) continue; if(pieceColor(p)!==state.turn) continue;
//     const lower = p.toLowerCase();
//     if(lower==='p'){ // pawn
//       const dir = pieceColor(p)===WHITE? -1:1;
//       const start = pieceColor(p)===WHITE?6:1;
//       const oneR=r+dir;
//       if(inBounds(oneR,c) && !bd[oneR][c]) moves.push({from:[r,c],to:[oneR,c],capture:false});
//       if(r===start && !bd[oneR][c] && !bd[r+2*dir][c]) moves.push({from:[r,c],to:[r+2*dir,c],capture:false,doublePawn:true});
//       for(const dc of [-1,1]){
//         const nc=c+dc; if(inBounds(oneR,nc) && bd[oneR][nc] && pieceColor(bd[oneR][nc])!==pieceColor(p)) moves.push({from:[r,c],to:[oneR,nc],capture:true});
//         // en-passant
//         if(state.enPassant){ const epRC = fromAlgebraic(state.enPassant); if(epRC[0]===oneR && epRC[1]===nc) moves.push({from:[r,c],to:[oneR,nc],capture:true,enPassant:true}); }
//       }
//     } else if(lower==='n'){
//       const deltas=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
//       for(const d of deltas){ const nr=r+d[0], nc=c+d[1]; if(inBounds(nr,nc) && (!bd[nr][nc] || pieceColor(bd[nr][nc])!==pieceColor(p))) moves.push({from:[r,c],to:[nr,nc],capture:!!bd[nr][nc]}); }
//     } else if(lower==='b' || lower==='r' || lower==='q'){
//       const dirs=[]; if(lower==='b'||lower==='q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); if(lower==='r'||lower==='q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
//       for(const d of dirs){ let nr=r+d[0], nc=c+d[1]; while(inBounds(nr,nc)){ if(!bd[nr][nc]){ moves.push({from:[r,c],to:[nr,nc],capture:false}); } else { if(pieceColor(bd[nr][nc])!==pieceColor(p)) moves.push({from:[r,c],to:[nr,nc],capture:true}); break; } nr+=d[0]; nc+=d[1]; } }
//     } else if(lower==='k'){
//       for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(dr===0&&dc===0) continue; const nr=r+dr,nc=c+dc; if(inBounds(nr,nc) && (!bd[nr][nc] || pieceColor(bd[nr][nc])!==pieceColor(p))) moves.push({from:[r,c],to:[nr,nc],capture:!!bd[nr][nc]}); }
//       // castling
//       if(pieceColor(p)===WHITE){
//         if(state.castling && state.castling.includes('K')){
//           if(!bd[7][5] && !bd[7][6] && !isSquareAttacked([7,4],state,'b') && !isSquareAttacked([7,5],state,'b') && !isSquareAttacked([7,6],state,'b')) moves.push({from:[7,4],to:[7,6],castle:'K'});
//         }
//         if(state.castling && state.castling.includes('Q')){
//           if(!bd[7][1] && !bd[7][2] && !bd[7][3] && !isSquareAttacked([7,4],state,'b') && !isSquareAttacked([7,3],state,'b') && !isSquareAttacked([7,2],state,'b')) moves.push({from:[7,4],to:[7,2],castle:'Q'});
//         }
//       } else {
//         if(state.castling && state.castling.includes('k')){
//           if(!bd[0][5] && !bd[0][6] && !isSquareAttacked([0,4],state,'w') && !isSquareAttacked([0,5],state,'w') && !isSquareAttacked([0,6],state,'w')) moves.push({from:[0,4],to:[0,6],castle:'k'});
//         }
//         if(state.castling && state.castling.includes('q')){
//           if(!bd[0][1] && !bd[0][2] && !bd[0][3] && !isSquareAttacked([0,4],state,'w') && !isSquareAttacked([0,3],state,'w') && !isSquareAttacked([0,2],state,'w')) moves.push({from:[0,4],to:[0,2],castle:'q'});
//         }
//       }
//     }
//   }
//   return moves;
// }

// function isSquareAttacked(rc, state, byColor){
//   const [r,c] = rc; const bd = state.board;
//   for (let i=0;i<8;i++) for(let j=0;j<8;j++){ const p=bd[i][j]; if(!p) continue; if(pieceColor(p)!==byColor) continue; const moves = generatePseudoLegalMovesForPiece([i,j], state); for(const m of moves) if(m[0]===r && m[1]===c) return true; }
//   return false;
// }

// // generate moves for a single piece ignoring check (helper for attack detection)
// function generatePseudoLegalMovesForPiece([r,c], state){
//   const bd = state.board; const p = bd[r][c]; if(!p) return []; const lower=p.toLowerCase(); const moves=[];
//   const color = pieceColor(p);
//   if(lower==='p'){ const dir = color===WHITE?-1:1; const nr=r+dir; for(const dc of [-1,1]){ const nc=c+dc; if(inBounds(nr,nc) && bd[nr][nc] && pieceColor(bd[nr][nc])!==color) moves.push([nr,nc]); } return moves; }
//   if(lower==='n'){ const deltas=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]; for(const d of deltas){ const nr=r+d[0], nc=c+d[1]; if(inBounds(nr,nc) && (!bd[nr][nc] || pieceColor(bd[nr][nc])!==color)) moves.push([nr,nc]); } return moves; }
//   if(lower==='b'||lower==='r'||lower==='q'){ const dirs=[]; if(lower==='b'||lower==='q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); if(lower==='r'||lower==='q') dirs.push([-1,0],[1,0],[0,-1],[0,1]); for(const d of dirs){ let nr=r+d[0], nc=c+d[1]; while(inBounds(nr,nc)){ if(!bd[nr][nc]) moves.push([nr,nc]); else { if(pieceColor(bd[nr][nc])!==color) moves.push([nr,nc]); break; } nr+=d[0]; nc+=d[1]; } } return moves; }
//   if(lower==='k'){ for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(dr===0&&dc===0) continue; const nr=r+dr,nc=c+dc; if(inBounds(nr,nc) && (!bd[nr][nc]||pieceColor(bd[nr][nc])!==color)) moves.push([nr,nc]); } return moves; }
//   return moves;
// }

// function makeMove(state, move){
//   const nb = cloneBoard(state.board);
//   const [r,c]=move.from; const [nr,nc]=move.to;
//   const piece = nb[r][c]; nb[nr][nc] = nb[r][c]; nb[r][c] = '';
//   let newCastling = state.castling || '';
//   let newEn = null;
//   // handle castling rook move
//   if(move.castle){ if(move.castle==='K'){ nb[7][5] = nb[7][7]; nb[7][7]=''; newCastling=newCastling.replace('K','').replace('Q',''); }
//     if(move.castle==='Q'){ nb[7][3]=nb[7][0]; nb[7][0]=''; newCastling=newCastling.replace('K','').replace('Q',''); }
//     if(move.castle==='k'){ nb[0][5]=nb[0][7]; nb[0][7]=''; newCastling=newCastling.replace('k','').replace('q',''); }
//     if(move.castle==='q'){ nb[0][3]=nb[0][0]; nb[0][0]=''; newCastling=newCastling.replace('k','').replace('q',''); }
//   }
//   // handle en-passant capture
//   if(move.enPassant){ const dir = pieceColor(piece)===WHITE?1:-1; nb[nr+dir][nc]=''; }
//   // handle pawn double move -> set en-passant square
//   if(move.doublePawn){ newEn = algebraic([ (r+nr)/2 , c ]); }
//   // handle promotion
//   if(move.promotion){ nb[nr][nc] = move.promotion; }
//   // update castling rights if king or rook moved or captured
//   if(piece.toLowerCase()==='k'){ if(piece==='K') newCastling = newCastling.replace('K','').replace('Q',''); if(piece==='k') newCastling=newCastling.replace('k','').replace('q',''); }
//   if((r===7 && c===0) || (nr===7 && nc===0)) newCastling = newCastling.replace('Q','');
//   if((r===7 && c===7) || (nr===7 && nc===7)) newCastling = newCastling.replace('K','');
//   if((r===0 && c===0) || (nr===0 && nc===0)) newCastling = newCastling.replace('q','');
//   if((r===0 && c===7) || (nr===0 && nc===7)) newCastling = newCastling.replace('k','');

//   const nextTurn = state.turn==='w'?'b':'w';
//   return { board: nb, turn: nextTurn, castling: newCastling, enPassant: newEn };
// }

// function evaluate(state){
//   let score = 0;
//   let mobility = 0;
//   for(let r=0;r<8;r++) for(let c=0;c<8;c++){
//     const p = state.board[r][c]; if(!p) continue; const lower = p.toLowerCase(); const val = pieceValue[lower] || 0; score += (p===p.toUpperCase()) ? val : -val;
//     // pst
//     const table = pst[lower]; if(table) {
//       const v = (p===p.toUpperCase()) ? table[r][c] : -table[7-r][c]; score += v;
//     }
//   }
//   // mobility
//   const myMoves = generatePseudoLegalMoves(state).length;
//   const temp = { ...state, turn: state.turn==='w'?'b':'w' };
//   const oppMoves = generatePseudoLegalMoves(temp).length;
//   mobility = myMoves - oppMoves;
//   score += mobility * 10;
//   return (state.turn==='w') ? score : -score; // perspective: positive is good for side to move
// }

// // move ordering: captures, promotions, killer moves (not fully implemented), MVV/LVA
// function orderMoves(state, moves){
//   return moves.sort((a,b)=>{
//     const aScore = (a.capture? 1000 : 0) + (a.promotion? 800:0) + (a.castle? 500:0);
//     const bScore = (b.capture? 1000 : 0) + (b.promotion? 800:0) + (b.castle? 500:0);
//     return bScore - aScore;
//   });
// }

// // Transposition table
// class TT {
//   constructor(){ this.map = new Map(); }
//   get(key){ return this.map.get(key); }
//   set(key, val){ this.map.set(key, val); }
// }

// function quiescence(state, alpha, beta, tt){
//   const stand = evaluate(state);
//   if(stand>=beta) return beta;
//   if(alpha<stand) alpha = stand;
//   // generate captures only
//   const moves = generatePseudoLegalMoves(state).filter(m=>m.capture);
//   const ordered = orderMoves(state, moves);
//   for(const m of ordered){
//     const ns = makeMove(state, m);
//     if(isKingInCheck(ns.turn==='w'? 'b':'w', ns)) continue; // illegal resulting position
//     const score = -quiescence(ns, -beta, -alpha, tt);
//     if(score>=beta) return beta;
//     if(score>alpha) alpha=score;
//   }
//   return alpha;
// }

// function isKingInCheck(color, state){
//   const king = color==='w' ? 'K' : 'k';
//   for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(state.board[r][c]===king) return isSquareAttacked([r,c], state, color==='w'?'b':'w');
//   return true; // no king -> treat as in check
// }

// function negamax(state, depth, alpha, beta, tt){
//   const key = hashState(state);
//   const ttEntry = tt.get(key);
//   if(ttEntry && ttEntry.depth>=depth) return ttEntry.value;
//   if(depth===0) return quiescence(state, alpha, beta, tt);
//   let value = -Infinity;
//   let moves = generatePseudoLegalMoves(state);
//   if(moves.length===0){ // terminal
//     if(isKingInCheck(state.turn, state)) return -999999 + (5-depth); // mate
//     return 0; // stalemate
//   }
//   moves = orderMoves(state, moves);
//   for(const m of moves){
//     const ns = makeMove(state, m);
//     if(isKingInCheck(ns.turn==='w'? 'b':'w', ns)) continue; // illegal (shouldn't happen because we generate pseudo-legal then filtered, but safe)
//     const score = -negamax(ns, depth-1, -beta, -alpha, tt);
//     if(score>value) value=score;
//     if(value>alpha) alpha=value;
//     if(alpha>=beta) break; // cutoff
//   }
//   tt.set(key, { depth, value });
//   return value;
// }

// function iterativeDeepeningSearch(state, maxDepth, onUpdate){
//   const tt = new TT();
//   let bestMove = null; let bestScore = -Infinity;
//   for(let d=1; d<=maxDepth; d++){
//     const moves = orderMoves(state, generatePseudoLegalMoves(state));
//     let localBest = null; let localBestScore = -Infinity;
//     for(const m of moves){
//       const ns = makeMove(state, m);
//       const score = -negamax(ns, d-1, -999999, 999999, tt);
//       if(score>localBestScore){ localBestScore = score; localBest = m; }
//     }
//     if(localBest) { bestMove = localBest; bestScore = localBestScore; }
//     if(onUpdate) onUpdate(d, bestMove, bestScore);
//   }
//   return { move: bestMove, score: bestScore };
// }

// // React Component
// export default function XO(){
//   const dims = useMemo(()=>Dimensions.get('window'), []);
//   const boardSize = Math.min(dims.width, dims.height) - 40;
//   const cellSize = Math.floor(boardSize/8);

//   const init = fenToBoard(initialFen);
//   const [state, setState] = useState({...init});
//   const [selected, setSelected] = useState(null);
//   const [message, setMessage] = useState('White to move');
//   const [aiDepth, setAiDepth] = useState(2);
//   const [aiColor, setAiColor] = useState(BLACK);
//   const [aiThinking, setAiThinking] = useState(false);
//   const aiCancel = useRef(false);

//   useEffect(()=>{ if(state.turn===aiColor) runAI(); }, [state.turn]);

//   function restart(){ setState({...init}); setSelected(null); setMessage('White to move'); }

//   function runAI(){ if(aiThinking) return; setAiThinking(true); aiCancel.current=false; setMessage('AI thinking...'); setTimeout(()=>{
//     const res = iterativeDeepeningSearch(state, aiDepth, ()=>{});
//     if(aiCancel.current){ setAiThinking(false); setMessage('AI cancelled'); return; }
//     if(res.move){ const ns = makeMove(state, res.move); setState(ns); setSelected(null); setMessage((ns.turn==='w'?'White':'Black') + ' to move'); }
//     else setMessage('No legal moves');
//     setAiThinking(false);
//   }, 50); }

//   function onSquarePress(r,c){ if(aiThinking) return; const p = state.board[r][c]; if(selected){ // try move
//     const candidate = { from:selected, to:[r,c] };
//     const moves = generatePseudoLegalMoves(state);
//     // find matching move (also consider promotions)
//     const match = moves.find(m=> m.from[0]===candidate.from[0] && m.from[1]===candidate.from[1] && m.to[0]===candidate.to[0] && m.to[1]===candidate.to[1]);
//     if(match){ // handle promotion UI: if pawn reaches last rank, ask for piece
//       if(match.to && state.board[match.from[0]][match.from[1]].toLowerCase()==='p' && (match.to[0]===0 || match.to[0]===7)){
//         // auto queen for simplicity, but could prompt
//         match.promotion = pieceColor(state.board[match.from[0]][match.from[1]])===WHITE? 'Q':'q';
//       }
//       const ns = makeMove(state, match);
//       setState(ns); setSelected(null); setMessage((ns.turn==='w'?'White':'Black') + ' to move');
//     } else { if(p && pieceColor(p)===state.turn) setSelected([r,c]); else setSelected(null); }
//   } else { if(p && pieceColor(p)===state.turn) setSelected([r,c]); }}

//   // render
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text style={styles.title}>Chess</Text>
//       <View style={styles.controls}>
//         <TouchableOpacity style={styles.btn} onPress={restart}><Text style={styles.btnText}>Restart</Text></TouchableOpacity>
//         <TouchableOpacity style={styles.btn} onPress={()=>{ setAiDepth(d=> d===2?3:2); }}><Text style={styles.btnText}>AI Depth: {aiDepth}</Text></TouchableOpacity>
//         {/* <TouchableOpacity style={styles.btn} onPress={()=>{ setAiColor(c=> c===BLACK?WHITE:BLACK); restart(); }}><Text style={styles.btnText}>AI Color: {aiColor}</Text></TouchableOpacity> */}
//       </View>
//       <Text style={styles.message}>{message}{aiThinking? ' (thinking...)':''}</Text>

//       <View style={[styles.boardWrap, { width: boardSize, height: boardSize }] }>
//         {state.board.map((row,r)=> (
//           <View key={r} style={{ flexDirection:'row' }}>
//             {row.map((cell,c)=>{
//               const isDark = (r+c)%2===1;
//               const sel = selected && selected[0]===r && selected[1]===c;
//               return (
//                 <TouchableOpacity key={c} onPress={()=> onSquarePress(r,c) }
//                   style={[styles.square, { width:cellSize, height:cellSize, backgroundColor: sel? '#ffd27f' : (isDark? '#769656' : '#eeeed2') }]}>
//                   <Text style={[styles.pieceText, { fontSize: Math.floor(cellSize*0.55) }]}>{renderPiece(cell)}</Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         ))}
//       </View>

//       <Text style={styles.note}>This is a chess game that is very hard "it is hard now but if you went to be more hard make AI Depth to 3 but it will take some time to think".This Game is for chess Antonine Club. thank You for Playing .Best Love. </Text>
//     </SafeAreaView>
//   );
// }

// function renderPiece(p){ if(!p) return ''; const map = {'P':'♙','N':'♘','B':'♗','R':'♖','Q':'♕','K':'♔','p':'♟','n':'♞','b':'♝','r':'♜','q':'♛','k':'♚'}; return map[p]||p; }

// const styles = StyleSheet.create({ container:{ flex:1, alignItems:'center', padding:16, backgroundColor:'#F8FAFC' }, title:{ fontSize:18, fontWeight:'700', marginVertical:8 }, controls:{ flexDirection:'row', marginBottom:8 }, btn:{ backgroundColor:'#0f172a', paddingHorizontal:10, paddingVertical:8, borderRadius:8, marginHorizontal:6 }, btnText:{ color:'#fff', fontWeight:'600' }, boardWrap:{ borderRadius:8, overflow:'hidden', elevation:4, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:6 }, square:{ justifyContent:'center', alignItems:'center' }, pieceText:{}, message:{ marginTop:8, fontWeight:'600' }, note:{ marginTop:10, color:'#475569', textAlign:'center', paddingHorizontal:20 } });







import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';

// Initial FEN
const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

// Utilities: FEN <-> board
function fenToBoard(fen) {
  const parts = fen.split(' ');
  const rows = parts[0].split('/');
  const board = [];
  for (let r = 0; r < 8; r++) {
    const row = [];
    let fenRow = rows[r];
    for (let i = 0; i < fenRow.length; i++) {
      const ch = fenRow[i];
      if (!isNaN(+ch)) {
        for (let k = 0; k < +ch; k++) row.push('');
      } else row.push(ch);
    }
    board.push(row);
  }
  return {
    board,
    turn: parts[1] === 'w' ? 'w' : 'b',
    castling: parts[2] === '-' ? '' : parts[2],
    enPassant: parts[3] === '-' ? null : parts[3],
  };
}

function boardToFen(state) {
  const rows = state.board.map(r => {
    let s = '';
    let empty = 0;
    for (const c of r) {
      if (!c) empty++;
      else { if (empty) { s += empty; empty = 0; } s += c; }
    }
    if (empty) s += empty;
    return s;
  });
  const ep = state.enPassant || '-';
  return `${rows.join('/')} ${state.turn} ${state.castling || '-'} ${ep} 0 1`;
}

// constants
const WHITE = 'w';
const BLACK = 'b';

// piece values & PST
const pieceValue = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };
const pst = {
  p: [
    [0,0,0,0,0,0,0,0],[50,50,50,50,50,50,50,50],[10,10,20,30,30,20,10,10],[5,5,10,25,25,10,5,5],[0,0,0,20,20,0,0,0],[5,-5,-10,0,0,-10,-5,5],[5,10,10,-20,-20,10,10,5],[0,0,0,0,0,0,0,0]
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],[-40,-20,0,0,0,0,-20,-40],[-30,0,10,15,15,10,0,-30],[-30,5,15,20,20,15,5,-30],[-30,0,15,20,20,15,0,-30],[-30,5,10,15,15,10,5,-30],[-40,-20,0,5,5,0,-20,-40],[-50,-40,-30,-30,-30,-30,-40,-50]
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],[-10,5,0,0,0,0,5,-10],[-10,10,10,10,10,10,10,-10],[-10,0,10,10,10,10,0,-10],[-10,5,5,10,10,5,5,-10],[-10,0,5,10,10,5,0,-10],[-10,0,0,0,0,0,0,-10],[-20,-10,-10,-10,-10,-10,-10,-20]
  ],
  r: [
    [0,0,0,0,0,0,0,0],[5,10,10,10,10,10,10,5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[-5,0,0,0,0,0,0,-5],[0,0,0,5,5,0,0,0]
  ],
  q: [
    [-20,-10,-10,-5,-5,-10,-10,-20],[-10,0,0,0,0,0,0,-10],[-10,0,5,5,5,5,0,-10],[-5,0,5,5,5,5,0,-5],[0,0,5,5,5,5,0,-5],[-10,5,5,5,5,5,0,-10],[-10,0,5,0,0,0,0,-10],[-20,-10,-10,-5,-5,-10,-10,-20]
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-30,-40,-40,-50,-50,-40,-40,-30],[-20,-30,-30,-40,-40,-30,-30,-20],[-10,-20,-20,-20,-20,-20,-20,-10],[20,20,0,0,0,0,20,20],[20,30,10,0,0,10,30,20]
  ]
};

// Zobrist hashing (random table)
function makeZobrist() {
  const rnd = () => Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  const table = {};
  const pieces = ['P','N','B','R','Q','K','p','n','b','r','q','k'];
  for (let p of pieces) {
    table[p] = Array.from({ length: 64 }, rnd);
  }
  const turn = rnd();
  const castling = { K: rnd(), Q: rnd(), k: rnd(), q: rnd() };
  const ep = Array.from({ length: 64 }, rnd);
  return { table, turn, castling, ep };
}
const zob = makeZobrist();

function hashState(state) {
  let h = 0n;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = state.board[r][c]; if (!p) continue;
    h ^= BigInt(zob.table[p][r * 8 + c]);
  }
  if (state.turn === 'w') h ^= BigInt(zob.turn);
  if (state.castling) {
    for (const ch of state.castling) if (zob.castling[ch]) h ^= BigInt(zob.castling[ch]);
  }
  if (state.enPassant) {
    const file = state.enPassant.charCodeAt(0) - 97; // a-h
    const rank = parseInt(state.enPassant[1], 10) - 1;
    h ^= BigInt(zob.ep[rank * 8 + file]);
  }
  return h.toString();
}

// Helpers
function cloneBoard(bd) { return bd.map(r => r.slice()); }
function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8 }
function pieceColor(p){ if(!p) return null; return p === p.toUpperCase() ? WHITE : BLACK }
function isEnemy(a,b){ if(!a || !b) return false; return pieceColor(a) !== pieceColor(b); }
function algebraic(rc){ return String.fromCharCode(97 + rc[1]) + (8-rc[0]); }
function fromAlgebraic(s){ const file = s.charCodeAt(0)-97; const rank = 8-parseInt(s[1],10); return [rank,file]; }

// Pseudo-legal move generation (ignores leaving king in check)
function generatePseudoLegalMoves(state){
  const bd = state.board; const moves = [];
  for (let r=0;r<8;r++) for (let c=0;c<8;c++){
    const p = bd[r][c]; if(!p) continue; if(pieceColor(p)!==state.turn) continue;
    const lower = p.toLowerCase();
    if(lower==='p'){ // pawn
      const dir = pieceColor(p)===WHITE? -1:1;
      const start = pieceColor(p)===WHITE?6:1;
      const oneR=r+dir;
      if(inBounds(oneR,c) && !bd[oneR][c]) moves.push({from:[r,c],to:[oneR,c],capture:false});
      if(r===start && !bd[oneR][c] && !bd[r+2*dir][c]) moves.push({from:[r,c],to:[r+2*dir,c],capture:false,doublePawn:true});
      for(const dc of [-1,1]){
        const nc=c+dc; if(inBounds(oneR,nc) && bd[oneR][nc] && pieceColor(bd[oneR][nc])!==pieceColor(p)) moves.push({from:[r,c],to:[oneR,nc],capture:true});
        // en-passant
        if(state.enPassant){ const epRC = fromAlgebraic(state.enPassant); if(epRC[0]===oneR && epRC[1]===nc) moves.push({from:[r,c],to:[oneR,nc],capture:true,enPassant:true}); }
      }
    } else if(lower==='n'){
      const deltas=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for(const d of deltas){ const nr=r+d[0], nc=c+d[1]; if(inBounds(nr,nc) && (!bd[nr][nc] || pieceColor(bd[nr][nc])!==pieceColor(p))) moves.push({from:[r,c],to:[nr,nc],capture:!!bd[nr][nc]}); }
    } else if(lower==='b' || lower==='r' || lower==='q'){
      const dirs=[]; if(lower==='b'||lower==='q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); if(lower==='r'||lower==='q') dirs.push([-1,0],[1,0],[0,-1],[0,1]);
      for(const d of dirs){ let nr=r+d[0], nc=c+d[1]; while(inBounds(nr,nc)){ if(!bd[nr][nc]){ moves.push({from:[r,c],to:[nr,nc],capture:false}); } else { if(pieceColor(bd[nr][nc])!==pieceColor(p)) moves.push({from:[r,c],to:[nr,nc],capture:true}); break; } nr+=d[0]; nc+=d[1]; } }
    } else if(lower==='k'){
      for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(dr===0&&dc===0) continue; const nr=r+dr,nc=c+dc; if(inBounds(nr,nc) && (!bd[nr][nc] || pieceColor(bd[nr][nc])!==pieceColor(p))) moves.push({from:[r,c],to:[nr,nc],capture:!!bd[nr][nc]}); }
      // castling
      if(pieceColor(p)===WHITE){
        if(state.castling && state.castling.includes('K')){
          if(!bd[7][5] && !bd[7][6] && !isSquareAttacked([7,4],state,'b') && !isSquareAttacked([7,5],state,'b') && !isSquareAttacked([7,6],state,'b')) moves.push({from:[7,4],to:[7,6],castle:'K'});
        }
        if(state.castling && state.castling.includes('Q')){
          if(!bd[7][1] && !bd[7][2] && !bd[7][3] && !isSquareAttacked([7,4],state,'b') && !isSquareAttacked([7,3],state,'b') && !isSquareAttacked([7,2],state,'b')) moves.push({from:[7,4],to:[7,2],castle:'Q'});
        }
      } else {
        if(state.castling && state.castling.includes('k')){
          if(!bd[0][5] && !bd[0][6] && !isSquareAttacked([0,4],state,'w') && !isSquareAttacked([0,5],state,'w') && !isSquareAttacked([0,6],state,'w')) moves.push({from:[0,4],to:[0,6],castle:'k'});
        }
        if(state.castling && state.castling.includes('q')){
          if(!bd[0][1] && !bd[0][2] && !bd[0][3] && !isSquareAttacked([0,4],state,'w') && !isSquareAttacked([0,3],state,'w') && !isSquareAttacked([0,2],state,'w')) moves.push({from:[0,4],to:[0,2],castle:'q'});
        }
      }
    }
  }
  return moves;
}

// generate moves for a single piece ignoring check (helper for attack detection)
function generatePseudoLegalMovesForPiece([r,c], state){
  const bd = state.board; const p = bd[r][c]; if(!p) return []; const lower=p.toLowerCase(); const moves=[];
  const color = pieceColor(p);
  if(lower==='p'){ const dir = color===WHITE?-1:1; const nr=r+dir; for(const dc of [-1,1]){ const nc=c+dc; if(inBounds(nr,nc) && bd[nr][nc] && pieceColor(bd[nr][nc])!==color) moves.push([nr,nc]); } return moves; }
  if(lower==='n'){ const deltas=[[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]; for(const d of deltas){ const nr=r+d[0], nc=c+d[1]; if(inBounds(nr,nc) && (!bd[nr][nc] || pieceColor(bd[nr][nc])!==color)) moves.push([nr,nc]); } return moves; }
  if(lower==='b'||lower==='r'||lower==='q'){ const dirs=[]; if(lower==='b'||lower==='q') dirs.push([-1,-1],[-1,1],[1,-1],[1,1]); if(lower==='r'||lower==='q') dirs.push([-1,0],[1,0],[0,-1],[0,1]); for(const d of dirs){ let nr=r+d[0], nc=c+d[1]; while(inBounds(nr,nc)){ if(!bd[nr][nc]) moves.push([nr,nc]); else { if(pieceColor(bd[nr][nc])!==color) moves.push([nr,nc]); break; } nr+=d[0]; nc+=d[1]; } } return moves; }
  if(lower==='k'){ for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){ if(dr===0&&dc===0) continue; const nr=r+dr,nc=c+dc; if(inBounds(nr,nc) && (!bd[nr][nc]||pieceColor(bd[nr][nc])!==color)) moves.push([nr,nc]); } return moves; }
  return moves;
}

// attack detection
function isSquareAttacked(rc, state, byColor){
  const [r,c] = rc; const bd = state.board;
  for (let i=0;i<8;i++) for(let j=0;j<8;j++){ const p=bd[i][j]; if(!p) continue; if(pieceColor(p)!==byColor) continue; const moves = generatePseudoLegalMovesForPiece([i,j], state); for(const m of moves) if(m[0]===r && m[1]===c) return true; }
  return false;
}

// Make move (handles castling, en-passant, promotion auto-applied if present, en-passant square, castling rights)
function makeMove(state, move){
  const nb = cloneBoard(state.board);
  const [r,c]=move.from; const [nr,nc]=move.to;
  const piece = nb[r][c]; nb[nr][nc] = nb[r][c]; nb[r][c] = '';
  let newCastling = state.castling || '';
  let newEn = null;
  // handle castling rook move
  if(move.castle){
    if(move.castle==='K'){ nb[7][5] = nb[7][7]; nb[7][7]=''; newCastling=newCastling.replace('K','').replace('Q',''); }
    if(move.castle==='Q'){ nb[7][3]=nb[7][0]; nb[7][0]=''; newCastling=newCastling.replace('K','').replace('Q',''); }
    if(move.castle==='k'){ nb[0][5]=nb[0][7]; nb[0][7]=''; newCastling=newCastling.replace('k','').replace('q',''); }
    if(move.castle==='q'){ nb[0][3]=nb[0][0]; nb[0][0]=''; newCastling=newCastling.replace('k','').replace('q',''); }
  }
  // handle en-passant capture
  if(move.enPassant){ const dir = pieceColor(piece)===WHITE?1:-1; nb[nr+dir][nc]=''; }
  // handle pawn double move -> set en-passant square (algebraic)
  if(move.doublePawn){ newEn = algebraic([ (r+nr)/2 , c ]); }
  // handle promotion
  if(move.promotion){ nb[nr][nc] = move.promotion; }
  // update castling rights if king or rook moved or captured
  if(piece.toLowerCase()==='k'){ if(piece==='K') newCastling = newCastling.replace('K','').replace('Q',''); if(piece==='k') newCastling=newCastling.replace('k','').replace('q',''); }
  if((r===7 && c===0) || (nr===7 && nc===0)) newCastling = newCastling.replace('Q','');
  if((r===7 && c===7) || (nr===7 && nc===7)) newCastling = newCastling.replace('K','');
  if((r===0 && c===0) || (nr===0 && nc===0)) newCastling = newCastling.replace('q','');
  if((r===0 && c===7) || (nr===0 && nc===7)) newCastling = newCastling.replace('k','');

  const nextTurn = state.turn==='w'?'b':'w';
  return { board: nb, turn: nextTurn, castling: newCastling, enPassant: newEn };
}

// Evaluate: material + PST + mobility
function evaluate(state){
  let score = 0;
  let mobility = 0;
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p = state.board[r][c]; if(!p) continue; const lower = p.toLowerCase(); const val = pieceValue[lower] || 0; score += (p===p.toUpperCase()) ? val : -val;
    // pst
    const table = pst[lower]; if(table) {
      const v = (p===p.toUpperCase()) ? table[r][c] : -table[7-r][c]; score += v;
    }
  }
  // mobility
  const myMoves = generatePseudoLegalMoves(state).length;
  const temp = { ...state, turn: state.turn==='w'?'b':'w' };
  const oppMoves = generatePseudoLegalMoves(temp).length;
  mobility = myMoves - oppMoves;
  score += mobility * 10;
  return (state.turn==='w') ? score : -score; // perspective: positive is good for side to move
}

// move ordering: captures, promotions, castle
function orderMoves(state, moves){
  return moves.sort((a,b)=>{
    const aScore = (a.capture? 1000 : 0) + (a.promotion? 800:0) + (a.castle? 500:0);
    const bScore = (b.capture? 1000 : 0) + (b.promotion? 800:0) + (b.castle? 500:0);
    return bScore - aScore;
  });
}

// Transposition table
class TT { constructor(){ this.map = new Map(); } get(key){ return this.map.get(key); } set(key, val){ this.map.set(key, val); } }

// Quiescence search (captures only)
function quiescence(state, alpha, beta, tt){
  const stand = evaluate(state);
  if(stand>=beta) return beta;
  if(alpha<stand) alpha = stand;
  // generate captures only
  const moves = generatePseudoLegalMoves(state).filter(m=>m.capture);
  const ordered = orderMoves(state, moves);
  for(const m of ordered){
    const ns = makeMove(state, m);
    if(isKingInCheck(ns.turn==='w'? 'b':'w', ns)) continue; // illegal resulting position
    const score = -quiescence(ns, -beta, -alpha, tt);
    if(score>=beta) return beta;
    if(score>alpha) alpha=score;
  }
  return alpha;
}

// isKingInCheck: returns true if specified color's king is under attack
function isKingInCheck(color, state){
  const king = color==='w' ? 'K' : 'k';
  for(let r=0;r<8;r++) for(let c=0;c<8;c++) if(state.board[r][c]===king) return isSquareAttacked([r,c], state, color==='w'?'b':'w');
  return true; // no king -> treat as in check (illegal)
}

// Negamax with alpha-beta and TT
function negamax(state, depth, alpha, beta, tt){
  const key = hashState(state);
  const ttEntry = tt.get(key);
  if(ttEntry && ttEntry.depth>=depth) return ttEntry.value;
  if(depth===0) return quiescence(state, alpha, beta, tt);
  let value = -Infinity;
  let moves = generatePseudoLegalMoves(state);
  if(moves.length===0){ // terminal
    if(isKingInCheck(state.turn, state)) return -999999 + (5-depth); // mate
    return 0; // stalemate
  }
  moves = orderMoves(state, moves);
  for(const m of moves){
    const ns = makeMove(state, m);
    // After making the move, check whether the mover's king would be in check (illegal)
    // state.turn is the mover before the move. If the resulting ns leaves their king in check -> illegal
    if(isKingInCheck(state.turn, ns)) continue;
    const score = -negamax(ns, depth-1, -beta, -alpha, tt);
    if(score>value) value=score;
    if(value>alpha) alpha=value;
    if(alpha>=beta) break; // cutoff
  }
  tt.set(key, { depth, value });
  return value;
}

// New: generateLegalMoves (filters out moves leaving mover's king in check)
function generateLegalMoves(state){
  const pseudo = generatePseudoLegalMoves(state);
  return pseudo.filter(m => {
    const ns = makeMove(state, m);
    return !isKingInCheck(state.turn, ns);
  });
}

// iterative deepening; uses legal moves at root for accurate move selection
function iterativeDeepeningSearch(state, maxDepth, onUpdate){
  const tt = new TT();
  let bestMove = null; let bestScore = -Infinity;
  for(let d=1; d<=maxDepth; d++){
    const moves = orderMoves(state, generateLegalMoves(state));
    let localBest = null; let localBestScore = -Infinity;
    for(const m of moves){
      const ns = makeMove(state, m);
      const score = -negamax(ns, d-1, -999999, 999999, tt);
      if(score>localBestScore){ localBestScore = score; localBest = m; }
    }
    if(localBest) { bestMove = localBest; bestScore = localBestScore; }
    if(onUpdate) onUpdate(d, bestMove, bestScore);
  }
  return { move: bestMove, score: bestScore };
}

// Render piece glyphs
function renderPiece(p){ if(!p) return ''; const map = {'P':'♙','N':'♘','B':'♗','R':'♖','Q':'♕','K':'♔','p':'♟','n':'♞','b':'♝','r':'♜','q':'♛','k':'♚'}; return map[p]||p; }

// React Component
export default function XO(){
  const dims = useMemo(()=>Dimensions.get('window'), []);
  const boardSize = Math.min(dims.width, dims.height) - 40;
  const cellSize = Math.floor(boardSize/8);

  const init = fenToBoard(initialFen);
  const [state, setState] = useState({...init});
  const [selected, setSelected] = useState(null);
  const [legalTargets, setLegalTargets] = useState([]); // array of [r,c] for highlighting legal moves
  const [message, setMessage] = useState('White to move');
  const [aiDepth, setAiDepth] = useState(1);
  const [aiColor, setAiColor] = useState(BLACK);
  const [aiThinking, setAiThinking] = useState(false);
  const aiCancel = useRef(false);

  useEffect(()=>{ if(state.turn===aiColor) runAI(); }, [state.turn]);

  function restart(){ setState({...init}); setSelected(null); setLegalTargets([]); setMessage('White to move'); }

  function runAI(){ if(aiThinking) return; setAiThinking(true); aiCancel.current=false; setMessage('AI thinking...'); setTimeout(()=>{
    const res = iterativeDeepeningSearch(state, aiDepth, ()=>{});
    if(aiCancel.current){ setAiThinking(false); setMessage('AI cancelled'); return; }
    if(res.move){ const ns = makeMove(state, res.move); setState(ns); setSelected(null); setLegalTargets([]); setMessage((ns.turn==='w'?'White':'Black') + ' to move'); }
    else setMessage('No legal moves');
    setAiThinking(false);
  }, 50); }

  // When selecting a piece, compute legal target squares and store them for highlighting
  function handleSelectPiece(r,c){
    const p = state.board[r][c];
    if(!p || pieceColor(p)!==state.turn) return;
    const legal = generateLegalMoves(state).filter(m => m.from[0]===r && m.from[1]===c).map(m => `${m.to[0]},${m.to[1]}`);
    const unique = Array.from(new Set(legal)).map(s => s.split(',').map(x=>parseInt(x,10)));
    setLegalTargets(unique);
    setSelected([r,c]);
  }

  function onSquarePress(r,c){
    if(aiThinking) return;
    const p = state.board[r][c];
    if(selected){
      // try move from selected to r,c
      const candidate = { from:selected, to:[r,c] };
      const moves = generateLegalMoves(state); // use legal moves only
      const match = moves.find(m=> m.from[0]===candidate.from[0] && m.from[1]===candidate.from[1] && m.to[0]===candidate.to[0] && m.to[1]===candidate.to[1]);
      if(match){
        // handle promotion auto-queen
        const pieceAtFrom = state.board[match.from[0]][match.from[1]];
        if(match.to && pieceAtFrom.toLowerCase()==='p' && (match.to[0]===0 || match.to[0]===7)){
          match.promotion = pieceColor(pieceAtFrom)===WHITE? 'Q':'q';
        }
        const ns = makeMove(state, match);
        // ns should be legal by construction; double-check
        if(isKingInCheck(state.turn, ns)){
          setMessage('Illegal move: king would be in check');
          return;
        }
        setState(ns); setSelected(null); setLegalTargets([]); setMessage((ns.turn==='w'?'White':'Black') + ' to move');
      } else {
        // not a legal move — if clicking another of our pieces, select it
        if(p && pieceColor(p)===state.turn){ handleSelectPiece(r,c); }
        else { setSelected(null); setLegalTargets([]); }
      }
    } else {
      // no selection — if clicking our piece, select it
      if(p && pieceColor(p)===state.turn) handleSelectPiece(r,c);
    }
  }

  // render
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chess</Text>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={restart}><Text style={styles.btnText}>Restart</Text></TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={()=>{ setAiDepth(d=> d===1?2:1); }}><Text style={styles.btnText}>AI Depth: {aiDepth}</Text></TouchableOpacity>
        {/* <TouchableOpacity style={styles.btn} onPress={() => { setAiColor(c=> c===BLACK?WHITE:BLACK); restart(); }}><Text style={styles.btnText}>AI Color: {aiColor}</Text></TouchableOpacity> */}
      </View>
      <Text style={styles.message}>{message}{aiThinking? ' (thinking...)':''}</Text>

      <View style={[styles.boardWrap, { width: boardSize, height: boardSize }]}>
        {state.board.map((row,r)=> (
          <View key={r} style={{ flexDirection:'row' }}>
            {row.map((cell,c)=>{
              const isDark = (r+c)%2===1;
              const sel = selected && selected[0]===r && selected[1]===c;
              const isLegalTarget = legalTargets.some(t => t[0]===r && t[1]===c);
              return (
                <TouchableOpacity key={c} onPress={()=> onSquarePress(r,c) }
                  style={[styles.square, { width:cellSize, height:cellSize, backgroundColor: sel? '#ffd27f' : (isDark? '#769656' : '#eeeed2') }]}>
                  <Text style={[styles.pieceText, { fontSize: Math.floor(cellSize*0.55) }]}>{renderPiece(cell)}</Text>
                  {isLegalTarget ? <View style={[styles.moveDot, { width: Math.max(6, Math.floor(cellSize*0.12)), height: Math.max(6, Math.floor(cellSize*0.12)), borderRadius: Math.max(3, Math.floor(cellSize*0.06)) }]} /> : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <Text style={styles.note}>This is a chess game that is very hard — increase AI Depth to 2 to make it stronger (will take more time). This Game is for chess Antonine Club. Thank you for playing!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1, alignItems:'center', padding:16, backgroundColor:'#F8FAFC' },
  title:{ fontSize:18, fontWeight:'700', marginVertical:8 },
  controls:{ flexDirection:'row', marginBottom:8 },
  btn:{ backgroundColor:'#0f172a', paddingHorizontal:10, paddingVertical:8, borderRadius:8, marginHorizontal:6 },
  btnText:{ color:'#fff', fontWeight:'600' },
  boardWrap:{ borderRadius:8, overflow:'hidden', elevation:4, shadowColor:'#000', shadowOpacity:0.08, shadowRadius:6 },
  square:{ justifyContent:'center', alignItems:'center' },
  pieceText:{},
  message:{ marginTop:8, fontWeight:'600' },
  note:{ marginTop:10, color:'#475569', textAlign:'center', paddingHorizontal:20 },
  moveDot:{ position:'absolute', bottom:6, alignSelf:'center', backgroundColor:'rgba(0,0,0,0.25)' }
});
