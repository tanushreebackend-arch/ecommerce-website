'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: boolean;
  scale?: boolean;
}

export default function ScrollReveal({ children, className = '', stagger = false, scale = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -48px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const baseClass = scale ? 'scroll-reveal-scale' : 'scroll-reveal';
  const staggerClass = stagger ? 'scroll-reveal-stagger' : '';

  return (
    <div ref={ref} className={`${baseClass} ${staggerClass} ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
}
