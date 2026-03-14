import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SplineScene from './components/SplineScene';
import LandingSelection from './pages/LandingSelection';
import MoodThemeProvider from './components/MoodThemeProvider';
import { PatientDataProvider } from './context/PatientDataContext';

import './App.css';

// Lazy-load all page components — only loaded when the user navigates to them
const PatientHome = lazy(() => import('./pages/PatientHome'));
const FamilyPage = lazy(() => import('./pages/FamilyPage'));
const RoutinePage = lazy(() => import('./pages/RoutinePage'));
const MemoryVault = lazy(() => import('./pages/MemoryVault'));
const CaregiverDashboard = lazy(() => import('./pages/CaregiverDashboard'));
const PreventiveDashboard = lazy(() => import('./pages/PreventiveDashboard'));
const MusicTherapyPage = lazy(() => import('./pages/MusicTherapyPage'));
const CognitiveGamesPage = lazy(() => import('./pages/CognitiveGamesPage'));
const NeuroGymPage = lazy(() => import('./pages/NeuroGymPage'));
const MedicationPage = lazy(() => import('./pages/MedicationPage'));
const LifeTimelinePage = lazy(() => import('./pages/LifeTimelinePage'));
const FaceRecognitionPage = lazy(() => import('./pages/FaceRecognitionPage'));
const MemoryMapPage = lazy(() => import('./pages/MemoryMapPage'));
const ConversationMemory = lazy(() => import('./pages/ConversationMemory'));
const ActivityMonitor = lazy(() => import('./components/ActivityMonitor'));
const SOSButton = lazy(() => import('./components/SOSButton'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '40vh',
      color: 'var(--text-muted)',
      fontSize: 'var(--text-base)',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid var(--border)',
        borderTopColor: 'var(--lavender)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginRight: '12px',
      }} />
      Loading…
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState(null);

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
      <PatientDataProvider>
        <div className="app app-landing">
          <div className="app-3d-bg">
            <SplineScene className="app-spline-bg" />
          </div>
          <LandingSelection onSelectMode={handleSelectMode} />
        </div>
      </PatientDataProvider>
    );
  }

  return (
    <PatientDataProvider>
      <BrowserRouter>
        <div className={`app app-${mode}`}>
          <MoodThemeProvider>
          {/* Lightweight CSS animated background */}
          <div className="app-3d-bg">
            <SplineScene className="app-spline-bg" />
            <div className="app-3d-overlay" />
          </div>

          <Navbar mode={mode} onModeToggle={toggleMode} onExit={handleExitToLanding} />
          
          <main className="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Home Dashboard */}
                <Route path="/" element={
                  mode === 'preventive' ? <PreventiveDashboard /> :
                  mode === 'caregiver' ? <Navigate to="/caregiver" replace /> :
                  <PatientHome />
                } />
                <Route path="/caregiver" element={
                  mode === 'caregiver' ? <CaregiverDashboard /> : <Navigate to="/" replace />
                } />

                {/* Shared Pages */}
                <Route path="/family" element={<FamilyPage />} />
                <Route path="/routine" element={<RoutinePage />} />
                <Route path="/memories" element={<MemoryVault />} />
                <Route path="/medication" element={<MedicationPage />} />
                <Route path="/music" element={<MusicTherapyPage />} />
                <Route path="/games" element={
                  mode === 'preventive' ? <NeuroGymPage /> : <CognitiveGamesPage />
                } />
                <Route path="/timeline" element={<LifeTimelinePage />} />

                {/* Patient/Preventive Only Pages */}
                <Route path="/face-recognition" element={
                  mode !== 'caregiver' ? <FaceRecognitionPage /> : <Navigate to="/caregiver" replace />
                } />
                <Route path="/memory-map" element={
                  mode !== 'caregiver' ? <MemoryMapPage /> : <Navigate to="/caregiver" replace />
                } />
                <Route path="/daily-log" element={
                  mode !== 'caregiver' ? <ConversationMemory /> : <Navigate to="/caregiver" replace />
                } />

                {/* Caregiver Only Pages */}
                <Route path="/activity-monitor" element={
                  mode === 'caregiver' ? <ActivityMonitor /> : <Navigate to="/" replace />
                } />

                {/* Fallback routing */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
          
          {mode !== 'preventive' && (
            <Suspense fallback={null}>
              <SOSButton />
            </Suspense>
          )}
          </MoodThemeProvider>
        </div>
      </BrowserRouter>
    </PatientDataProvider>
  );
}
