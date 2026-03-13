import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Send, Sparkles, Loader } from 'lucide-react';
import { patient, familyMembers, medications, aiResponses } from '../data/patientData';
import './VoiceCompanion.css';

// Build a comprehensive system prompt from patient data
function buildSystemPrompt() {
  const familyInfo = familyMembers
    .map(m => `- ${m.name} (${m.relationship}): ${m.bio} Fun fact: ${m.funFact}`)
    .join('\n');

  const medInfo = medications
    .map(m => `- ${m.name} ${m.dosage} at ${m.time}: ${m.notes}`)
    .join('\n');

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return `You are a compassionate, warm AI companion for a dementia patient. Your role is to provide comfort, support, and help remember important things.

IMPORTANT RULES:
- Always be gentle, warm, and reassuring. Use simple, short sentences.
- Address the patient by their first name.
- If they seem confused or scared, prioritize calming them down.
- Never make them feel bad for forgetting things.
- Give specific, personal answers using the patient data below.
- Keep responses under 3 sentences unless more detail is asked for.
- You can use emojis sparingly (💛, 😊) to add warmth.

PATIENT PROFILE:
- Name: ${patient.name}
- Age: ${patient.age}
- Location: ${patient.location}
- Bio: ${patient.bio}
- Favorite things: ${patient.favoriteThings.join(', ')}

FAMILY MEMBERS:
${familyInfo}

MEDICATIONS:
${medInfo}

CURRENT TIME: ${timeStr}
TODAY'S DATE: ${dateStr}

Remember: You are talking DIRECTLY to ${patient.name}. Be their trusted friend.`;
}

// Gemini API integration
const GEMINI_API_KEY = 'AIzaSyAYm7RHvGJTdCtQxfpFkXzuSKITB61JHPA';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

async function callGemini(messages) {
  const systemPrompt = buildSystemPrompt();

  const contents = messages.map(msg => ({
    role: msg.role === 'ai' ? 'model' : 'user',
    parts: [{ text: msg.text }],
  }));

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
          topP: 0.9,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || fallbackResponse(messages[messages.length - 1].text);
  } catch (error) {
    console.error('Gemini API error:', error);
    return fallbackResponse(messages[messages.length - 1].text);
  }
}

// Fallback to local responses if API fails
function fallbackResponse(question) {
  const q = question.toLowerCase().trim();

  for (const member of familyMembers) {
    const firstName = member.name.split(' ')[0].toLowerCase();
    if (q.includes(firstName) || q.includes(member.relationship.toLowerCase())) {
      return `${member.name} is your ${member.relationship}. ${member.bio}`;
    }
  }

  for (const [key, fn] of Object.entries(aiResponses)) {
    if (key !== 'default' && q.includes(key)) {
      return fn(patient);
    }
  }

  return aiResponses.default(patient);
}

export default function VoiceCompanion() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      text: `Hello ${patient.name}! I'm your AI companion, powered by Gemini. I know all about your family, your life, and your routines. Ask me anything! 💛`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakResponse = (text) => {
    const clean = text.replace(/💛|😊|🌸|🤖|✨/g, '');
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = 0.82;
    utterance.pitch = 1.05;
    utterance.lang = 'en-IN';
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleSend = async (text) => {
    const userText = text || input.trim();
    if (!userText || isThinking) return;

    const userMsg = { role: 'user', text: userText };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsThinking(true);

    try {
      // Only send the last 10 messages for context window
      const contextMessages = updatedMessages
        .filter(m => m.role !== 'system')
        .slice(-10);

      const response = await callGemini(contextMessages);
      const aiMsg = { role: 'ai', text: response };
      setMessages(prev => [...prev, aiMsg]);
      speakResponse(response);
    } catch (error) {
      const aiMsg = { role: 'ai', text: fallbackResponse(userText) };
      setMessages(prev => [...prev, aiMsg]);
      speakResponse(aiMsg.text);
    } finally {
      setIsThinking(false);
    }
  };

  const startListening = async () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages((prev) => [...prev, { role: 'ai', text: "Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge, and type your question instead." }]);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch (permErr) {
      console.error('Microphone permission error:', permErr);
      if (permErr.name === 'NotAllowedError' || permErr.name === 'PermissionDeniedError') {
        setMessages((prev) => [...prev, { role: 'ai', text: "🎤 Microphone access was denied. Please allow microphone permission in your browser settings and try again." }]);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', text: "🎤 Could not access the microphone. Please type your question below." }]);
      }
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      handleSend(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'no-speech') {
        setMessages((prev) => [...prev, { role: 'ai', text: "🎤 I didn't hear anything. Please try speaking again." }]);
      }
    };

    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (startErr) {
      console.error('Failed to start speech recognition:', startErr);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const quickQuestions = [
    "Who am I?",
    "Where am I?",
    "What time is it?",
    "Who is my wife?",
    "Tell me about my family",
    "What are my medications?",
  ];

  return (
    <div className="voice-companion">
      <div className="vc-header">
        <div className="vc-header-icon">
          <Sparkles size={22} />
        </div>
        <div>
          <h3 className="vc-title">
            AI Companion
            <span className="vc-badge">Gemini AI</span>
          </h3>
          <p className="vc-subtitle">
            {isThinking ? '🧠 Thinking...' : isSpeaking ? '🔊 Speaking...' : isListening ? '🎙️ Listening...' : 'Ask me anything — I know your whole story'}
          </p>
        </div>
      </div>

      <div className="vc-messages">
        {messages.map((msg, i) => (
          <div key={i} className={`vc-message vc-${msg.role}`}>
            {msg.role === 'ai' && <div className="vc-avatar">✨</div>}
            <div className={`vc-bubble vc-bubble-${msg.role}`}>
              {msg.text}
            </div>
            {msg.role === 'ai' && (
              <button
                className="vc-speak-btn"
                onClick={() => speakResponse(msg.text)}
                title="Listen to this"
              >
                <Volume2 size={14} />
              </button>
            )}
          </div>
        ))}
        {isThinking && (
          <div className="vc-message vc-ai">
            <div className="vc-avatar">✨</div>
            <div className="vc-bubble vc-bubble-ai vc-thinking">
              <Loader size={16} className="vc-spinner" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="vc-quick-questions">
        {quickQuestions.map((q) => (
          <button
            key={q}
            className="vc-quick-btn"
            onClick={() => handleSend(q)}
            disabled={isThinking}
          >
            {q}
          </button>
        ))}
      </div>

      <div className="vc-input-area">
        <button
          className={`vc-mic-btn ${isListening ? 'listening' : ''}`}
          onClick={isListening ? stopListening : startListening}
          title={isListening ? 'Stop listening' : 'Start voice input'}
          disabled={isThinking}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isThinking ? 'Thinking...' : 'Type your question...'}
          className="vc-input"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={isThinking}
        />
        <button
          className="vc-send-btn"
          onClick={() => handleSend()}
          disabled={!input.trim() || isThinking}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
