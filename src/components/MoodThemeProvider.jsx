import { useEffect, useState } from 'react';

const MOOD_THEMES = {
  happy: {
    '--mood-bg': 'radial-gradient(ellipse at 20% 80%, rgba(250, 204, 21, 0.08) 0%, transparent 60%)',
    '--mood-accent': '#facc15',
    '--mood-accent-glow': 'rgba(250, 204, 21, 0.15)',
    '--mood-border': 'rgba(250, 204, 21, 0.2)',
    label: '☀️ Bright & Warm',
  },
  calm: {
    '--mood-bg': 'radial-gradient(ellipse at 20% 80%, rgba(56, 189, 248, 0.08) 0%, transparent 60%)',
    '--mood-accent': '#38bdf8',
    '--mood-accent-glow': 'rgba(56, 189, 248, 0.15)',
    '--mood-border': 'rgba(56, 189, 248, 0.2)',
    label: '🌊 Cool & Serene',
  },
  sad: {
    '--mood-bg': 'radial-gradient(ellipse at 20% 80%, rgba(129, 140, 248, 0.08) 0%, transparent 60%)',
    '--mood-accent': '#818cf8',
    '--mood-accent-glow': 'rgba(129, 140, 248, 0.15)',
    '--mood-border': 'rgba(129, 140, 248, 0.2)',
    label: '💜 Gentle & Comforting',
  },
  anxious: {
    '--mood-bg': 'radial-gradient(ellipse at 20% 80%, rgba(52, 211, 153, 0.08) 0%, transparent 60%)',
    '--mood-accent': '#34d399',
    '--mood-accent-glow': 'rgba(52, 211, 153, 0.15)',
    '--mood-border': 'rgba(52, 211, 153, 0.2)',
    label: '🌿 Calm & Grounding',
  },
  tired: {
    '--mood-bg': 'radial-gradient(ellipse at 20% 80%, rgba(244, 114, 182, 0.06) 0%, transparent 60%)',
    '--mood-accent': '#f472b6',
    '--mood-accent-glow': 'rgba(244, 114, 182, 0.1)',
    '--mood-border': 'rgba(244, 114, 182, 0.15)',
    label: '🌙 Soft & Restful',
  },
};

export default function MoodThemeProvider({ children }) {
  const [currentMood, setCurrentMood] = useState(null);
  const [themeLabel, setThemeLabel] = useState('');

  const applyTheme = (moodId) => {
    const theme = MOOD_THEMES[moodId];
    if (!theme) return;

    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      if (key.startsWith('--')) {
        root.style.setProperty(key, value);
      }
    });
    setThemeLabel(theme.label);
  };

  useEffect(() => {
    const checkMood = () => {
      const today = new Date().toDateString();
      const stored = JSON.parse(localStorage.getItem('moodHistory') || '[]');
      const todayEntry = stored.find(e => e.date === today);
      if (todayEntry && todayEntry.mood !== currentMood) {
        setCurrentMood(todayEntry.mood);
        applyTheme(todayEntry.mood);
      }
    };

    checkMood();
    // Listen for mood changes via storage events and custom events
    const handleStorage = (e) => {
      if (e.key === 'moodHistory' || e.type === 'moodUpdated') checkMood();
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('moodUpdated', handleStorage);
    // Fallback poll every 30s instead of 2s
    const interval = setInterval(checkMood, 30000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('moodUpdated', handleStorage);
    };
  }, [currentMood]);

  return (
    <>
      {currentMood && (
        <div className="mood-theme-indicator">
          <span>{themeLabel}</span>
        </div>
      )}
      {children}
    </>
  );
}
