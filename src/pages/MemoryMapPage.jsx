import { useState } from 'react';
import { MapPin, Calendar, ChevronRight, Sparkles, Volume2 } from 'lucide-react';
import { timelineEvents, patient } from '../data/patientData';
import ScrollReveal from '../components/ScrollReveal';
import './MemoryMapPage.css';

const LOCATIONS = [
  { name: 'Jaipur, Rajasthan', lat: 26.9124, lng: 75.7873, color: '#facc15', events: [] },
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090, color: '#38bdf8', events: [] },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, color: '#f472b6', events: [] },
  { name: 'Shimla', lat: 31.1048, lng: 77.1734, color: '#34d399', events: [] },
];

// Map events to locations based on descriptions
const mapEventsToLocations = () => {
  const mapped = LOCATIONS.map(loc => ({ ...loc, events: [] }));
  timelineEvents.forEach(event => {
    const desc = (event.description + event.title).toLowerCase();
    if (desc.includes('jaipur') || desc.includes('rajasthan') || desc.includes('born')) {
      mapped[0].events.push(event);
    } else if (desc.includes('delhi') || desc.includes('university') || desc.includes('retired') || desc.includes('garden') || desc.includes('school') || desc.includes('professor') || desc.includes('published') || desc.includes('grandson')) {
      mapped[1].events.push(event);
    } else if (desc.includes('mumbai')) {
      mapped[2].events.push(event);
    } else if (desc.includes('shimla')) {
      mapped[3].events.push(event);
    } else {
      mapped[1].events.push(event); // Default to Delhi
    }
  });
  return mapped.filter(loc => loc.events.length > 0);
};

export default function MemoryMapPage() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const locations = mapEventsToLocations();

  const speakEvent = (event) => {
    const text = `In ${event.year}, ${event.title}. ${event.description}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="memory-map-page">
      <ScrollReveal direction="up" duration={0.6}>
        <header className="mm-header">
          <div className="mm-header-icon">
            <MapPin size={32} />
          </div>
          <div>
            <h1>Memory Map</h1>
            <p>Your life's journey across places and time</p>
          </div>
        </header>
      </ScrollReveal>

      {/* Visual Map */}
      <div className="mm-map-container">
        <div className="mm-india-map">
          {/* SVG outline of India - simplified */}
          <svg viewBox="0 0 500 550" className="mm-map-svg" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M 200 30 Q 250 20 300 35 L 340 50 Q 370 60 380 90 L 400 120 Q 420 150 410 180 L 430 210 Q 440 240 420 270 L 400 300 Q 380 330 350 350 L 320 380 Q 310 410 280 440 L 260 470 Q 250 490 230 500 L 210 490 Q 190 470 180 440 L 160 400 Q 140 370 120 340 L 100 310 Q 80 280 90 250 L 100 220 Q 110 190 130 170 L 150 140 Q 160 110 170 80 L 190 50 Z"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="2"
            />
            {/* Location Pins */}
            {locations.map((loc, i) => {
              // Map real lat/lng to SVG coordinates (simplified)
              const x = ((loc.lng - 68) / (82 - 68)) * 400 + 50;
              const y = ((35 - loc.lat) / (35 - 8)) * 450 + 30;
              return (
                <g key={loc.name}>
                  <circle
                    cx={x} cy={y} r={selectedLocation === i ? 18 : 12}
                    fill={loc.color}
                    opacity={selectedLocation === i ? 0.9 : 0.6}
                    className="mm-pin-circle"
                    onClick={() => { setSelectedLocation(i); setSelectedEvent(null); }}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                  />
                  <circle
                    cx={x} cy={y} r={selectedLocation === i ? 28 : 20}
                    fill="none"
                    stroke={loc.color}
                    strokeWidth="1"
                    opacity="0.3"
                    className="mm-pin-pulse"
                  />
                  <text
                    x={x} y={y + 35}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.8)"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {loc.name.split(',')[0]}
                  </text>
                  <text
                    x={x} y={y + 47}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.4)"
                    fontSize="9"
                  >
                    {loc.events.length} {loc.events.length === 1 ? 'memory' : 'memories'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Location Chips */}
        <div className="mm-location-chips">
          {locations.map((loc, i) => (
            <button
              key={loc.name}
              className={`mm-chip ${selectedLocation === i ? 'active' : ''}`}
              style={{ '--chip-color': loc.color }}
              onClick={() => { setSelectedLocation(i); setSelectedEvent(null); }}
            >
              <MapPin size={14} />
              {loc.name}
              <span className="mm-chip-count">{loc.events.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Events Panel */}
      {selectedLocation !== null && (
        <ScrollReveal direction="up" duration={0.5}>
          <div className="mm-events-panel">
            <h2 style={{ color: locations[selectedLocation].color }}>
              <MapPin size={20} />
              {locations[selectedLocation].name}
            </h2>
            <div className="mm-events-list">
              {locations[selectedLocation].events
                .sort((a, b) => a.year - b.year)
                .map(event => (
                  <div
                    key={event.id}
                    className={`mm-event-card ${selectedEvent === event.id ? 'expanded' : ''}`}
                    onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                  >
                    <div className="mm-event-top">
                      <span className="mm-event-emoji">{event.emoji}</span>
                      <div className="mm-event-meta">
                        <h3>{event.title}</h3>
                        <span className="mm-event-year">
                          <Calendar size={12} />
                          {event.year}
                        </span>
                      </div>
                      <ChevronRight
                        size={18}
                        className={`mm-event-arrow ${selectedEvent === event.id ? 'rotated' : ''}`}
                      />
                    </div>
                    {selectedEvent === event.id && (
                      <div className="mm-event-detail animate-fade-in">
                        <p>{event.description}</p>
                        <button className="mm-speak-btn" onClick={(e) => { e.stopPropagation(); speakEvent(event); }}>
                          <Volume2 size={16} /> Hear this memory
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
