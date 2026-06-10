import { useEffect } from 'react';

export default function useScrollReveal() {
  useEffect(() => {
    const revealOnScroll = () => {
      const reveals = document.querySelectorAll('.reveal, .reveal-fade');
      const windowHeight = window.innerHeight;
      const elementVisible = 100;

      reveals.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
          el.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    // Trigger on load for elements already in view
    setTimeout(revealOnScroll, 100);

    return () => window.removeEventListener('scroll', revealOnScroll);
  }, []);
}
