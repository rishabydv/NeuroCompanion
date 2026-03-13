import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Clock, BookHeart, MessageCircle, MapPin,
  Heart, Sun, Cloud, Sparkles
} from 'lucide-react';
import { patient } from '../data/patientData';
import VoiceCompanion from '../components/VoiceCompanion';
import SplineScene from '../components/SplineScene';
import InteractiveCard from '../components/InteractiveCard';
import ScrollReveal from '../components/ScrollReveal';

// New Components
import MoodCheckIn from '../components/MoodCheckIn';
import PhotoOfTheDay from '../components/PhotoOfTheDay';
import WhereAmIMap from '../components/WhereAmIMap';
import AmbientClock from '../components/AmbientClock';

import './PatientHome.css';

const SPLINE_SCENE_URL = 'https://my.spline.design/claritystream-4vR4muSsQA0M1MY0wmvUB6hB/';

export default function PatientHome() {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const speakGreeting = () => {
    const text = `Hello ${patient.name}. You are at home in ${patient.location}. You are safe and loved.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const quickActions = [
    { icon: <Users size={28} />, label: 'My Family', desc: 'See your loved ones', to: '/family', color: 'peach', glow: 'rgba(245, 197, 163, 0.2)' },
    { icon: <Clock size={28} />, label: 'My Routine', desc: "Today's schedule", to: '/routine', color: 'sky', glow: 'rgba(163, 212, 245, 0.2)' },
    { icon: <BookHeart size={28} />, label: 'Memories', desc: 'Your life stories', to: '/memories', color: 'mint', glow: 'rgba(168, 230, 207, 0.2)' },
  ];

  return (
    <div className="patient-home">
      <section className="hero-section">
        {/* Parallax background shapes */}
        <div className="hero-bg-shapes">
          <div
            className="hero-shape shape-1"
            style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
          />
          <div
            className="hero-shape shape-2"
            style={{ transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)` }}
          />
          <div
            className="hero-shape shape-3"
            style={{ transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)` }}
          />
          <div
            className="hero-shape shape-4"
            style={{ transform: `translate(${mousePos.x * -0.6}px, ${mousePos.y * -0.6}px)` }}
          />
        </div>

        <div className="hero-content">
          <ScrollReveal direction="left" duration={0.8} style={{ width: '100%' }}>
            <div className="hero-left" style={{ maxWidth: '100%' }}>
              <AmbientClock userName={patient.name} />
              <p className="hero-reassurance">
                <Heart size={16} className="heart-icon" />
                You are safe and your family loves you very much 💛
              </p>
              <button className="hero-speak-btn" onClick={speakGreeting}>
                <Sparkles size={18} />
                Hear reassurance
              </button>
            </div>
          </ScrollReveal>

          <div className="hero-right">
            <div className="hero-spline-container">
              <SplineScene
                sceneUrl={SPLINE_SCENE_URL}
                className="hero-spline"
              />
              <div className="hero-spline-glow" />
            </div>
            <div className="hero-avatar-floating">
              <img src={patient.photo} alt={patient.name} className="hero-avatar-mini" />
            </div>
          </div>
        </div>
      </section>

      {/* New Interactive Widgets Section */}
      <section className="ph-widgets-section">
        <ScrollReveal direction="up" delay={0.1}>
          <WhereAmIMap />
        </ScrollReveal>
        
        <div className="ph-widgets-row">
          <ScrollReveal direction="up" delay={0.2} style={{ flex: 1 }}>
            <PhotoOfTheDay />
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.3} style={{ flex: 1 }}>
            <MoodCheckIn />
          </ScrollReveal>
        </div>
      </section>

      <section className="quick-actions">
        {quickActions.map((action, i) => (
          <ScrollReveal key={action.label} direction="up" delay={i * 0.1} duration={0.6}>
            <InteractiveCard
              className={`quick-action-card action-${action.color}`}
              glowColor={action.glow}
            >
              <button
                className="qa-inner"
                onClick={() => navigate(action.to)}
              >
                <div className="qa-icon">{action.icon}</div>
                <div className="qa-text">
                  <span className="qa-label">{action.label}</span>
                  <span className="qa-desc">{action.desc}</span>
                </div>
              </button>
            </InteractiveCard>
          </ScrollReveal>
        ))}
      </section>

      <ScrollReveal direction="up" delay={0.2} duration={0.7}>
        <section className="companion-section">
          <VoiceCompanion />
        </section>
      </ScrollReveal>
    </div>
  );
}
