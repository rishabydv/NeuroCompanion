import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Brain, Home, Users, Clock, BookHeart, Settings,
  Sun, Moon, Menu, X, Heart, 
  Pill, Music, Gamepad2, History, LogOut, Scan, Map, MessageCircle
} from 'lucide-react';
import './Navbar.css';

export default function Navbar({ mode, onModeToggle, onExit }) {
  const [time, setTime] = useState(new Date());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const timeStr = time.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
  });
  const dateStr = time.toLocaleDateString('en-IN', {
    weekday: 'long', month: 'short', day: 'numeric',
  });

  const patientLinks = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/family', icon: <Users size={20} />, label: 'Family' },
    { to: '/routine', icon: <Clock size={20} />, label: 'Routine' },
    { to: '/medication', icon: <Pill size={20} />, label: 'Medication' },
    { to: '/memories', icon: <BookHeart size={20} />, label: 'Memories' },
    { to: '/timeline', icon: <History size={20} />, label: 'Timeline' },
    { to: '/music', icon: <Music size={20} />, label: 'Music' },
    { to: '/games', icon: <Gamepad2 size={20} />, label: 'Games' },
    { to: '/face-recognition', icon: <Scan size={20} />, label: 'Face ID' },
    { to: '/memory-map', icon: <Map size={20} />, label: 'Map' },
    { to: '/daily-log', icon: <MessageCircle size={20} />, label: 'Daily Log' },
  ];

  const caregiverLinks = [
    { to: '/caregiver', icon: <Settings size={20} />, label: 'Dashboard' },
    { to: '/family', icon: <Users size={20} />, label: 'Family' },
    { to: '/routine', icon: <Clock size={20} />, label: 'Routines' },
    { to: '/medication', icon: <Pill size={20} />, label: 'Medication' },
    { to: '/memories', icon: <BookHeart size={20} />, label: 'Memories' },
    { to: '/timeline', icon: <History size={20} />, label: 'Timeline' },
    { to: '/music', icon: <Music size={20} />, label: 'Music Theme' },
    { to: '/games', icon: <Gamepad2 size={20} />, label: 'Games' },
  ];

  const links = mode === 'patient' || mode === 'preventive' ? patientLinks : caregiverLinks;

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand">
          <div className="brand-icon">
            <Brain size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-name">NeuroCompanion</span>
            <span className="brand-tagline">{mode === 'preventive' ? 'Cognitive Fitness System' : 'Memory Support System'}</span>
          </div>
        </div>

        <div className={`navbar-links ${mobileMenuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="navbar-right">
          <div className="nav-time">
            <span className="nav-time-clock">{timeStr}</span>
            <span className="nav-time-date">{dateStr}</span>
          </div>

          {mode !== 'preventive' && (
            <button
              className={`mode-toggle ${mode}`}
              onClick={onModeToggle}
              title={`Switch to ${mode === 'patient' ? 'Caregiver' : 'Patient'} mode`}
            >
              {mode === 'patient' ? <Heart size={16} /> : <Settings size={16} />}
              <span>{mode === 'patient' ? 'Patient' : 'Caregiver'}</span>
            </button>
          )}

          <button
            className="exit-btn mode-toggle"
            onClick={onExit}
            title="Exit to Mode Selection"
          >
            <LogOut size={16} />
            <span>Exit</span>
          </button>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
