import { useState, useEffect } from 'react';
import { Pill, CheckCircle, Clock, Calendar, AlertCircle } from 'lucide-react';
import { medications } from '../data/patientData';
import ScrollReveal from '../components/ScrollReveal';
import './MedicationPage.css';

export default function MedicationPage() {
  const [takenMeds, setTakenMeds] = useState({});
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    // Load today's taken medications
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem('medicationLog') || '{}');
    if (stored.date === today && stored.taken) {
      setTakenMeds(stored.taken);
    } else {
      // New day, reset log
      localStorage.setItem('medicationLog', JSON.stringify({ date: today, taken: {} }));
    }

    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleMed = (medId) => {
    const today = new Date().toDateString();
    const newTaken = { ...takenMeds, [medId]: !takenMeds[medId] };
    setTakenMeds(newTaken);
    localStorage.setItem('medicationLog', JSON.stringify({ date: today, taken: newTaken }));

    if (newTaken[medId]) {
      const med = medications.find((m) => m.id === medId);
      const utterance = new SpeechSynthesisUtterance(`Marked ${med.name} as taken. Good job.`);
      utterance.rate = 0.85;
      utterance.lang = 'en-IN';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  const categories = [
    { id: 'morning', label: 'Morning', timeRange: [5, 11] },
    { id: 'afternoon', label: 'Afternoon', timeRange: [12, 16] },
    { id: 'evening', label: 'Evening', timeRange: [17, 20] },
    { id: 'night', label: 'Night', timeRange: [21, 28] }, // 28 handles 4 AM next day
  ];

  return (
    <div className="medication-page">
      <ScrollReveal direction="up" duration={0.7}>
        <header className="page-header">
          <div className="page-header-left">
            <div className="page-icon-wrap med-icon">
              <Pill size={24} />
            </div>
            <div>
              <h1 className="page-title">Medication Tracker</h1>
              <p className="page-subtitle">
                <Calendar size={14} />
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </header>
      </ScrollReveal>

      <div className="med-timeline">
        {categories.map((cat, catIdx) => {
          const catMeds = medications.filter((m) => m.category === cat.id);
          if (catMeds.length === 0) return null;

          const isCurrentTime = currentHour >= cat.timeRange[0] && currentHour <= cat.timeRange[1];
          const isPast = currentHour > cat.timeRange[1];

          return (
            <ScrollReveal key={cat.id} direction="up" delay={catIdx * 0.1}>
              <div className={`med-section ${isCurrentTime ? 'active' : ''} ${isPast ? 'past' : ''}`}>
                <div className="med-section-header">
                  <div className="med-section-time">
                    <Clock size={16} />
                    {cat.label}
                  </div>
                  {isCurrentTime && <span className="med-now-badge">Now</span>}
                </div>

                <div className="med-grid">
                  {catMeds.map((med) => {
                    const isTaken = !!takenMeds[med.id];
                    const isMissed = isPast && !isTaken;

                    return (
                      <button
                        key={med.id}
                        className={`med-card ${isTaken ? 'taken' : ''} ${isMissed ? 'missed' : ''}`}
                        onClick={() => toggleMed(med.id)}
                      >
                        <div className="med-card-icon">{med.icon}</div>
                        <div className="med-card-info">
                          <h4 className="med-name">{med.name}</h4>
                          <span className="med-dosage">{med.dosage}</span>
                          <span className="med-time">{med.time}</span>
                          <p className="med-notes">{med.notes}</p>
                        </div>
                        <div className="med-status">
                          {isTaken ? (
                            <CheckCircle className="status-taken-icon" size={24} />
                          ) : isMissed ? (
                            <AlertCircle className="status-missed-icon" size={24} />
                          ) : (
                            <div className="status-empty-circle" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
