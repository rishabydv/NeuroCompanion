import { useState, useEffect, useRef } from 'react';
import { Camera, FileText, Activity, Save, Loader, RefreshCw, X, Trash2 } from 'lucide-react';
import { patient } from '../data/patientData';
import ScrollReveal from '../components/ScrollReveal';
import './ActivityMonitor.css';

const DEFAULT_GEMINI_API_KEY = '';

export default function ActivityMonitor({ isEmbedded = false }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState([]);
  const [lastDetected, setLastDetected] = useState(null);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState(localStorage.getItem('userGeminiApiKey') || '');
  const [showSettings, setShowSettings] = useState(!localStorage.getItem('userGeminiApiKey'));

  // Auto-start camera if embedded (e.g., in Caregiver Dashboard)
  useEffect(() => {
    if (isEmbedded) {
      startCamera();
    }
    loadLogs();
    
    return () => {
      stopCamera();
    };
  }, [isEmbedded]);

  const loadLogs = () => {
    const savedLogs = JSON.parse(localStorage.getItem('aiActivityLogs') || '[]');
    setLogs(savedLogs);
  };

  const saveApiKey = (key) => {
    const trimmedKey = key.trim();
    setApiKey(trimmedKey);
    localStorage.setItem('userGeminiApiKey', trimmedKey);
    setShowSettings(false);
    setError('');
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('userGeminiApiKey');
    setShowSettings(true);
  };

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 640, height: 480 } 
      });
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Could not access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  // Bind the stream to the video element whenever stream or videoRef becomes available
  useEffect(() => {
    if (stream && videoRef.current && !videoRef.current.srcObject) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Capture a frame and send to Gemini Vision
  const captureAndAnalyze = async () => {
    if (!videoRef.current || !stream) {
      setError('Camera is not active.');
      return;
    }

    if (!apiKey) {
      setError('Gemini API Key is missing. Please add it in settings.');
      setShowSettings(true);
      return;
    }

    setIsAnalyzing(true);
    let currentTask = "Analyzing...";

    try {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      
      // Ensure video is ready
      if (video.readyState < 2 || !video.videoWidth) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Get base64 image data
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Call Gemini Vision
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `You are an AI assistant monitoring a dementia patient (Name: ${patient.name}). 
              Analyze the image and state what the person is doing in 1-4 words.
              Examples: "Drinking water", "Reading a book", "Sleeping", "Watching TV", "Walking", "Sitting at desk".
              If no person is visible, say "No person detected".
              Be concise and objective.`
            }]
          },
          contents: [
            {
              role: "user",
              parts: [
                {
                  inlineData: {
                    mimeType: "image/jpeg",
                    data: base64Image
                  }
                },
                { text: "What is the person doing in this image?" }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 20
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
        if (data.error.status === 'PERMISSION_DENIED') {
          throw new Error('Invalid API Key or expired.');
        }
        throw new Error(data.error.message || 'API Error');
      }
      
      currentTask = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "Unknown activity";
      
      // Clean up response
      currentTask = currentTask.replace(/["']/g, '').replace(/\.$/, '');
      
      setLastDetected(currentTask);
      
      // Log it if it's a real activity
      if (currentTask && currentTask.toLowerCase() !== "no person detected") {
        saveLog(currentTask);
      }

    } catch (err) {
      console.error('Vision API Error Details:', err);
      setError(`Failed to analyze frame: ${err.message}`);
      setLastDetected("Analysis failed");
      if (err.message.toLowerCase().includes('key')) {
        setShowSettings(true);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveLog = (activity) => {
    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const date = new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    
    // Check if the same activity was logged recently (prevent spam)
    const recentLogs = JSON.parse(localStorage.getItem('aiActivityLogs') || '[]');
    if (recentLogs.length > 0) {
      const last = recentLogs[0];
      // If same activity within 5 minutes, ignore
      if (last.activity.toLowerCase() === activity.toLowerCase()) {
        const lastTime = new Date(last.timestamp);
        const now = new Date();
        if ((now - lastTime) < 5 * 60 * 1000) {
          console.log('Skipping duplicate activity log');
          return;
        }
      }
    }

    const newLog = {
      id: Date.now(),
      activity,
      time,
      date,
      timestamp: new Date().toISOString()
    };
    
    const updated = [newLog, ...recentLogs].slice(0, 50); // Keep last 50
    setLogs(updated);
    localStorage.setItem('aiActivityLogs', JSON.stringify(updated));
  };
  
  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all activity logs?')) {
      localStorage.removeItem('aiActivityLogs');
      setLogs([]);
    }
  };

  // Background monitoring loop
  useEffect(() => {
    let interval;
    if (isMonitoring && stream && !isAnalyzing) {
      // Analyze every 15 seconds while monitoring is ON
      interval = setInterval(() => {
        captureAndAnalyze();
      }, 15000);
    }
    return () => clearInterval(interval);
  }, [isMonitoring, stream, isAnalyzing]);

  return (
    <div className={`activity-monitor ${isEmbedded ? 'am-embedded' : ''}`}>
      {!isEmbedded && (
        <ScrollReveal>
          <header className="am-header">
            <div className="am-icon">
              <Camera size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <h1>AI Activity Monitor</h1>
              <p>Uses Gemini Vision to detect daily tasks and log them automatically.</p>
            </div>
            <button 
              className={`am-btn ${showSettings ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={18} />
              {apiKey ? 'API Settings' : 'Setup API Key'}
            </button>
          </header>
        </ScrollReveal>
      )}

      {showSettings && (
        <ScrollReveal direction="down">
          <div className="am-settings-card animate-fade-in">
            <div className="am-settings-content">
              <h3><Settings size={18} /> Gemini Vision Configuration</h3>
              <p>To use AI activity monitoring, you need a Gemini API Key. Your key is stored locally in this browser and never sent to our servers.</p>
              
              <div className="am-api-input-group">
                <input 
                  type="password" 
                  placeholder="Enter your Gemini API Key..." 
                  className="am-api-input"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button className="am-btn btn-primary" onClick={() => saveApiKey(apiKey)}>
                  <Save size={16} /> Save Key
                </button>
                {apiKey && (
                  <button className="am-btn btn-danger" onClick={clearApiKey}>
                    <Trash2 size={16} /> Delete
                  </button>
                )}
              </div>
              
              <div className="am-settings-help">
                <p>Don't have a key? <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Get one for free at Google AI Studio</a></p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {error && (
        <div className="am-error">
          <X size={18} />
          {error}
        </div>
      )}

      <div className="am-grid">
        {/* Camera Section */}
        <div className="am-camera-card">
          <div className="am-camera-header">
            <h3><Activity size={18} /> Live Feed</h3>
            <div className={`am-status ${stream ? 'active' : 'inactive'}`}>
              <div className="am-status-dot"></div>
              {stream ? 'Camera Active' : 'Camera Off'}
            </div>
          </div>
          
          <div className="am-video-wrapper">
            {!stream ? (
              <div className="am-video-placeholder">
                <Camera size={48} />
                <button className="am-btn-primary" onClick={startCamera}>
                  Enable Camera
                </button>
              </div>
            ) : (
              <>
                <video ref={videoRef} autoPlay playsInline muted className="am-video" />
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                
                {/* Overlay for analysis status */}
                <div className="am-overlay">
                  {isAnalyzing && (
                    <div className="am-analyzing-badge">
                      <Loader size={14} className="am-spin" />
                      Analyzing frame...
                    </div>
                  )}
                  {lastDetected && !isAnalyzing && (
                    <div className="am-detected-badge animate-scale-in">
                      {lastDetected}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          
          <div className="am-controls">
            {stream && (
              <>
                <button 
                  className={`am-btn ${isMonitoring ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => setIsMonitoring(!isMonitoring)}
                >
                  {isMonitoring ? 'Stop Auto-Monitor' : 'Start Auto-Monitor (15s)'}
                </button>
                <button 
                  className="am-btn btn-secondary"
                  onClick={captureAndAnalyze}
                  disabled={isAnalyzing}
                >
                  <RefreshCw size={16} className={isAnalyzing ? 'am-spin' : ''} />
                  Scan Now
                </button>
                <button className="am-btn btn-outline" onClick={stopCamera}>
                  Turn Off Camera
                </button>
              </>
            )}
          </div>
        </div>

        {/* Database / Logs Section */}
        <div className="am-logs-card">
          <div className="am-logs-header">
            <h3><FileText size={18} /> Detected Task Database</h3>
            <div className="am-logs-actions">
              <span className="am-logs-count">{logs.length} entries</span>
              <button className="am-icon-btn" onClick={clearLogs} title="Clear Logs">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          <div className="am-logs-list">
            {logs.length === 0 ? (
              <div className="am-empty-logs">
                <Save size={32} />
                <p>No activities logged yet.</p>
                <span>Start auto-monitoring or click 'Scan Now'.</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="am-log-item animate-fade-in">
                  <div className="am-log-time">
                    <strong>{log.time}</strong>
                    <span>{log.date}</span>
                  </div>
                  <div className="am-log-activity">
                    <span className="am-log-dot"></span>
                    <div className="am-log-content">
                      <span className="am-log-label">Detected Task:</span>
                      <strong>{log.activity}</strong>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
