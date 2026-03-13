import { Lightbulb, HeartPulse, ShieldCheck } from 'lucide-react';
import './LandingSelection.css';

export default function LandingSelection({ onSelectMode }) {
  return (
    <div className="landing-selection-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to NeuroCompanion</h1>
        <p className="landing-subtitle">Please select your journey to begin.</p>
        
        <div className="options-grid">
          <button 
            className="mode-card preventive-card"
            onClick={() => onSelectMode('preventive')}
          >
            <div className="icon-wrapper">
              <Lightbulb size={48} />
            </div>
            <h2>I want to: Improve my memory</h2>
            <p>Active brain training, cognitive games, and daily analytics for mental fitness.</p>
          </button>

          <button 
            className="mode-card companion-card"
            onClick={() => onSelectMode('patient')}
          >
            <div className="icon-wrapper">
              <HeartPulse size={48} />
            </div>
            <h2>I am: Managing Dementia</h2>
            <p>A soothing sanctuary for cognitive support, emotional grounding, and caregiver tools.</p>
          </button>

          <button 
            className="mode-card caregiver-card"
            onClick={() => onSelectMode('caregiver')}
          >
            <div className="icon-wrapper">
              <ShieldCheck size={48} />
            </div>
            <h2>I am a: Caregiver</h2>
            <p>Monitor patient health, view analytics, track medications, and manage wandering alerts.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
