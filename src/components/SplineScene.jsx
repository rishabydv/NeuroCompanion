import { useState } from 'react';
import './SplineScene.css';

export default function SplineScene({ sceneUrl, className = '', onLoad }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  if (error) {
    return (
      <div className={`spline-scene spline-fallback ${className}`}>
        <div className="spline-fallback-orb" />
      </div>
    );
  }

  return (
    <div className={`spline-scene ${loaded ? 'spline-loaded' : ''} ${className}`}>
      {!loaded && (
        <div className="spline-loader">
          <div className="spline-loader-orb" />
          <span className="spline-loader-text">Loading 3D scene…</span>
        </div>
      )}
      <iframe
        src={sceneUrl}
        frameBorder="0"
        width="100%"
        height="100%"
        title="3D Scene"
        onLoad={handleLoad}
        onError={() => setError(true)}
        style={{
          border: 'none',
          borderRadius: 'inherit',
          position: 'absolute',
          inset: 0,
        }}
        allow="autoplay"
      />
    </div>
  );
}
