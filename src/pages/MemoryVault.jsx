import { useState, useEffect } from 'react';
import { BookHeart, Volume2, Sparkles, Square } from 'lucide-react';
import { memories, patient, timelineEvents } from '../data/patientData';
import MemoryCard from '../components/MemoryCard';
import SplineScene from '../components/SplineScene';
import ScrollReveal from '../components/ScrollReveal';
import './MemoryVault.css';

const SPLINE_SCENE_URL = 'https://my.spline.design/claritystream-4vR4muSsQA0M1MY0wmvUB6hB/';

export default function MemoryVault() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Cleanup speech on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleTellMyStory = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    // Assemble the story
    const intro = `Hello ${patient.name}. Let's take a walk down memory lane. `;
    const events = timelineEvents.slice(0, 5).map(e => `In ${e.year}, ${e.description}`).join('. ');
    const outro = ` You have lived a beautiful life in ${patient.location}, and your family loves you very much.`;
    
    const fullStory = intro + events + outro;

    const utterance = new SpeechSynthesisUtterance(fullStory);
    utterance.rate = 0.85; // Slightly slower for clarity
    utterance.lang = 'en-IN';
    
    utterance.onend = () => setIsPlaying(false);
    
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  return (
    <div className="memory-vault">
      <header className="page-header mv-header">
        <div className="mv-spline-accent">
          <SplineScene sceneUrl={SPLINE_SCENE_URL} className="mv-spline" />
          <div className="mv-spline-overlay" />
        </div>
        <ScrollReveal direction="up" duration={0.7}>
          <div className="page-header-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="page-header-left">
              <div className="page-icon-wrap memory-icon">
                <BookHeart size={24} />
              </div>
              <div>
                <h1 className="page-title">Memory Vault</h1>
                <p className="page-subtitle">Your precious life stories and memories</p>
              </div>
            </div>
            <button 
              className={`tell-story-btn ${isPlaying ? 'playing' : ''}`}
              onClick={handleTellMyStory}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                borderRadius: '50px',
                background: isPlaying ? 'rgba(239, 68, 68, 0.2)' : 'rgba(168, 230, 207, 0.2)',
                color: isPlaying ? '#ef4444' : '#a8e6cf',
                fontSize: '1.1rem',
                fontWeight: '600',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                border: `1px solid ${isPlaying ? 'rgba(239, 68, 68, 0.3)' : 'rgba(168, 230, 207, 0.3)'}`,
                transition: 'all 0.3s ease'
              }}
            >
              {isPlaying ? <Square size={20} /> : <Volume2 size={20} />}
              {isPlaying ? 'Stop Story' : 'Tell My Story'}
            </button>
          </div>
        </ScrollReveal>
      </header>

      <ScrollReveal direction="up" delay={0.1}>
        <div className="memory-intro">
          <Sparkles size={18} className="intro-sparkle" />
          <p>
            These are your most cherished memories, {patient.name}. Tap on any memory to hear it read aloud. 💛
          </p>
        </div>
      </ScrollReveal>

      <div className="memory-grid">
        {memories.map((memory, i) => (
          <ScrollReveal key={memory.id} direction="up" delay={i * 0.08}>
            <MemoryCard memory={memory} />
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
