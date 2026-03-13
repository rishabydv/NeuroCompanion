import { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({
  children,
  className = '',
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 30,
  threshold = 0.15,
  once = true,
}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  // Remove willChange after animation completes to free GPU layers
  useEffect(() => {
    if (visible && !animated) {
      const timer = setTimeout(() => setAnimated(true), (delay + duration) * 1000 + 100);
      return () => clearTimeout(timer);
    }
  }, [visible, animated, delay, duration]);

  const directionMap = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
    scale: 'scale(0.92)',
  };

  const hiddenTransform = directionMap[direction] || directionMap.up;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : hiddenTransform,
        transition: `opacity ${duration}s ease ${delay}s, transform ${duration}s ease ${delay}s`,
        willChange: animated ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
