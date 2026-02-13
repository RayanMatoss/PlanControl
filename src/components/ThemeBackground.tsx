import { useEffect, useRef, useCallback } from 'react';

const PARALLAX_MAX = 8;
const PARALLAX_SMOOTH = 0.08;

export function ThemeBackground() {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const x = (e.clientX / w) * 2 - 1;
    const y = (e.clientY / h) * 2 - 1;
    targetRef.current = { x: x * PARALLAX_MAX, y: y * PARALLAX_MAX };
  }, []);

  useEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;

    const applyParallax = () => {
      const html = document.documentElement;
      const isBlueprint = html.getAttribute('data-theme') === 'blueprint';
      const isHigh = html.getAttribute('data-motion') === 'high';
      if (!isBlueprint || !isHigh) {
        currentRef.current = { x: 0, y: 0 };
        el.style.transform = 'translate(0, 0)';
        rafRef.current = requestAnimationFrame(applyParallax);
        return;
      }

      const tx = targetRef.current.x;
      const ty = targetRef.current.y;
      const cx = currentRef.current.x + (tx - currentRef.current.x) * PARALLAX_SMOOTH;
      const cy = currentRef.current.y + (ty - currentRef.current.y) * PARALLAX_SMOOTH;
      currentRef.current = { x: cx, y: cy };
      el.style.transform = `translate(${cx}px, ${cy}px)`;
      rafRef.current = requestAnimationFrame(applyParallax);
    };

    rafRef.current = requestAnimationFrame(applyParallax);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [onMouseMove]);

  return (
    <div
      className="theme-bg"
      aria-hidden="true"
      style={{ width: '100vw', height: '100vh' }}
    >
      <div ref={parallaxRef} className="theme-bg__parallax" aria-hidden="true" />
      <div className="theme-bg__glow" aria-hidden="true" />
    </div>
  );
}
