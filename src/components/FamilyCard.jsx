import { Volume2 } from 'lucide-react';
import './FamilyCard.css';

export default function FamilyCard({ member, onClick }) {
  const speak = (e) => {
    e.stopPropagation();
    const utterance = new SpeechSynthesisUtterance(
      `This is ${member.name}. ${member.relationship}. ${member.bio}`
    );
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="family-card animate-fade-in-up" onClick={onClick}>
      <div className="family-card-image-wrap">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="family-card-image"
          />
        ) : (
          <div className="family-card-image family-card-image-placeholder">
            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
          </div>
        )}
        <div className="family-card-relationship">{member.relationship}</div>
      </div>
      <div className="family-card-content">
        <h3 className="family-card-name">{member.name}</h3>
        <p className="family-card-bio">{member.bio}</p>
        {member.funFact && (
          <p className="family-card-funfact">💛 {member.funFact}</p>
        )}
        <button className="family-card-speak" onClick={speak}>
          <Volume2 size={18} />
          <span>Hear about {member.name.split(' ')[0]}</span>
        </button>
      </div>
    </div>
  );
}
