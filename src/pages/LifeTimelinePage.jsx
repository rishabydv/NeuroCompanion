import { useState } from 'react';
import { History, Volume2, Calendar, MapPin, ChevronRight, CheckCircle } from 'lucide-react';
import { timelineEvents, patient } from '../data/patientData';
import ScrollReveal from '../components/ScrollReveal';
import SplineScene from '../components/SplineScene';
import './LifeTimelinePage.css';

const SPLINE_SCENE_URL = 'https://my.spline.design/claritystream-4vR4muSsQA0M1MY0wmvUB6hB/';

export default function LifeTimelinePage() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const speakEvent = (event) => {
    setSelectedEvent(event.id);
    const text = `In ${event.year}, ${event.title}. ${event.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    
    // Auto deselect after reading
    utterance.onend = () => setSelectedEvent(null);
  };

  const speakIntro = () => {
    const text = `This is the timeline of your life, ${patient.name}. From your childhood in Jaipur to your beautiful family today. You have lived a rich and wonderful life.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="timeline-page">
      <header className="timeline-header">
        <div className="tl-spline-bg">
          <SplineScene sceneUrl={SPLINE_SCENE_URL} className="tl-spline" />
          <div className="tl-spline-overlay" />
        </div>
        <ScrollReveal direction="up" duration={0.8}>
          <div className="tl-header-content">
            <div className="tl-icon-wrap">
              <History size={32} />
            </div>
            <h1 className="tl-title">Book of Life</h1>
            <p className="tl-subtitle">The wonderful story of {patient.name}</p>
            <button className="tl-speak-intro" onClick={speakIntro}>
              <Volume2 size={16} />
              Hear Your Story
            </button>
          </div>
        </ScrollReveal>
      </header>

      <div className="tl-scroll-container">
        <div className="tl-line"></div>
        {timelineEvents.map((event, index) => {
          const isSelected = selectedEvent === event.id;
          const isLeft = index % 2 === 0;

          return (
            <ScrollReveal 
              key={event.id} 
              direction={isLeft ? "right" : "left"} 
              delay={index * 0.1}
              distance={40}
            >
              <div className={`tl-node ${isLeft ? 'tl-node-left' : 'tl-node-right'} ${isSelected ? 'selected' : ''}`}>
                <div className="tl-point">
                  <span className="tl-point-inner"></span>
                </div>
                
                <div className="tl-card" onClick={() => speakEvent(event)}>
                  <div className="tl-card-header">
                    <span className="tl-year">{event.year}</span>
                    <span className="tl-emoji">{event.emoji}</span>
                  </div>
                  <h3 className="tl-card-title">{event.title}</h3>
                  <p className="tl-card-desc">{event.description}</p>
                  
                  {event.photo && (
                    <div className="tl-card-photo">
                      <img src={event.photo} alt={event.title} />
                    </div>
                  )}
                  
                  <div className="tl-card-footer">
                    <button className="tl-card-speak-btn">
                      {isSelected ? <Volume2 size={14} className="pulse" /> : <Volume2 size={14} />}
                      {isSelected ? 'Reading...' : 'Read Aloud'}
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
      
      <ScrollReveal direction="up" delay={0.5}>
        <div className="tl-end-message">
          <CheckCircle size={24} className="tl-end-icon" />
          <h3>A beautiful journey</h3>
          <p>And your story continues today in {patient.location} 💛</p>
        </div>
      </ScrollReveal>
    </div>
  );
}
