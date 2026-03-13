import { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, Zap, Hash, Shuffle, RotateCcw, Trophy, Timer, ChevronRight, Star } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import './NeuroGymPage.css';

// --- GAME DATA ---
const SCRAMBLE_WORDS = [
  { word: 'NEUROSCIENCE', hint: 'Study of the brain' },
  { word: 'HIPPOCAMPUS', hint: 'Brain region for memory' },
  { word: 'COGNITION', hint: 'Mental processes' },
  { word: 'SYNAPSE', hint: 'Connection between neurons' },
  { word: 'PREFRONTAL', hint: 'Front part of the brain' },
  { word: 'AMYGDALA', hint: 'Controls emotions' },
  { word: 'NEUROPLASTICITY', hint: 'Brain\'s ability to change' },
  { word: 'CEREBELLUM', hint: 'Controls coordination' },
];

const GAMES = [
  { id: 'speedmath', label: 'Speed Math', emoji: '⚡', desc: 'Solve equations fast — time is running out!', difficulty: 'Hard' },
  { id: 'sequence', label: 'Sequence Memory', emoji: '🧠', desc: 'Remember growing sequences of numbers', difficulty: 'Very Hard' },
  { id: 'scramble', label: 'Word Scramble', emoji: '🔤', desc: 'Unscramble complex words against the clock', difficulty: 'Hard' },
  { id: 'nback', label: 'N-Back Challenge', emoji: '🎯', desc: 'Remember what appeared N steps ago', difficulty: 'Expert' },
];

const scrambleWord = (word) => word.split('').sort(() => Math.random() - 0.5).join('');

export default function NeuroGymPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const timerRef = useRef(null);

  // Speed Math state
  const [mathQ, setMathQ] = useState(null);
  const [mathOptions, setMathOptions] = useState([]);

  // Sequence Memory state
  const [seq, setSeq] = useState([]);
  const [userSeq, setUserSeq] = useState([]);
  const [showingSeq, setShowingSeq] = useState(false);
  const [seqLevel, setSeqLevel] = useState(3);
  const [activeNum, setActiveNum] = useState(null);

  // Word Scramble state
  const [scrambled, setScrambled] = useState('');
  const [wordTarget, setWordTarget] = useState(null);
  const [wordInput, setWordInput] = useState('');

  // N-Back state
  const [nbackSeq, setNbackSeq] = useState([]);
  const [nbackIdx, setNbackIdx] = useState(0);
  const [nbackN, setNbackN] = useState(2);
  const [nbackLetters] = useState(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']);
  const [nbackCurrent, setNbackCurrent] = useState('');
  const [nbackWaiting, setNbackWaiting] = useState(false);
  const nbackRef = useRef(null);

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(60);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = () => clearInterval(timerRef.current);

  const startGame = (gameId) => {
    setActiveGame(gameId);
    setScore(0);
    setGameOver(false);
    setFeedback(null);
    startTimer();
    if (gameId === 'speedmath') setupMath();
    if (gameId === 'sequence') { setSeqLevel(3); setupSequence(3); }
    if (gameId === 'scramble') setupScramble();
    if (gameId === 'nback') setupNback();
  };

  const endGame = useCallback((finalScore) => {
    stopTimer();
    setGameOver(true);
    if (finalScore > highScore) setHighScore(finalScore);
  }, [highScore]);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // --- SPEED MATH ---
  const setupMath = () => {
    const ops = ['+', '-', '×', '÷'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;
    if (op === '+') { a = Math.floor(Math.random() * 50) + 10; b = Math.floor(Math.random() * 50) + 10; answer = a + b; }
    else if (op === '-') { a = Math.floor(Math.random() * 50) + 30; b = Math.floor(Math.random() * 30) + 1; answer = a - b; }
    else if (op === '×') { a = Math.floor(Math.random() * 12) + 2; b = Math.floor(Math.random() * 12) + 2; answer = a * b; }
    else { a = (Math.floor(Math.random() * 10) + 2) * (Math.floor(Math.random() * 5) + 2); b = Math.floor(Math.random() * 10) + 2; answer = a / b; a = answer * b; }

    const wrongOptions = new Set();
    while (wrongOptions.size < 3) {
      const wrong = answer + Math.floor(Math.random() * 20) - 10;
      if (wrong !== answer) wrongOptions.add(wrong);
    }
    const opts = [...wrongOptions, answer].sort(() => Math.random() - 0.5);
    setMathQ({ a, b, op, answer });
    setMathOptions(opts);
    setFeedback(null);
  };

  const checkMath = (choice) => {
    if (choice === mathQ.answer) {
      setScore(s => s + 20);
      setFeedback({ type: 'correct', text: '✓ Correct! +20' });
    } else {
      setFeedback({ type: 'wrong', text: `✗ Answer was ${mathQ.answer}` });
    }
    setTimeout(() => { setupMath(); setFeedback(null); }, 900);
  };

  // --- SEQUENCE MEMORY ---
  const setupSequence = useCallback((level) => {
    const newSeq = Array.from({ length: level }, () => Math.floor(Math.random() * 9) + 1);
    setSeq(newSeq);
    setUserSeq([]);
    setShowingSeq(true);
    setFeedback(null);
    newSeq.forEach((num, i) => {
      setTimeout(() => setActiveNum(num), i * 800);
      setTimeout(() => setActiveNum(null), i * 800 + 500);
    });
    setTimeout(() => { setShowingSeq(false); setActiveNum(null); }, newSeq.length * 800 + 300);
  }, []);

  const handleSeqNum = (num) => {
    if (showingSeq) return;
    const newUserSeq = [...userSeq, num];
    setUserSeq(newUserSeq);
    const idx = newUserSeq.length - 1;
    if (num !== seq[idx]) {
      setFeedback({ type: 'wrong', text: `Wrong! Sequence was: ${seq.join(' → ')}` });
      setScore(s => Math.max(0, s - 5));
      const resetLevel = Math.max(3, seqLevel - 1);
      setSeqLevel(resetLevel);
      setTimeout(() => { setFeedback(null); setupSequence(resetLevel); }, 2000);
      return;
    }
    if (newUserSeq.length === seq.length) {
      const pts = seqLevel * 15;
      setScore(s => s + pts);
      setFeedback({ type: 'correct', text: `Perfect! +${pts} pts. Level up!` });
      const nextLevel = seqLevel + 1;
      setSeqLevel(nextLevel);
      setTimeout(() => { setFeedback(null); setupSequence(nextLevel); }, 1500);
    }
  };

  // --- WORD SCRAMBLE ---
  const setupScramble = () => {
    const target = SCRAMBLE_WORDS[Math.floor(Math.random() * SCRAMBLE_WORDS.length)];
    setWordTarget(target);
    setScrambled(scrambleWord(target.word));
    setWordInput('');
    setFeedback(null);
  };

  const checkScramble = (e) => {
    e.preventDefault();
    if (wordInput.toUpperCase() === wordTarget.word) {
      const pts = wordTarget.word.length * 5;
      setScore(s => s + pts);
      setFeedback({ type: 'correct', text: `Correct! +${pts} pts` });
      setTimeout(() => { setupScramble(); setFeedback(null); }, 1200);
    } else {
      setFeedback({ type: 'wrong', text: 'Not quite, try again!' });
      setTimeout(() => setFeedback(null), 700);
    }
    setWordInput('');
  };

  // --- N-BACK ---
  const setupNback = useCallback(() => {
    const letters = ['A','B','C','D','E','F','G','H'];
    const initial = Array.from({ length: nbackN }, () => letters[Math.floor(Math.random() * letters.length)]);
    setNbackSeq(initial);
    setNbackIdx(nbackN);
    setNbackCurrent(initial[initial.length - 1]);
    setNbackWaiting(true);
    setFeedback(null);
  }, [nbackN]);

  const advanceNback = useCallback(() => {
    const letters = ['A','B','C','D','E','F','G','H'];
    const next = letters[Math.floor(Math.random() * letters.length)];
    setNbackSeq(prev => [...prev, next]);
    setNbackCurrent(next);
    setNbackWaiting(true);
    setFeedback(null);
  }, []);

  const handleNback = (isMatch) => {
    if (!nbackWaiting) return;
    const actual = nbackSeq[nbackSeq.length - 1] === nbackSeq[nbackSeq.length - 1 - nbackN];
    if (isMatch === actual) {
      setScore(s => s + 25);
      setFeedback({ type: 'correct', text: `✓ Correct! +25` });
    } else {
      setFeedback({ type: 'wrong', text: `✗ Wrong! The letter ${nbackN} steps ago was "${nbackSeq[nbackSeq.length - 1 - nbackN]}"` });
    }
    setNbackWaiting(false);
    setTimeout(() => advanceNback(), 1500);
  };

  const renderGameSelect = () => (
    <div className="ng-game-select">
      <ScrollReveal direction="up" duration={0.6}>
        <div className="ng-header">
          <div className="ng-header-icon"><Brain size={32} /></div>
          <div>
            <h1>Neuro Gym</h1>
            <p>Elite cognitive training for peak mental performance</p>
          </div>
          {highScore > 0 && (
            <div className="ng-high-score">
              <Trophy size={20} />
              <span>Best: {highScore}</span>
            </div>
          )}
        </div>
      </ScrollReveal>

      <div className="ng-game-grid">
        {GAMES.map((game, i) => (
          <ScrollReveal key={game.id} direction="up" delay={i * 0.1}>
            <button className="ng-game-card" onClick={() => startGame(game.id)}>
              <div className="ng-game-emoji">{game.emoji}</div>
              <div className="ng-game-info">
                <h3>{game.label}</h3>
                <p>{game.desc}</p>
              </div>
              <div className="ng-game-meta">
                <span className={`ng-difficulty diff-${game.difficulty.toLowerCase().replace(' ', '')}`}>{game.difficulty}</span>
                <ChevronRight size={20} className="ng-arrow" />
              </div>
            </button>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="ng-game-over animate-scale-in">
      <div className="ng-go-icon">🏆</div>
      <h2>Time's Up!</h2>
      <div className="ng-final-score">{score}</div>
      <p className="ng-final-label">Points scored</p>
      {score > highScore && <div className="ng-new-record">🎉 New Personal Best!</div>}
      <div className="ng-go-actions">
        <button className="ng-play-again" onClick={() => startGame(activeGame)}>
          <RotateCcw size={18} /> Play Again
        </button>
        <button className="ng-back-btn" onClick={() => { setActiveGame(null); setGameOver(false); }}>
          ← All Games
        </button>
      </div>
    </div>
  );

  const renderTopBar = () => (
    <div className="ng-topbar">
      <button className="ng-back-btn-sm" onClick={() => { setActiveGame(null); stopTimer(); }}>← Back</button>
      <div className="ng-stats">
        <div className="ng-stat">
          <Zap size={16} className={timeLeft <= 10 ? 'urgent' : ''} />
          <span className={`ng-timer ${timeLeft <= 10 ? 'urgent' : ''}`}>{timeLeft}s</span>
        </div>
        <div className="ng-stat">
          <Trophy size={16} />
          <span>{score} pts</span>
        </div>
      </div>
    </div>
  );

  const renderSpeedMath = () => !mathQ ? null : (
    <div className="ng-game-area">
      {renderTopBar()}
      <div className="ng-math-display">
        <span className="ng-math-q">{mathQ.a} {mathQ.op} {mathQ.b} = ?</span>
      </div>
      {feedback && <div className={`ng-feedback ng-fb-${feedback.type}`}>{feedback.text}</div>}
      <div className="ng-math-options">
        {mathOptions.map(opt => (
          <button key={opt} className="ng-option" onClick={() => checkMath(opt)}>{opt}</button>
        ))}
      </div>
    </div>
  );

  const renderSequence = () => (
    <div className="ng-game-area">
      {renderTopBar()}
      <div className="ng-seq-display">
        {showingSeq ? (
          <div className="ng-active-num animate-scale-in">{activeNum}</div>
        ) : (
          <p className="ng-prompt">Tap the numbers in order! (Level {seqLevel})</p>
        )}
      </div>
      {feedback && <div className={`ng-feedback ng-fb-${feedback.type}`}>{feedback.text}</div>}
      <div className="ng-seq-pad">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button
            key={n}
            className={`ng-seq-btn ${showingSeq ? 'disabled' : ''}`}
            onClick={() => handleSeqNum(n)}
            disabled={showingSeq}
          >{n}</button>
        ))}
      </div>
    </div>
  );

  const renderScramble = () => !wordTarget ? null : (
    <div className="ng-game-area">
      {renderTopBar()}
      <div className="ng-scramble-word">{scrambled}</div>
      <p className="ng-hint">Hint: {wordTarget.hint}</p>
      {feedback && <div className={`ng-feedback ng-fb-${feedback.type}`}>{feedback.text}</div>}
      <form onSubmit={checkScramble} className="ng-scramble-form">
        <input
          className="ng-scramble-input"
          value={wordInput}
          onChange={e => setWordInput(e.target.value.toUpperCase())}
          placeholder="Type your answer..."
          autoFocus
        />
        <button type="submit" className="ng-scramble-submit">Submit →</button>
      </form>
    </div>
  );

  const renderNback = () => (
    <div className="ng-game-area">
      {renderTopBar()}
      <p className="ng-prompt">Does the current letter match the letter <strong>{nbackN}</strong> steps ago?</p>
      <div className="ng-nback-display">
        <div className="ng-nback-letter animate-scale-in">{nbackCurrent}</div>
        <div className="ng-nback-history">
          {nbackSeq.slice(-6).map((l, i) => (
            <span key={i} className="ng-nback-prev">{l}</span>
          ))}
        </div>
      </div>
      {feedback && <div className={`ng-feedback ng-fb-${feedback.type}`}>{feedback.text}</div>}
      <div className="ng-nback-btns">
        <button className="ng-nback-yes" onClick={() => handleNback(true)}>✓ Match</button>
        <button className="ng-nback-no" onClick={() => handleNback(false)}>✗ No Match</button>
      </div>
    </div>
  );

  return (
    <div className="neuro-gym">
      {!activeGame && renderGameSelect()}
      {activeGame && gameOver && renderGameOver()}
      {activeGame && !gameOver && (
        <>
          {activeGame === 'speedmath' && renderSpeedMath()}
          {activeGame === 'sequence' && renderSequence()}
          {activeGame === 'scramble' && renderScramble()}
          {activeGame === 'nback' && renderNback()}
        </>
      )}
    </div>
  );
}
