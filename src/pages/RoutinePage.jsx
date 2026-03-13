import { useState, useEffect } from 'react';
import { Clock, Sun, Cloud, Moon, Sunrise } from 'lucide-react';
import { routines } from '../data/patientData';
import RoutineCard from '../components/RoutineCard';
import ScrollReveal from '../components/ScrollReveal';
import './RoutinePage.css';

export default function RoutinePage() {
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { key: 'morning', label: 'Morning', icon: <Sunrise size={20} />, color: 'peach' },
    { key: 'afternoon', label: 'Afternoon', icon: <Sun size={20} />, color: 'sky' },
    { key: 'evening', label: 'Evening', icon: <Cloud size={20} />, color: 'lavender' },
    { key: 'night', label: 'Night', icon: <Moon size={20} />, color: 'muted' },
  ];

  return (
    <div className="routine-page">
      <ScrollReveal direction="up" duration={0.7}>
        <header className="page-header">
          <div className="page-header-left">
            <div className="page-icon-wrap routine-icon">
              <Clock size={24} />
            </div>
            <div>
              <h1 className="page-title">Today's Routine</h1>
              <p className="page-subtitle">Your daily schedule to guide your day</p>
            </div>
          </div>
        </header>
      </ScrollReveal>

      <div className="routine-categories">
        {categories.map((cat, catIdx) => {
          const items = routines.filter((r) => r.category === cat.key);
          if (items.length === 0) return null;
          return (
            <ScrollReveal key={cat.key} direction="up" delay={catIdx * 0.12}>
              <div className="routine-category">
                <div className={`routine-category-header category-${cat.color}`}>
                  {cat.icon}
                  <span>{cat.label}</span>
                </div>
                <div className="routine-list">
                  {items.map((routine, i) => (
                    <ScrollReveal key={routine.id} direction="left" delay={i * 0.06} distance={20}>
                      <RoutineCard
                        routine={routine}
                        index={i}
                        currentHour={currentHour}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
