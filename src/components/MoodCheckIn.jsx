import { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Angry, Moon } from 'lucide-react';
import './MoodCheckIn.css';

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy', icon: Smile, color: '#a8e6cf' },
  { id: 'calm', emoji: '😌', label: 'Calm', icon: Meh, color: '#a3d4f5' },
  { id: 'sad', emoji: '😢', label: 'Sad', icon: Frown, color: '#b8a9e8' },
  { id: 'anxious', emoji: '😟', label: 'Anxious', icon: Angry, color: '#f5c5a3' },
  { id: 'tired', emoji: '😴', label: 'Tired', icon: Moon, color: '#f5a3b8' },
];

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const todayEntry = stored.find((e) => e.date === today);
    if (todayEntry) {
      setSelectedMood(todayEntry.mood);
    }
  }, []);

  const selectMood = (moodId) => {
    setSelectedMood(moodId);
    setShowConfirmation(true);

    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('moodHistory') || '[]');
    const filtered = stored.filter((e) => e.date !== today);
    filtered.push({ date: today, mood: moodId, timestamp: Date.now() });
    // Keep last 30 days
    const recent = filtered.slice(-30);
    localStorage.setItem('moodHistory', JSON.stringify(recent));

    // Speak confirmation
    const mood = moods.find((m) => m.id === moodId);
    const utterance = new SpeechSynthesisUtterance(
      `You're feeling ${mood.label} today. Thank you for sharing.`
    );
    utterance.rate = 0.85;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);

    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <div className="mood-checkin">
      <div className="mood-header">
        <h3 className="mood-title">How are you feeling?</h3>
        <p className="mood-subtitle">Tap the face that matches your mood</p>
      </div>

      <div className="mood-options">
        {moods.map((mood) => (
          <button
            key={mood.id}
            className={`mood-btn ${selectedMood === mood.id ? 'selected' : ''}`}
            onClick={() => selectMood(mood.id)}
            style={{
              '--mood-color': mood.color,
              '--mood-glow': `${mood.color}40`,
            }}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>

      {showConfirmation && (
        <div className="mood-confirmation animate-fade-in">
          <span>✨</span> Thank you for sharing! You're doing great. 💛
        </div>
      )}

      {selectedMood && !showConfirmation && (
        <div className="mood-current">
          Today's mood: {moods.find((m) => m.id === selectedMood)?.emoji}{' '}
          {moods.find((m) => m.id === selectedMood)?.label}
        </div>
      )}
    </div>
  );
}
