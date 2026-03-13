import { Users, Heart, Volume2 } from 'lucide-react';
import { familyMembers, patient } from '../data/patientData';
import FamilyCard from '../components/FamilyCard';
import InteractiveCard from '../components/InteractiveCard';
import EmergencyCallCards from '../components/EmergencyCallCards';
import ScrollReveal from '../components/ScrollReveal';
import './FamilyPage.css';

export default function FamilyPage() {
  const speakAll = () => {
    let text = `${patient.name}, here is your family. `;
    familyMembers.forEach((m) => {
      text += `${m.name} is your ${m.relationship}. ${m.bio} `;
    });
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="family-page">
      <ScrollReveal direction="up" duration={0.7}>
        <header className="page-header">
          <div className="page-header-left">
            <div className="page-icon-wrap family-icon">
              <Users size={24} />
            </div>
            <div>
              <h1 className="page-title">Your Family</h1>
              <p className="page-subtitle">
                <Heart size={14} className="heart-pulse" />
                The people who love you most
              </p>
            </div>
          </div>
          <button className="page-action-btn" onClick={speakAll}>
            <Volume2 size={18} />
            Hear about everyone
          </button>
        </header>
      </ScrollReveal>

      <div className="family-grid">
        {familyMembers.map((member, i) => (
          <ScrollReveal key={member.id} direction="up" delay={i * 0.1}>
            <InteractiveCard glowColor="rgba(245, 197, 163, 0.15)">
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <FamilyCard member={member} />
                <EmergencyCallCards member={member} />
              </div>
            </InteractiveCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
