import { memories, patient } from '../data/patientData';
import { Volume2, Calendar, Sparkles } from 'lucide-react';
import './PhotoOfTheDay.css';

export default function PhotoOfTheDay() {
  // Pick a memory based on the day of the year so it rotates daily
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const memoriesWithPhotos = memories.filter((m) => m.photo);
  const todayMemory =
    memoriesWithPhotos.length > 0
      ? memoriesWithPhotos[dayOfYear % memoriesWithPhotos.length]
      : memories[0];

  const speakMemory = () => {
    const text = `Today's memory: ${todayMemory.title}. ${todayMemory.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="photo-of-day">
      <div className="pod-badge">
        <Sparkles size={14} />
        <span>Today's Memory</span>
      </div>

      <div className="pod-content">
        {todayMemory.photo ? (
          <div className="pod-image-wrap">
            <img
              src={todayMemory.photo}
              alt={todayMemory.title}
              className="pod-image"
            />
            <div className="pod-image-overlay" />
          </div>
        ) : (
          <div className="pod-placeholder">
            <span className="pod-placeholder-emoji">📸</span>
          </div>
        )}

        <div className="pod-details">
          <h4 className="pod-title">{todayMemory.title}</h4>
          <p className="pod-date">
            <Calendar size={14} />
            {todayMemory.date}
          </p>
          <p className="pod-description">{todayMemory.description}</p>
          <button className="pod-speak-btn" onClick={speakMemory}>
            <Volume2 size={16} />
            Hear this memory
          </button>
        </div>
      </div>
    </div>
  );
}
