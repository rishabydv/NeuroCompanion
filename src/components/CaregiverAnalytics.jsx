import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import InteractiveCard from './InteractiveCard';
import './CaregiverAnalytics.css';

const moodData = [
  { day: 'Mon', mood: 4, label: 'Happy' },
  { day: 'Tue', mood: 3, label: 'Calm' },
  { day: 'Wed', mood: 2, label: 'Anxious' },
  { day: 'Thu', mood: 5, label: 'Very Happy' },
  { day: 'Fri', mood: 3, label: 'Calm' },
  { day: 'Sat', mood: 4, label: 'Happy' },
  { day: 'Sun', mood: 2, label: 'Anxious' },
];

const medicationData = [
  { name: 'Taken on Time', value: 85, color: '#34d399' },
  { name: 'Missed/Late', value: 15, color: '#f87171' },
];

export default function CaregiverAnalytics() {
  const getMoodColor = (mood) => {
    switch(mood) {
      case 5: return '#34d399'; // Green - Very Happy
      case 4: return '#6ee7b7'; // Light Green - Happy
      case 3: return '#bae6fd'; // Blue - Calm
      case 2: return '#fbbf24'; // Yellow - Anxious
      case 1: return '#f87171'; // Red - Agitated
      default: return '#94a3b8';
    }
  };

  const CustomMoodTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{payload[0].payload.day}: {payload[0].payload.label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="analytics-container">
      <InteractiveCard className="analytics-card" glowColor="rgba(52, 211, 153, 0.2)">
        <div className="ac-header">
          <h3>Weekly Mood Log</h3>
          <span className="ac-subtitle">Average: Calm</span>
        </div>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 5]} ticks={[1,2,3,4,5]} stroke="rgba(255,255,255,0.5)" tick={{fill: 'rgba(255,255,255,0.5)', fontSize: 12}} axisLine={false} tickLine={false} />
              <RechartsTooltip content={<CustomMoodTooltip />} />
              <Bar dataKey="mood" radius={[4, 4, 0, 0]}>
                {moodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getMoodColor(entry.mood)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </InteractiveCard>

      <InteractiveCard className="analytics-card" glowColor="rgba(96, 165, 250, 0.2)">
         <div className="ac-header">
          <h3>Medication Adherence</h3>
          <span className="ac-subtitle">Last 30 Days</span>
        </div>
        <div className="chart-wrapper pie-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={medicationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {medicationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip 
                 contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pie-center-text">
            <strong>85%</strong>
            <span>On Time</span>
          </div>
        </div>
      </InteractiveCard>
    </div>
  );
}
