import { useState } from 'react';
import {
  Settings, Users, Clock, BookHeart, Plus, X,
  User, Heart, Activity, Shield, Bell, BarChart3,
  Brain, Calendar, MapPin, Smile, Frown, Meh, Angry, AlertTriangle
} from 'lucide-react';
import { patient } from '../data/patientData';
import { usePatientData } from '../context/PatientDataContext';
import CaregiverAnalytics from '../components/CaregiverAnalytics';
import './CaregiverDashboard.css';

export default function CaregiverDashboard() {
  const { family, routines, memories, medications, addFamilyMember, addRoutine, addMemory } = usePatientData();
  const [showAddForm, setShowAddForm] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showWanderingAlert, setShowWanderingAlert] = useState(false);

  // Form state
  const [formData, setFormData] = useState({});

  const stats = [
    { icon: <Users size={22} />, label: 'Family Members', value: family.length, color: 'peach' },
    { icon: <Clock size={22} />, label: 'Daily Routines', value: routines.length, color: 'sky' },
    { icon: <BookHeart size={22} />, label: 'Memories Stored', value: memories.length, color: 'mint' },
    { icon: <Activity size={22} />, label: 'Medications', value: medications.length, color: 'lavender' },
  ];

  const showNotif = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const resetForm = () => {
    setFormData({});
    setShowAddForm(null);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (showAddForm === 'family member') {
      addFamilyMember({
        name: formData.name || '',
        relationship: formData.relationship || '',
        bio: formData.bio || '',
        photo: formData.photo || null,
        funFact: formData.funFact || '',
      });
    } else if (showAddForm === 'routine') {
      addRoutine({
        time: formData.time || '',
        activity: formData.activity || '',
        category: formData.category || 'morning',
      });
    } else if (showAddForm === 'memory') {
      addMemory({
        title: formData.title || '',
        date: formData.date || '',
        description: formData.description || '',
        photo: formData.photo || null,
        category: formData.category || 'personal',
      });
    }
    showNotif(`✅ New ${showAddForm} added successfully!`);
    resetForm();
  };

  const renderMoodEmoji = (moodId) => {
    switch (moodId) {
      case 'happy': return '😊';
      case 'calm': return '😌';
      case 'sad': return '😢';
      case 'anxious': return '😟';
      case 'tired': return '😴';
      default: return '😐';
    }
  };

  return (
    <div className="caregiver-dashboard">
      {notification && (
        <div className="cg-notification animate-fade-in">
          {notification}
        </div>
      )}

      {showWanderingAlert && (
        <div className="cg-alert-overlay animate-fade-in">
          <div className="cg-alert-box animate-scale-in">
            <div className="cg-alert-icon-ring">
              <AlertTriangle size={48} className="cg-alert-icon" />
            </div>
            <h2>CRITICAL ALERT</h2>
            <p><strong>{patient.name}</strong> has left the safe geofence zone.</p>
            <div className="cg-alert-map-mockup">
              <MapPin size={24} className="cg-alert-pin" />
              <span>Last seen: 200m from home heading North on Green Park Market Rd.</span>
            </div>
            <div className="cg-alert-actions">
              <button className="cg-alert-btn primary" onClick={() => setShowWanderingAlert(false)}>
                Acknowledge & Navigate
              </button>
              <button className="cg-alert-btn secondary" onClick={() => setShowWanderingAlert(false)}>
                Call Local Authorities
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="page-header animate-fade-in">
        <div className="page-header-left">
          <div className="page-icon-wrap cg-icon">
            <Settings size={24} />
          </div>
          <div>
            <h1 className="page-title">Caregiver Dashboard</h1>
            <p className="page-subtitle">
              <Shield size={14} />
              Manage {patient.name}'s companion profile
            </p>
          </div>
        </div>
      </header>

      {/* Patient Overview */}
      <section className="cg-patient-overview animate-fade-in-up">
        <div className="cg-patient-card">
          <img src={patient.photo} alt={patient.name} className="cg-patient-avatar" />
          <div className="cg-patient-info">
            <h2>{patient.name}</h2>
            <p className="cg-patient-age">Age {patient.age}</p>
            <p className="cg-patient-location">
              <MapPin size={14} />
              {patient.location}
            </p>
          </div>
          <div className="cg-patient-status">
            <span className="cg-status-badge active">
              <span className="status-dot" />
              System Active
            </span>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="cg-stats stagger-children">
        {stats.map((stat) => (
          <div key={stat.label} className={`cg-stat-card stat-${stat.color} animate-fade-in-up`}>
            <div className="cg-stat-icon">{stat.icon}</div>
            <div className="cg-stat-value">{stat.value}</div>
            <div className="cg-stat-label">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section className="cg-actions animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="cg-section-title">Quick Actions</h3>
        <div className="cg-action-grid">
          <button className="cg-action-btn" onClick={() => setShowAddForm('family member')}>
            <Plus size={18} />
            Add Family
          </button>
          <button className="cg-action-btn" onClick={() => setShowAddForm('routine')}>
            <Plus size={18} />
            Add Routine
          </button>
          <button className="cg-action-btn" onClick={() => setShowAddForm('memory')}>
            <Plus size={18} />
            Add Memory
          </button>
          <button className="cg-action-btn" onClick={() => window.location.href='/activity-monitor'} style={{background: 'var(--gradient-lavender)', color: 'white', borderColor: 'transparent'}}>
            <Activity size={18} />
            AI Camera Monitor
          </button>
          <button className="cg-action-btn cg-danger-btn" onClick={() => setShowWanderingAlert(true)}>
            <AlertTriangle size={18} />
            Wandering Alert
          </button>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="cg-data-section animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
        <CaregiverAnalytics />
      </section>

      {/* Current Data Sections */}
      <section className="cg-data-section animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <h3 className="cg-section-title">
          <Users size={18} />
          Family Members
        </h3>
        <div className="cg-data-list">
          {family.map((m) => (
            <div key={m.id} className="cg-data-item">
              {m.photo ? (
                <img src={m.photo} alt={m.name} className="cg-data-avatar" />
              ) : (
                <div className="cg-data-avatar cg-avatar-placeholder">
                  <User size={20} />
                </div>
              )}
              <div className="cg-data-info">
                <span className="cg-data-name">{m.name}</span>
                <span className="cg-data-meta">{m.relationship}</span>
              </div>
              <button className="cg-edit-btn" onClick={() => showNotif(`📝 Editing ${m.name}...`)}>
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="cg-data-section animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="cg-section-title">
          <BookHeart size={18} />
          Stored Memories
        </h3>
        <div className="cg-data-list">
          {memories.map((m) => (
            <div key={m.id} className="cg-data-item">
              <div className={`cg-memory-badge badge-${m.category}`}>
                {m.category === 'milestone' ? '🏆' : '👨‍👩‍👧‍👦'}
              </div>
              <div className="cg-data-info">
                <span className="cg-data-name">{m.title}</span>
                <span className="cg-data-meta">{m.date}</span>
              </div>
              <button className="cg-edit-btn" onClick={() => showNotif(`📝 Editing "${m.title}"...`)}>
                Edit
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="cg-modal-overlay" onClick={resetForm}>
          <div className="cg-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="cg-modal-header">
              <h3>Add New {showAddForm.charAt(0).toUpperCase() + showAddForm.slice(1)}</h3>
              <button className="cg-modal-close" onClick={resetForm}>
                <X size={20} />
              </button>
            </div>
            <form className="cg-modal-form" onSubmit={handleSubmit}>
              {showAddForm === 'family member' && (
                <>
                  <div className="cg-form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="e.g., Priya Kumar" required value={formData.name || ''} onChange={(e) => handleInputChange('name', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Relationship</label>
                    <input type="text" placeholder="e.g., Daughter-in-law" required value={formData.relationship || ''} onChange={(e) => handleInputChange('relationship', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Bio / Description</label>
                    <textarea placeholder="Write something the patient would remember..." required value={formData.bio || ''} onChange={(e) => handleInputChange('bio', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Fun Fact (optional)</label>
                    <input type="text" placeholder="e.g., Loves making chai" value={formData.funFact || ''} onChange={(e) => handleInputChange('funFact', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Photo</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  </div>
                </>
              )}
              {showAddForm === 'routine' && (
                <>
                  <div className="cg-form-group">
                    <label>Time</label>
                    <input type="time" required value={formData.time || ''} onChange={(e) => handleInputChange('time', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Activity</label>
                    <input type="text" placeholder="e.g., Morning yoga" required value={formData.activity || ''} onChange={(e) => handleInputChange('activity', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Category</label>
                    <select required value={formData.category || 'morning'} onChange={(e) => handleInputChange('category', e.target.value)}>
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                      <option value="night">Night</option>
                    </select>
                  </div>
                </>
              )}
              {showAddForm === 'memory' && (
                <>
                  <div className="cg-form-group">
                    <label>Title</label>
                    <input type="text" placeholder="e.g., First trip to Shimla" required value={formData.title || ''} onChange={(e) => handleInputChange('title', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Date</label>
                    <input type="text" placeholder="e.g., Summer 2005" required value={formData.date || ''} onChange={(e) => handleInputChange('date', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Description</label>
                    <textarea placeholder="Describe the memory in warm, personal detail..." required value={formData.description || ''} onChange={(e) => handleInputChange('description', e.target.value)} />
                  </div>
                  <div className="cg-form-group">
                    <label>Category</label>
                    <select required value={formData.category || 'personal'} onChange={(e) => handleInputChange('category', e.target.value)}>
                      <option value="milestone">Milestone</option>
                      <option value="family">Family</option>
                      <option value="travel">Travel</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  <div className="cg-form-group">
                    <label>Photo</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                  </div>
                </>
              )}
              <button type="submit" className="cg-submit-btn">
                <Plus size={18} />
                Add {showAddForm}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
