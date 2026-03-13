import { useState, useEffect } from 'react';
import { MessageCircle, Plus, Clock, User, Trash2, Search } from 'lucide-react';
import { familyMembers, patient } from '../data/patientData';
import ScrollReveal from '../components/ScrollReveal';
import './ConversationMemory.css';

const EVENT_TYPES = [
  { id: 'visit', label: 'Visit', emoji: '🚪', color: '#34d399' },
  { id: 'call', label: 'Phone Call', emoji: '📞', color: '#38bdf8' },
  { id: 'meal', label: 'Meal Together', emoji: '🍽️', color: '#facc15' },
  { id: 'activity', label: 'Activity', emoji: '🎯', color: '#818cf8' },
  { id: 'other', label: 'Other', emoji: '💬', color: '#f472b6' },
];

export default function ConversationMemory() {
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ person: '', type: 'visit', note: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState(null);

  // Load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('conversationMemory') || '[]');
    setEvents(stored);
  }, []);

  // Save to localStorage
  const saveEvents = (updated) => {
    setEvents(updated);
    localStorage.setItem('conversationMemory', JSON.stringify(updated));
  };

  const addEvent = () => {
    if (!newEvent.person) return;
    const member = familyMembers.find(m => m.name === newEvent.person);
    const eventType = EVENT_TYPES.find(t => t.id === newEvent.type);
    const entry = {
      id: Date.now(),
      person: newEvent.person,
      relationship: member?.relationship || '',
      photo: member?.photo || null,
      type: newEvent.type,
      typeLabel: eventType?.label,
      emoji: eventType?.emoji,
      note: newEvent.note,
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' }),
      timeStr: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    const updated = [entry, ...events];
    saveEvents(updated);
    setNewEvent({ person: '', type: 'visit', note: '' });
    setShowAddForm(false);

    // Voice confirm
    const utterance = new SpeechSynthesisUtterance(
      `Noted! ${entry.person}'s ${entry.typeLabel.toLowerCase()} has been logged.`
    );
    utterance.rate = 0.85;
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  const deleteEvent = (id) => {
    saveEvents(events.filter(e => e.id !== id));
  };

  // Gemini API setup
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAYm7RHvGJTdCtQxfpFkXzuSKITB61JHPA';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const callGemini = async (query, eventsList) => {
    const todayStr = new Date().toDateString();
    const systemPrompt = `You are a helpful memory assistant for a dementia patient named ${patient.name}. Today is ${todayStr}.
    You have access to their daily event log. Answer their question based ONLY on this log.
    If the log doesn't contain the answer, gently say you don't know but reassure them.
    Keep answers very short, warm, and conversational (1-2 sentences).
    
    EVENT LOG:
    ${eventsList.length === 0 ? 'No events logged yet.' : JSON.stringify(eventsList.map(e => ({
      who: e.person,
      what: e.typeLabel,
      when: e.dateStr + ' ' + e.timeStr,
      note: e.note
    })))}
    `;

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: query }] }],
          generationConfig: { temperature: 0.3, maxOutputTokens: 150 }
        }),
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) { setAiAnswer(null); return; }

    setAiAnswer('🧠 Thinking...');

    const aiRes = await callGemini(query, events);
    
    if (aiRes) {
      setAiAnswer(aiRes);
      speakAnswer(aiRes);
    } else {
      // Fallback 
      setAiAnswer("I'm having trouble thinking right now. But you are safe, and your family loves you.");
    }
  };

  const speakAnswer = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = 'en-IN';
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const todayEvents = events.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString());

  return (
    <div className="conversation-memory">
      <ScrollReveal direction="up" duration={0.6}>
        <header className="cm-header">
          <div className="cm-header-icon">
            <MessageCircle size={32} />
          </div>
          <div>
            <h1>Daily Companion Log</h1>
            <p>"Did my daughter visit today?" — we remember, so you don't have to.</p>
          </div>
        </header>
      </ScrollReveal>

      {/* AI Search */}
      <div className="cm-search">
        <Search size={20} />
        <input
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          placeholder='Ask me — "Did anyone visit today?" or type a name...'
          className="cm-search-input"
        />
      </div>

      {/* AI Answer */}
      {aiAnswer && (
        <div className="cm-ai-answer animate-scale-in">
          <span className="cm-ai-avatar">🧠</span>
          <p>{aiAnswer}</p>
        </div>
      )}

      {/* Quick Add */}
      <button className="cm-add-btn" onClick={() => setShowAddForm(!showAddForm)}>
        <Plus size={20} />
        Log a new event
      </button>

      {showAddForm && (
        <div className="cm-add-form animate-fade-in">
          <div className="cm-form-row">
            <label>Who?</label>
            <div className="cm-person-chips">
              {familyMembers.map(m => (
                <button
                  key={m.id}
                  className={`cm-person-chip ${newEvent.person === m.name ? 'selected' : ''}`}
                  onClick={() => setNewEvent({ ...newEvent, person: m.name })}
                >
                  <img src={m.photo} alt={m.name} />
                  {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
          <div className="cm-form-row">
            <label>What happened?</label>
            <div className="cm-type-chips">
              {EVENT_TYPES.map(t => (
                <button
                  key={t.id}
                  className={`cm-type-chip ${newEvent.type === t.id ? 'selected' : ''}`}
                  style={{ '--type-color': t.color }}
                  onClick={() => setNewEvent({ ...newEvent, type: t.id })}
                >
                  <span>{t.emoji}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="cm-form-row">
            <label>Add a note (optional)</label>
            <input
              className="cm-note-input"
              value={newEvent.note}
              onChange={e => setNewEvent({ ...newEvent, note: e.target.value })}
              placeholder="e.g., Had tea together, brought your favorite sweets..."
            />
          </div>
          <button className="cm-submit-btn" onClick={addEvent} disabled={!newEvent.person}>
            Log Event ✓
          </button>
        </div>
      )}

      {/* Today's Log */}
      <div className="cm-section">
        <h2><Clock size={18} /> Today ({todayEvents.length} events)</h2>
        {todayEvents.length === 0 ? (
          <p className="cm-empty">No events logged today yet.</p>
        ) : (
          <div className="cm-event-list">
            {todayEvents.map(ev => (
              <div key={ev.id} className="cm-event">
                {ev.photo ? <img src={ev.photo} alt={ev.person} className="cm-ev-photo" /> :
                  <div className="cm-ev-emoji">{ev.emoji}</div>}
                <div className="cm-ev-info">
                  <strong>{ev.person}</strong> — {ev.typeLabel}
                  {ev.note && <p className="cm-ev-note">"{ev.note}"</p>}
                  <span className="cm-ev-time">{ev.timeStr}</span>
                </div>
                <button className="cm-del-btn" onClick={() => deleteEvent(ev.id)} title="Remove">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Log */}
      {events.filter(e => new Date(e.timestamp).toDateString() !== new Date().toDateString()).length > 0 && (
        <div className="cm-section">
          <h2>📅 Earlier</h2>
          <div className="cm-event-list">
            {events
              .filter(e => new Date(e.timestamp).toDateString() !== new Date().toDateString())
              .slice(0, 10)
              .map(ev => (
                <div key={ev.id} className="cm-event cm-past">
                  {ev.photo ? <img src={ev.photo} alt={ev.person} className="cm-ev-photo" /> :
                    <div className="cm-ev-emoji">{ev.emoji}</div>}
                  <div className="cm-ev-info">
                    <strong>{ev.person}</strong> — {ev.typeLabel}
                    {ev.note && <p className="cm-ev-note">"{ev.note}"</p>}
                    <span className="cm-ev-time">{ev.dateStr} • {ev.timeStr}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
