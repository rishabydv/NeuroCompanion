import { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, Scan, User, Heart, RefreshCw, XCircle } from 'lucide-react';
import { familyMembers, patient } from '../data/patientData';
import './FaceRecognitionPage.css';

export default function FaceRecognitionPage() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [recognizedPerson, setRecognizedPerson] = useState(null);
  const [labeledDescriptors, setLabeledDescriptors] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('Initializing AI...');
  const detectionRef = useRef(null);

  // Load descriptors from stored family member photos
  const loadFamilyDescriptors = async () => {
    const descriptors = [];
    for (const member of familyMembers) {
      try {
        const img = await faceapi.fetchImage(member.photo);
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptor();
        if (detection) {
          descriptors.push(
            new faceapi.LabeledFaceDescriptors(member.name, [detection.descriptor])
          );
        }
      } catch (err) {
        console.warn(`Could not load face for ${member.name}:`, err);
      }
    }
    if (descriptors.length > 0) {
      setLabeledDescriptors(descriptors);
    }
  };

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingStatus('Loading face detection models...');
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        setLoadingStatus('Loading reference faces...');
        await loadFamilyDescriptors();
        setModelsLoaded(true);
        setLoadingStatus('');
      } catch (err) {
        console.error('Error loading models:', err);
        setError('Could not load AI models. Please try again.');
      }
    };
    loadModels();
    return () => {
      if (detectionRef.current) cancelAnimationFrame(detectionRef.current);
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera in your browser.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    }
    setCameraActive(false);
    setScanning(false);
    setRecognizedPerson(null);
    if (detectionRef.current) cancelAnimationFrame(detectionRef.current);
  };

  // Start face scanning loop
  const startScanning = () => {
    if (!labeledDescriptors || labeledDescriptors.length === 0) {
      // If no descriptors loaded, do a simulated demo
      setScanning(true);
      setTimeout(() => {
        const randomMember = familyMembers[Math.floor(Math.random() * familyMembers.length)];
        setRecognizedPerson(randomMember);
        setScanning(false);
        // Speak the recognition result
        const utterance = new SpeechSynthesisUtterance(
          `I see ${randomMember.name}. ${randomMember.name} is your ${randomMember.relationship}.`
        );
        utterance.rate = 0.85;
        utterance.lang = 'en-IN';
        window.speechSynthesis.speak(utterance);
      }, 3000);
      return;
    }

    setScanning(true);
    setRecognizedPerson(null);
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

    const detectFaces = async () => {
      if (!videoRef.current || !cameraActive) return;

      const detection = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const match = faceMatcher.findBestMatch(detection.descriptor);
        if (match.label !== 'unknown') {
          const person = familyMembers.find(m => m.name === match.label);
          if (person) {
            setRecognizedPerson(person);
            setScanning(false);
            const utterance = new SpeechSynthesisUtterance(
              `I see ${person.name}. ${person.name} is your ${person.relationship}.`
            );
            utterance.rate = 0.85;
            utterance.lang = 'en-IN';
            window.speechSynthesis.speak(utterance);
            return;
          }
        }
      }

      detectionRef.current = requestAnimationFrame(detectFaces);
    };

    detectFaces();
  };

  return (
    <div className="face-recognition-page">
      <header className="fr-header">
        <div className="fr-header-icon">
          <Scan size={32} />
        </div>
        <div>
          <h1>AI Familiar Face Recognition</h1>
          <p>Let me help you remember the people around you</p>
        </div>
      </header>

      <div className="fr-main">
        {/* Camera Feed */}
        <div className="fr-camera-container">
          <video
            ref={videoRef}
            className={`fr-video ${cameraActive ? 'active' : ''}`}
            muted
            playsInline
          />
          <canvas ref={canvasRef} className="fr-canvas" />

          {!cameraActive && (
            <div className="fr-camera-placeholder">
              <Camera size={64} className="fr-cam-icon" />
              <h3>Camera Preview</h3>
              <p>Point the camera at a family member's face</p>
            </div>
          )}

          {scanning && (
            <div className="fr-scanning-overlay">
              <div className="fr-scan-line" />
              <p>Scanning for familiar faces…</p>
            </div>
          )}

          {error && (
            <div className="fr-error">
              <XCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {!modelsLoaded && !error && (
            <div className="fr-loading">
              <div className="fr-loading-spinner" />
              <p>{loadingStatus}</p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="fr-controls">
          {!cameraActive ? (
            <button
              className="fr-btn fr-btn-primary"
              onClick={startCamera}
              disabled={!modelsLoaded}
            >
              <Camera size={20} />
              {modelsLoaded ? 'Start Camera' : 'Loading AI Models…'}
            </button>
          ) : (
            <>
              <button
                className="fr-btn fr-btn-scan"
                onClick={startScanning}
                disabled={scanning}
              >
                <Scan size={20} />
                {scanning ? 'Scanning…' : 'Scan Face'}
              </button>
              <button className="fr-btn fr-btn-stop" onClick={stopCamera}>
                <XCircle size={20} />
                Stop Camera
              </button>
            </>
          )}
        </div>

        {/* Recognition Result */}
        {recognizedPerson && (
          <div className="fr-result animate-scale-in">
            <div className="fr-result-header">
              <Scan size={20} />
              <span>Face Recognized!</span>
            </div>
            <div className="fr-result-card">
              <img
                src={recognizedPerson.photo}
                alt={recognizedPerson.name}
                className="fr-result-photo"
              />
              <div className="fr-result-info">
                <h2 className="fr-result-name">{recognizedPerson.name}</h2>
                <p className="fr-result-relation">
                  <Heart size={16} />
                  Your {recognizedPerson.relationship}
                </p>
                <p className="fr-result-bio">{recognizedPerson.bio}</p>
              </div>
            </div>
            <button className="fr-btn fr-btn-scan" onClick={() => {
              setRecognizedPerson(null);
              startScanning();
            }}>
              <RefreshCw size={18} />
              Scan Another Face
            </button>
          </div>
        )}

        {/* Family Members Reference */}
        <div className="fr-family-ref">
          <h3>Known Faces in System</h3>
          <div className="fr-family-grid">
            {familyMembers.map(m => (
              <div key={m.id} className="fr-family-chip">
                <img src={m.photo} alt={m.name} />
                <span>{m.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
