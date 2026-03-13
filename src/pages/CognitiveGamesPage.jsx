import { useState, useEffect } from 'react';
import { Gamepad2, Camera, Type, Grid3X3, Trophy, RotateCcw, CheckCircle, XCircle, Star } from 'lucide-react';
import { familyMembers, patient } from '../data/patientData';
import ScrollReveal from '../components/ScrollReveal';
import './CognitiveGamesPage.css';

const GAMES = [
  { id: 'photo', label: 'Photo Match', emoji: '📸', desc: 'Match faces to names', icon: Camera },
  { id: 'word', label: 'Word Match', emoji: '📝', desc: 'Match Hindi words', icon: Type },
  { id: 'pattern', label: 'Pattern Memory', emoji: '🧩', desc: 'Remember the pattern', icon: Grid3X3 },
];

const wordPairs = [
  { hindi: 'घर', english: 'Home', emoji: '🏠' },
  { hindi: 'परिवार', english: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { hindi: 'प्यार', english: 'Love', emoji: '❤️' },
  { hindi: 'फूल', english: 'Flower', emoji: '🌸' },
  { hindi: 'सूरज', english: 'Sun', emoji: '☀️' },
  { hindi: 'पानी', english: 'Water', emoji: '💧' },
];

const PATTERN_COLORS = ['#b8a9e8', '#f5c5a3', '#a3d4f5', '#a8e6cf', '#f5a3b8', '#d4c8f5'];

export default function CognitiveGamesPage() {
  const [activeGame, setActiveGame] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);

  // Photo Match state
  const [photoTarget, setPhotoTarget] = useState(null);
  const [photoOptions, setPhotoOptions] = useState([]);

  // Word Match state
  const [wordTarget, setWordTarget] = useState(null);
  const [wordOptions, setWordOptions] = useState([]);

  // Pattern Memory state
  const [pattern, setPattern] = useState([]);
  const [playerPattern, setPlayerPattern] = useState([]);
  const [showingPattern, setShowingPattern] = useState(false);
  const [patternStep, setPatternStep] = useState(0);
  const [highlightedCell, setHighlightedCell] = useState(null);

  const startGame = (gameId) => {
    setActiveGame(gameId);
    setScore(0);
    setRound(0);
    setFeedback(null);

    if (gameId === 'photo') setupPhotoRound();
    if (gameId === 'word') setupWordRound();
    if (gameId === 'pattern') setupPatternRound(3);
  };

  // --- Photo Match ---
  const setupPhotoRound = () => {
    const shuffled = [...familyMembers].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    setPhotoTarget(target);
    setPhotoOptions(shuffled.map((m) => m.name).sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  const checkPhotoAnswer = (name) => {
    if (name === photoTarget.name) {
      setScore((s) => s + 10);
      setFeedback({ type: 'correct', text: `Yes! That's ${photoTarget.name}, your ${photoTarget.relationship}! 🎉` });
      const utterance = new SpeechSynthesisUtterance(`Correct! That is ${photoTarget.name}, your ${photoTarget.relationship}.`);
      utterance.rate = 0.85;
      utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    } else {
      setFeedback({ type: 'wrong', text: `That's ${photoTarget.name}, your ${photoTarget.relationship}. Try to remember! 💛` });
    }
    setRound((r) => r + 1);
    setTimeout(() => setupPhotoRound(), 2500);
  };

  // --- Word Match ---
  const setupWordRound = () => {
    const shuffled = [...wordPairs].sort(() => Math.random() - 0.5);
    const target = shuffled[0];
    setWordTarget(target);
    setWordOptions(shuffled.slice(0, 4).map((w) => w.english).sort(() => Math.random() - 0.5));
    setFeedback(null);
  };

  const checkWordAnswer = (english) => {
    if (english === wordTarget.english) {
      setScore((s) => s + 10);
      setFeedback({ type: 'correct', text: `Correct! "${wordTarget.hindi}" means "${wordTarget.english}" ${wordTarget.emoji}` });
    } else {
      setFeedback({ type: 'wrong', text: `"${wordTarget.hindi}" means "${wordTarget.english}" ${wordTarget.emoji}. Keep trying!` });
    }
    setRound((r) => r + 1);
    setTimeout(() => setupWordRound(), 2500);
  };

  // --- Pattern Memory ---
  const setupPatternRound = (length) => {
    const newPattern = Array.from({ length }, () => Math.floor(Math.random() * 6));
    setPattern(newPattern);
    setPlayerPattern([]);
    setPatternStep(0);
    setFeedback(null);
    showPattern(newPattern);
  };

  const showPattern = (pat) => {
    setShowingPattern(true);
    pat.forEach((cell, i) => {
      setTimeout(() => setHighlightedCell(cell), i * 700);
      setTimeout(() => setHighlightedCell(null), i * 700 + 500);
    });
    setTimeout(() => {
      setShowingPattern(false);
      setHighlightedCell(null);
    }, pat.length * 700 + 200);
  };

  const handlePatternClick = (cellIdx) => {
    if (showingPattern) return;

    const newPlayerPattern = [...playerPattern, cellIdx];
    setPlayerPattern(newPlayerPattern);

    if (cellIdx !== pattern[newPlayerPattern.length - 1]) {
      setFeedback({ type: 'wrong', text: "Not quite! Let me show you again. 💛" });
      setRound((r) => r + 1);
      setTimeout(() => setupPatternRound(pattern.length), 2000);
      return;
    }

    if (newPlayerPattern.length === pattern.length) {
      setScore((s) => s + 15);
      setFeedback({ type: 'correct', text: "Perfect memory! You got the pattern! 🎉" });
      setRound((r) => r + 1);
      setTimeout(() => setupPatternRound(Math.min(pattern.length + 1, 6)), 2000);
    }
  };

  const renderPhotoGame = () => (
    <div className="cg-game-area">
      {photoTarget && (
        <>
          <div className="cg-prompt">Who is this person?</div>
          <div className="cg-photo-display">
            <img src={photoTarget.photo} alt="Who is this?" className="cg-photo" />
          </div>
          <div className="cg-options">
            {photoOptions.map((name) => (
              <button key={name} className="cg-option-btn" onClick={() => checkPhotoAnswer(name)}>
                {name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderWordGame = () => (
    <div className="cg-game-area">
      {wordTarget && (
        <>
          <div className="cg-prompt">What does this word mean?</div>
          <div className="cg-word-display">
            <span className="cg-hindi-word">{wordTarget.hindi}</span>
          </div>
          <div className="cg-options">
            {wordOptions.map((english) => (
              <button key={english} className="cg-option-btn" onClick={() => checkWordAnswer(english)}>
                {english}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderPatternGame = () => (
    <div className="cg-game-area">
      <div className="cg-prompt">
        {showingPattern ? 'Watch the pattern...' : 'Now repeat the pattern!'}
      </div>
      <div className="cg-pattern-grid">
        {PATTERN_COLORS.map((color, i) => (
          <button
            key={i}
            className={`cg-pattern-cell ${highlightedCell === i ? 'highlighted' : ''}`}
            style={{ '--cell-color': color }}
            onClick={() => handlePatternClick(i)}
            disabled={showingPattern}
          />
        ))}
      </div>
      <div className="cg-pattern-progress">
        {pattern.map((_, i) => (
          <div
            key={i}
            className={`cg-progress-dot ${i < playerPattern.length ? 'filled' : ''}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="cognitive-games">
      <ScrollReveal direction="up" duration={0.7}>
        <header className="page-header">
          <div className="page-header-left">
            <div className="page-icon-wrap games-icon">
              <Gamepad2 size={24} />
            </div>
            <div>
              <h1 className="page-title">Brain Games</h1>
              <p className="page-subtitle">
                <Star size={14} />
                Fun exercises to keep your mind active
              </p>
            </div>
          </div>
        </header>
      </ScrollReveal>

      {!activeGame ? (
        <div className="cg-game-grid">
          {GAMES.map((game, i) => (
            <ScrollReveal key={game.id} direction="up" delay={i * 0.1}>
              <button className="cg-game-card" onClick={() => startGame(game.id)}>
                <span className="cg-game-emoji">{game.emoji}</span>
                <h3>{game.label}</h3>
                <p>{game.desc}</p>
              </button>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <div className="cg-active-game">
          <div className="cg-game-topbar">
            <button className="cg-back-btn" onClick={() => setActiveGame(null)}>
              ← Back to Games
            </button>
            <div className="cg-score-display">
              <Trophy size={16} />
              <span>{score} points</span>
            </div>
            <div className="cg-round-display">
              Round {round + 1}
            </div>
          </div>

          {feedback && (
            <div className={`cg-feedback cg-feedback-${feedback.type} animate-scale-in`}>
              {feedback.type === 'correct' ? <CheckCircle size={18} /> : <XCircle size={18} />}
              {feedback.text}
            </div>
          )}

          {activeGame === 'photo' && renderPhotoGame()}
          {activeGame === 'word' && renderWordGame()}
          {activeGame === 'pattern' && renderPatternGame()}
        </div>
      )}
    </div>
  );
}
