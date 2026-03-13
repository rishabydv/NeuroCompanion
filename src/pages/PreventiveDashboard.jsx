import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Flame, Target, Trophy, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ScrollReveal from '../components/ScrollReveal';
import InteractiveCard from '../components/InteractiveCard';
import './PreventiveDashboard.css';

const mockCognitiveData = [
  { day: 'Mon', score: 65 },
  { day: 'Tue', score: 68 },
  { day: 'Wed', score: 66 },
  { day: 'Thu', score: 72 },
  { day: 'Fri', score: 75 },
  { day: 'Sat', score: 80 },
  { day: 'Sun', score: 85 },
];

export default function PreventiveDashboard() {
  const navigate = useNavigate();
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Animate streak number on load
    const timer = setTimeout(() => setStreak(14), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="preventive-dashboard">
      <header className="pd-header">
        <ScrollReveal direction="down" duration={0.6}>
          <div className="pd-header-content">
            <div className="pd-greeting">
              <h1>Welcome back to your <span className="highlight">Cognitive Gym</span>.</h1>
              <p>Ready to build some neuroplasticity today?</p>
            </div>
            <div className="pd-streak-badge">
              <Flame size={32} className="streak-icon" />
              <div className="streak-info">
                <span className="streak-number">{streak}</span>
                <span className="streak-label">Day Streak</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </header>

      <section className="pd-main-grid">
        <div className="pd-column-left">
          <ScrollReveal direction="up" delay={0.1}>
            <InteractiveCard className="pd-chart-card" glowColor="rgba(14, 165, 233, 0.2)">
              <div className="pd-card-header">
                <Target size={24} className="text-blue-400" />
                <h2>Cognitive Score Trend</h2>
              </div>
              <p className="pd-card-subtitle">Your memory recall speed has improved by 12% this week.</p>
              
              <div className="pd-chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockCognitiveData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      itemStyle={{ color: '#38bdf8' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#38bdf8" 
                      strokeWidth={4}
                      dot={{ r: 6, fill: '#0f172a', stroke: '#38bdf8', strokeWidth: 2 }}
                      activeDot={{ r: 8, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </InteractiveCard>
          </ScrollReveal>
        </div>

        <div className="pd-column-right">
          <ScrollReveal direction="up" delay={0.2}>
            <InteractiveCard className="pd-action-card" glowColor="rgba(56, 189, 248, 0.3)">
              <div className="pd-daily-workout">
                <div className="workout-header">
                  <Brain size={32} className="text-blue-400" />
                  <span className="workout-badge">Daily Goal Incomplete</span>
                </div>
                <h3>Today's Brain Workout</h3>
                <p>3 short games aimed at spatial memory and pattern recognition.</p>
                <div className="workout-progress">
                  <div className="progress-bar"><div className="progress-fill" style={{width: '0%'}}></div></div>
                  <span className="progress-text">0/3 Games Complete</span>
                </div>
                <button className="workout-btn" onClick={() => navigate('/games')}>
                  Start Workout <ChevronRight size={20} />
                </button>
              </div>
            </InteractiveCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <div className="pd-achievements">
              <h3>Recent Achievements</h3>
              <div className="achievement-list">
                <div className="achievement-item">
                  <div className="ach-icon-wrap gold"><Trophy size={20} /></div>
                  <div className="ach-text">
                    <strong>Memory Master</strong>
                    <span>Perfect score in Recall Matrix</span>
                  </div>
                </div>
                <div className="achievement-item">
                  <div className="ach-icon-wrap silver"><Flame size={20} /></div>
                  <div className="ach-text">
                    <strong>Consistent Learner</strong>
                    <span>7 days active streak</span>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
