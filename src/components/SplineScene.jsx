import './SplineScene.css';

/**
 * Lightweight animated background replacement for Spline 3D.
 * Renders pure-CSS animated gradient orbs instead of heavy WebGL iframes.
 * This removes ~30-50MB of GPU memory and eliminates iframe overhead.
 */
export default function SplineScene({ className = '' }) {
  return (
    <div className={`spline-scene spline-loaded ${className}`}>
      <div className="css-bg-scene">
        <div className="css-orb css-orb-1" />
        <div className="css-orb css-orb-2" />
        <div className="css-orb css-orb-3" />
        <div className="css-orb css-orb-4" />
        <div className="css-noise-overlay" />
      </div>
    </div>
  );
}
