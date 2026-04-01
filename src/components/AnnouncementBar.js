'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './AnnouncementBar.module.css';

const messages = [
  'Free Shipping on Orders Over \u20AC75',
  '30-Day Easy Returns \u2014 No Questions Asked',
  'Crafted in Europe Since 1885',
];

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('announcementDismissed');
      if (stored === 'true') setDismissed(true);
    }
  }, []);

  useEffect(() => {
    if (dismissed) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 4000);
    return () => clearInterval(interval);
  }, [dismissed]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    sessionStorage.setItem('announcementDismissed', 'true');
    window.dispatchEvent(new CustomEvent('announcementDismissed'));
  }, []);

  if (dismissed) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.inner}>
        <span className={`${styles.message} ${fade ? styles.fadeIn : styles.fadeOut}`}>
          {messages[activeIndex]}
        </span>
        <button
          className={styles.close}
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
