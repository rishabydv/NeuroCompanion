import { useState } from 'react';
import { Music, Play, Pause, Volume2, Headphones, Wind } from 'lucide-react';
import { musicPlaylist, ambientSounds, patient } from '../data/patientData';
import ScrollReveal from '../components/ScrollReveal';
import './MusicTherapyPage.css';

const categories = [
  { key: 'all', label: 'All', emoji: '🎵' },
  { key: 'classical', label: 'Classical', emoji: '🎶' },
  { key: 'bollywood', label: 'Bollywood', emoji: '🎤' },
  { key: 'devotional', label: 'Devotional', emoji: '🙏' },
];

export default function MusicTherapyPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [playingId, setPlayingId] = useState(null);
  const [playingAmbient, setPlayingAmbient] = useState(null);
  const [activeUrl, setActiveUrl] = useState(null);

  const filtered = activeCategory === 'all'
    ? musicPlaylist
    : musicPlaylist.filter((s) => s.category === activeCategory);

  const handlePlay = (track) => {
    window.speechSynthesis.cancel();
    
    if (playingId === track.id) {
      setPlayingId(null);
      setActiveUrl(null);
      return;
    }

    setPlayingId(track.id);
    setPlayingAmbient(null);
    setActiveUrl(track.url);
  };

  const handleAmbient = (sound) => {
    window.speechSynthesis.cancel();

    if (playingAmbient === sound.id) {
      setPlayingAmbient(null);
      setActiveUrl(null);
      return;
    }

    setPlayingAmbient(sound.id);
    setPlayingId(null);
    setActiveUrl(sound.url);
  };

  const handleAudioEnded = () => {
    setPlayingId(null);
    setPlayingAmbient(null);
    setActiveUrl(null);
  };

  return (
    <div className="music-therapy">
      {/* Hidden Audio Player - Native HTML5 audio is allowed to autoplay on click */}
      {activeUrl && (
        <audio 
          autoPlay
          src={activeUrl}
          onEnded={handleAudioEnded}
          onError={(e) => {
            console.error("Audio file not found. Ensure you have placed the mp3 in the public/music folder.", e);
            handleAudioEnded();
          }}
        />
      )}

      <ScrollReveal direction="up" duration={0.7}>
        <header className="page-header">
          <div className="page-header-left">
            <div className="page-icon-wrap music-icon">
              <Music size={24} />
            </div>
            <div>
              <h1 className="page-title">Music Therapy</h1>
              <p className="page-subtitle">
                <Headphones size={14} />
                Soothing music to calm and inspire memories
              </p>
            </div>
          </div>
        </header>
      </ScrollReveal>

      {/* Category Filter */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="mt-categories">
          {categories.map((cat) => (
            <button
              key={cat.key}
              className={`mt-cat-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </ScrollReveal>

      {/* Music List */}
      <div className="mt-playlist">
        {filtered.map((track, i) => (
          <ScrollReveal key={track.id} direction="left" delay={i * 0.05} distance={20}>
            <div className={`mt-track ${playingId === track.id ? 'playing' : ''}`}>
              <button className="mt-play-btn" onClick={() => handlePlay(track)}>
                {playingId === track.id ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <div className="mt-track-info">
                <span className="mt-track-title">{track.emoji} {track.title}</span>
                <span className="mt-track-artist">{track.artist}</span>
              </div>
              <span className="mt-track-duration">{track.duration}</span>
              {playingId === track.id && (
                <div className="mt-equalizer">
                  <div className="eq-bar" />
                  <div className="eq-bar" />
                  <div className="eq-bar" />
                  <div className="eq-bar" />
                </div>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Ambient Sounds */}
      <ScrollReveal direction="up" delay={0.2}>
        <section className="mt-ambient-section">
          <h3 className="mt-section-title">
            <Wind size={18} />
            Ambient & Calming Sounds
          </h3>
          <div className="mt-ambient-grid">
            {ambientSounds.map((sound) => (
              <button
                key={sound.id}
                className={`mt-ambient-card ${playingAmbient === sound.id ? 'playing' : ''}`}
                onClick={() => handleAmbient(sound)}
              >
                <span className="mt-ambient-emoji">{sound.emoji}</span>
                <span className="mt-ambient-title">{sound.title}</span>
                <span className="mt-ambient-desc">{sound.description}</span>
                {playingAmbient === sound.id && (
                  <div className="mt-ambient-playing">
                    <Volume2 size={14} />
                    Playing...
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
}
