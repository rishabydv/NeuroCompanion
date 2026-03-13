import { Calendar, Bookmark } from 'lucide-react';
import './MemoryCard.css';

export default function MemoryCard({ memory }) {
  const categoryColors = {
    milestone: { bg: 'rgba(245, 197, 163, 0.12)', color: 'var(--peach)', label: '🏆 Milestone' },
    family: { bg: 'rgba(184, 169, 232, 0.12)', color: 'var(--lavender)', label: '👨‍👩‍👧‍👦 Family' },
    travel: { bg: 'rgba(163, 212, 245, 0.12)', color: 'var(--sky)', label: '✈️ Travel' },
    personal: { bg: 'rgba(168, 230, 207, 0.12)', color: 'var(--mint)', label: '💛 Personal' },
  };

  const cat = categoryColors[memory.category] || categoryColors.personal;

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(
      `${memory.title}. ${memory.date}. ${memory.description}`
    );
    utterance.rate = 0.82;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="memory-card animate-fade-in-up" onClick={speak}>
      {memory.photo && (
        <div className="memory-card-image-wrap">
          <img src={memory.photo} alt={memory.title} className="memory-card-image" />
          <div className="memory-card-overlay" />
        </div>
      )}
      <div className="memory-card-content">
        <div className="memory-card-top">
          <span
            className="memory-category"
            style={{ background: cat.bg, color: cat.color }}
          >
            {cat.label}
          </span>
          <span className="memory-date">
            <Calendar size={14} />
            {memory.date}
          </span>
        </div>
        <h3 className="memory-title">{memory.title}</h3>
        <p className="memory-description">{memory.description}</p>
        <span className="memory-listen-hint">🔊 Tap to listen</span>
      </div>
    </div>
  );
}
