import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import PatientHome from './pages/PatientHome';
import FamilyPage from './pages/FamilyPage';
import RoutinePage from './pages/RoutinePage';
import MemoryVault from './pages/MemoryVault';
import CaregiverDashboard from './pages/CaregiverDashboard';
import SplineScene from './components/SplineScene';
import LandingSelection from './pages/LandingSelection';
import PreventiveDashboard from './pages/PreventiveDashboard';

// New Pages & Components
import MusicTherapyPage from './pages/MusicTherapyPage';
import CognitiveGamesPage from './pages/CognitiveGamesPage';
import NeuroGymPage from './pages/NeuroGymPage';
import MedicationPage from './pages/MedicationPage';
import LifeTimelinePage from './pages/LifeTimelinePage';
import SOSButton from './components/SOSButton';
import FaceRecognitionPage from './pages/FaceRecognitionPage';
import MemoryMapPage from './pages/MemoryMapPage';
import ConversationMemory from './pages/ConversationMemory';
import MoodThemeProvider from './components/MoodThemeProvider';

import './App.css';

const SPLINE_BG_URL = 'https://my.spline.design/claritystream-4vR4muSsQA0M1MY0wmvUB6hB/';

export default function App() {
  const [mode, setMode] = useState(null); // start with no mode

  const toggleMode = () => {
    setMode((prev) => (prev === 'patient' ? 'caregiver' : 'patient'));
  };

  const handleSelectMode = (selectedMode) => {
    setMode(selectedMode);
  };

  const handleExitToLanding = () => {
    setMode(null);
  };

  if (!mode) {
    return (
      <div className="app app-landing">
        <div className="app-3d-bg">
          <SplineScene sceneUrl={SPLINE_BG_URL} className="app-spline-bg" />
        </div>
        <LandingSelection onSelectMode={handleSelectMode} />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className={`app app-${mode}`}>
        <MoodThemeProvider>
        {/* Full-page 3D background */}
        <div className="app-3d-bg">
          <SplineScene sceneUrl={SPLINE_BG_URL} className="app-spline-bg" />
          <div className="app-3d-overlay" />
        </div>

        {/* Note: In a real app, Navbar might need a clear prop to exit to landing */}
        <Navbar mode={mode} onModeToggle={toggleMode} onExit={handleExitToLanding} />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              mode === 'preventive' ? <PreventiveDashboard /> :
              mode === 'caregiver' ? <Navigate to="/caregiver" replace /> :
              <PatientHome />
            } />
            <Route path="/family" element={<FamilyPage />} />
            <Route path="/routine" element={<RoutinePage />} />
            <Route path="/memories" element={<MemoryVault />} />
            <Route path="/medication" element={<MedicationPage />} />
            <Route path="/music" element={<MusicTherapyPage />} />
            <Route path="/games" element={mode === 'preventive' ? <NeuroGymPage /> : <CognitiveGamesPage />} />
            <Route path="/timeline" element={<LifeTimelinePage />} />
            <Route path="/face-recognition" element={<FaceRecognitionPage />} />
            <Route path="/memory-map" element={<MemoryMapPage />} />
            <Route path="/daily-log" element={<ConversationMemory />} />
            <Route path="/caregiver" element={<CaregiverDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        {/* Global SOS Button usually stays active as long as app is running in patient mode */}
        {mode !== 'preventive' && <SOSButton />}
        </MoodThemeProvider>
      </div>
    </BrowserRouter>
  );
}
