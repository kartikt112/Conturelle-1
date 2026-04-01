'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './Nav.module.css';

const navLinks = [
  { label: 'Shop All', href: '/shop' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Our Story', href: '/#heritage' },
  { label: 'Fit Finder', href: '/#fit-finder' },
];

export default function Nav() {
  const { cartCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('announcementDismissed');
    if (stored === 'true') setAnnouncementVisible(false);

    const handleDismiss = () => setAnnouncementVisible(false);
    window.addEventListener('announcementDismissed', handleDismiss);
    return () => window.removeEventListener('announcementDismissed', handleDismiss);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <nav
        className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}
        style={{ top: announcementVisible ? 'var(--announcement-height)' : '0' }}
      >
        <div className={styles.inner}>
          {/* Hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>

          {/* Logo */}
          <Link href="/" className={styles.logo}>
            CONTURELLE
          </Link>

          {/* Center Links */}
          <div className={styles.links}>
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href} className={styles.link}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className={styles.actions}>
            <Link href="/#search" className={styles.actionBtn} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5L21 21" strokeLinecap="round" />
              </svg>
            </Link>
            <Link href="/wishlist" className={styles.wishlistBtn} aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {wishlistCount > 0 && (
                <span className={styles.wishlistBadge}>{wishlistCount}</span>
              )}
            </Link>
            <button
              className={styles.cartBtn}
              onClick={openCart}
              aria-label="Open cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className={styles.cartBadge}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={closeMobile}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileHeader}>
              <span className={styles.mobileLogo}>CONTURELLE</span>
              <button className={styles.mobileClose} onClick={closeMobile} aria-label="Close menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4L20 20M20 4L4 20" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className={styles.mobileLinks}>
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className={styles.mobileLink} onClick={closeMobile}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
