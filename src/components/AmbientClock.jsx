import { useState, useEffect } from 'react';
import { Sun, Moon, Coffee, Utensils } from 'lucide-react';
import './AmbientClock.css';

export default function AmbientClock({ userName = "Arthur" }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getContextualInfo = () => {
    const hour = time.getHours();
    
    if (hour >= 5 && hour < 12) {
      return {
        greeting: `Good morning, ${userName}.`,
        context: "It's time to start the day. Breakfast is soon.",
        icon: <Coffee size={48} className="period-icon morning" />
      };
    } else if (hour >= 12 && hour < 17) {
      return {
        greeting: `Good afternoon, ${userName}.`,
        context: "It is the middle of the day. A good time to relax.",
        icon: <Sun size={48} className="period-icon afternoon" />
      };
    } else if (hour >= 17 && hour < 20) {
      return {
        greeting: `Good evening, ${userName}.`,
        context: "The sun is setting. Dinner is coming up.",
        icon: <Utensils size={48} className="period-icon evening" />
      };
    } else {
      return {
        greeting: `Good night, ${userName}.`,
        context: "It is late. You are safe at home and it is time to sleep.",
        icon: <Moon size={48} className="period-icon night" />
      };
    }
  };

  const { greeting, context, icon } = getContextualInfo();
  
  const timeStr = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="ambient-clock-card">
      <div className="ac-top-row">
        {icon}
        <div className="ac-time-block">
          <h1 className="ac-time">{timeStr}</h1>
          <p className="ac-date">{dateStr}</p>
        </div>
      </div>
      <div className="ac-context-block">
        <h2 className="ac-greeting">{greeting}</h2>
        <p className="ac-context-text">{context}</p>
      </div>
    </div>
  );
}
