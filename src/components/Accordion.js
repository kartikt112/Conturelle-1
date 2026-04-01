'use client';

import { useState, useRef, useCallback } from 'react';
import styles from './Accordion.module.css';

export default function Accordion({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className={`${styles.accordion} ${isOpen ? styles.open : ''}`}>
      <button className={styles.header} onClick={toggle} aria-expanded={isOpen}>
        <span className={styles.title}>{title}</span>
        <span className={styles.icon}>+</span>
      </button>
      <div
        className={styles.body}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight || 0}px` : '0px',
        }}
      >
        <div className={styles.content} ref={contentRef}>
          {children}
        </div>
      </div>
    </div>
  );
}
