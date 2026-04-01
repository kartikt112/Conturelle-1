import Link from 'next/link';
import styles from './Footer.module.css';

const shopLinks = [
  { label: 'Spacer Bras', href: '/category/spacer-bras' },
  { label: 'Lace Bras', href: '/category/lace-bras' },
  { label: 'T-Shirt Bras', href: '/category/t-shirt-bras' },
  { label: 'Briefs', href: '/category/briefs' },
  { label: 'Complete Sets', href: '/category/sets' },
  { label: 'Sale', href: '/sale' },
];

const helpLinks = [
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Fit Finder Quiz', href: '/#fit-finder' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns', href: '/returns' },
  { label: 'Contact Us', href: '/contact' },
  { label: 'FAQs', href: '/faq' },
];

const aboutLinks = [
  { label: 'Our Story', href: '/#heritage' },
  { label: '140 Years of Heritage', href: '/heritage' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Press', href: '/press' },
];

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Imprint', href: '/imprint' },
  { label: 'Cookie Settings', href: '/cookies' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          {/* Brand Column */}
          <div className={styles.brand}>
            <div className={styles.logoWrap}>
              <span className={styles.logo}>CONTURELLE</span>
              <span className={styles.byline}>by Felina</span>
            </div>
            <p className={styles.tagline}>
              European lingerie crafted for the modern woman. Where heritage meets everyday luxury.
            </p>
            <div className={styles.social}>
              <a href="https://instagram.com" className={styles.socialLink} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="https://facebook.com" className={styles.socialLink} aria-label="Facebook" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a href="https://pinterest.com" className={styles.socialLink} aria-label="Pinterest" target="_blank" rel="noopener noreferrer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.13 2.52 7.68 6.12 9.18-.08-.72-.16-1.83.03-2.62.17-.71 1.09-4.63 1.09-4.63s-.28-.56-.28-1.38c0-1.29.75-2.26 1.68-2.26.79 0 1.17.59 1.17 1.3 0 .79-.5 1.98-.77 3.08-.22.92.46 1.67 1.37 1.67 1.64 0 2.9-1.73 2.9-4.22 0-2.21-1.59-3.75-3.86-3.75-2.63 0-4.17 1.97-4.17 4.01 0 .79.31 1.64.69 2.1.08.09.09.17.07.27l-.26 1.04c-.04.17-.14.2-.32.12-1.2-.56-1.95-2.31-1.95-3.71 0-3.03 2.2-5.81 6.34-5.81 3.33 0 5.91 2.37 5.91 5.54 0 3.3-2.08 5.96-4.98 5.96-.97 0-1.89-.51-2.2-1.11l-.6 2.28c-.22.84-.81 1.89-1.2 2.53.9.28 1.86.43 2.85.43 5.52 0 10-4.48 10-10S17.52 2 12 2z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Shop</h4>
            <ul className={styles.columnList}>
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.columnLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Help</h4>
            <ul className={styles.columnList}>
              {helpLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.columnLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Column */}
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>About</h4>
            <ul className={styles.columnList}>
              {aboutLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={styles.columnLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust Bar */}
        <div className={styles.trust}>
          <span>Secure Checkout</span>
          <span className={styles.trustDot}>&middot;</span>
          <span>OEKO-TEX&reg; Certified</span>
          <span className={styles.trustDot}>&middot;</span>
          <span>Made in Europe</span>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <span className={styles.copyright}>
            &copy; {new Date().getFullYear()} Conturelle by Felina. All rights reserved.
          </span>
          <div className={styles.legal}>
            {legalLinks.map((link, i) => (
              <Link key={link.label} href={link.href} className={styles.legalLink}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
