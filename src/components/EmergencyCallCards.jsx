import { Phone, Video, MessageCircle } from 'lucide-react';
import './EmergencyCallCards.css';

export default function EmergencyCallCards({ member }) {
  const handleCall = () => {
    const text = `Calling ${member.name}, your ${member.relationship}...`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="emergency-call-row">
      <button className="ec-btn ec-call" onClick={handleCall} title={`Call ${member.name}`}>
        <Phone size={16} />
        <span>Call</span>
      </button>
      <button className="ec-btn ec-video" onClick={handleCall} title={`Video call ${member.name}`}>
        <Video size={16} />
        <span>Video</span>
      </button>
      <button className="ec-btn ec-message" title={`Message ${member.name}`}>
        <MessageCircle size={16} />
        <span>Message</span>
      </button>
    </div>
  );
}
