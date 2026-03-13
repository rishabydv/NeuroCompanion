import {
  Sun, Footprints, Coffee, BookOpen, Pill,
  UtensilsCrossed, Moon, Flower2, Music, Clock
} from 'lucide-react';
import './RoutineCard.css';

const iconMap = {
  Sun, Footprints, Coffee, BookOpen, Pill,
  UtensilsCrossed, Moon, Flower2, Music, Clock
};

export default function RoutineCard({ routine, index, currentHour }) {
  const routineHour = parseInt(routine.time.split(':')[0]);
  const isPM = routine.time.includes('PM');
  const hour24 = isPM && routineHour !== 12 ? routineHour + 12 : routineHour;

  let status = 'upcoming';
  if (hour24 < currentHour) status = 'done';
  else if (hour24 === currentHour) status = 'current';

  const IconComponent = iconMap[routine.icon] || Clock;

  return (
    <div className={`routine-card routine-${status} animate-fade-in-up`} style={{ animationDelay: `${index * 0.06}s` }}>
      <div className={`routine-timeline-dot ${status}`}>
        {status === 'done' && <span>✓</span>}
        {status === 'current' && <span className="dot-pulse" />}
      </div>
      <div className="routine-time">{routine.time}</div>
      <div className={`routine-icon-wrap routine-icon-${routine.category}`}>
        <IconComponent size={22} />
      </div>
      <div className="routine-info">
        <span className="routine-activity">{routine.activity}</span>
        {status === 'current' && (
          <span className="routine-now-badge">Now</span>
        )}
      </div>
    </div>
  );
}
