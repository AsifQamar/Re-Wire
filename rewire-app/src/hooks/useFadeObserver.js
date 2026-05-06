import { useEffect } from 'react';

export default function useFadeObserver() {
  useEffect(() => {
    const els = document.querySelectorAll('.fade:not(.vis)');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('vis'), i * 75);
        }
      });
    }, { threshold: 0.08 });

    els.forEach(el => obs.observe(el));

    return () => obs.disconnect();
  });
}