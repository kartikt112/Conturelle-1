'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';
import s from './page.module.css';

export default function ThankYouPage() {
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [showUpsell, setShowUpsell] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 0) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;
  const timerDisplay = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText('conturelle.com/ref/XK92');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const bestsellers = products.slice(0, 4);

  return (
    <div className={s.container}>
      {/* Confirmation */}
      <div className={s.confirm}>
        <div className={s.confirmCheck}>✓</div>
        <h1 className={s.confirmTitle}>Order Confirmed</h1>
        <p className={s.confirmOrder}>Order #CN-10042</p>
        <p className={s.confirmText}>Thank you, Sophie! Your order is being prepared with the same care we put into every stitch.</p>
        <p className={s.confirmEmail}>Confirmation email sent to sophie.mueller@email.de</p>
      </div>

      {/* Post-Purchase Upsell */}
      {showUpsell && (
        <div className={s.upsellOffer}>
          <p className={s.upsellBadge}>Exclusive Offer — Just for You</p>
          <p className={s.upsellTimer}>{timerDisplay}</p>
          <div className={s.upsellProduct}>
            <div className={s.upsellImg}>
              <Image src="/images/provence-1.jpg" alt="Provence Lace Bra" fill style={{ objectFit: 'cover' }} />
            </div>
            <div>
              <p className={s.upsellName}>Provence Lace Bra</p>
              <p className={s.upsellTagline}>Our #1 Bestseller</p>
              <div className={s.upsellPriceRow}>
                <span className={s.upsellPriceOriginal}>€79.00</span>
                <span className={s.upsellPriceSale}>€55.30</span>
                <span className={s.upsellSave}>Save 30%</span>
              </div>
              <p className={s.upsellNote}>This offer won&rsquo;t be available again.</p>
            </div>
          </div>
          <button className={s.upsellCta}>Yes — Add to My Order (€55.30)</button>
          <button className={s.upsellSkip} onClick={() => setShowUpsell(false)}>
            No thanks, continue to my order summary
          </button>
          <div className={s.upsellTrust}>
            <span>✓ Same-shipment delivery</span>
            <span>✓ 30-day return policy</span>
            <span>✓ One-click, no re-entering payment</span>
          </div>
        </div>
      )}

      {/* Order Details */}
      <div className={s.section}>
        <p className={s.sectionLabel}>Order Details</p>
        <div className={s.orderItem}>
          <div className={s.orderItemImg}>
            <Image src="/images/swing-1.jpg" alt="Silhouette Spacer Bra" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={s.orderItemInfo}>
            <p className={s.orderItemName}>Silhouette Spacer Bra</p>
            <p className={s.orderItemVariant}>80D · Champagne · Qty: 1</p>
          </div>
          <div className={s.orderItemPrice}>€62.30</div>
        </div>
        <div className={s.orderItem}>
          <div className={s.orderItemImg}>
            <Image src="/images/softtouch-2.jpg" alt="Matching Brief" fill style={{ objectFit: 'cover' }} />
          </div>
          <div className={s.orderItemInfo}>
            <p className={s.orderItemName}>Matching Brief</p>
            <p className={s.orderItemVariant}>M · Champagne · Qty: 1</p>
          </div>
          <div className={s.orderItemPrice}>€39.00</div>
        </div>
        <div className={s.orderTotals}>
          <div className={s.orderRow}><span>Subtotal</span><span>€101.30</span></div>
          <div className={s.orderRow}><span>Shipping</span><span style={{ color: 'var(--success)' }}>FREE</span></div>
          <div className={s.orderTotal}><span>Total</span><span>€101.30</span></div>
        </div>
      </div>

      {/* What's Next */}
      <div className={s.section}>
        <p className={s.sectionLabel}>What&rsquo;s Next</p>
        <div className={s.timeline}>
          <div className={s.timelineStep}>
            <div className={s.timelineIcon}>✉</div>
            <div className={s.timelineText}><strong>Confirmation email sent</strong><br />Check your inbox for order details and tracking info.</div>
          </div>
          <div className={s.timelineStep}>
            <div className={s.timelineIcon}>📦</div>
            <div className={s.timelineText}><strong>Shipping notification within 24 hours</strong><br />We&rsquo;ll email you when your order ships with a tracking link.</div>
          </div>
          <div className={s.timelineStep}>
            <div className={s.timelineIcon}>🚚</div>
            <div className={s.timelineText}><strong>Delivery in 3–5 business days</strong><br />Standard shipping to Germany. Discreet packaging.</div>
          </div>
        </div>
      </div>

      {/* Share & Earn */}
      <div className={s.section}>
        <p className={s.sectionLabel}>Share & Earn</p>
        <div className={s.referral}>
          <h3 className={s.referralTitle}>Give €10, Get €10</h3>
          <p className={s.referralDesc}>Share your unique link with a friend. They get €10 off their first order, you get €10 off your next.</p>
          <div className={s.referralLinkRow}>
            <div className={s.referralLink}>conturelle.com/ref/XK92</div>
            <button className={s.referralCopy} onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Social Follow */}
      <div className={s.section}>
        <p className={s.sectionLabel}>Follow Us</p>
        <p style={{ fontSize: 13, color: 'var(--taupe)', marginBottom: 16 }}>Follow us for styling tips and new arrivals:</p>
        <div className={s.socialLinks}>
          {['Instagram', 'TikTok', 'Pinterest', 'Facebook'].map(name => (
            <a key={name} href="#" className={s.socialLink}>{name}</a>
          ))}
        </div>
      </div>

      {/* Fit Quiz CTA */}
      <div className={s.section}>
        <div className={s.fitCta}>
          <p className={s.fitCtaText}>Haven&rsquo;t taken our Fit Quiz yet? Get personalized size recommendations for your next order.</p>
          <button className={s.fitCtaBtn}>Take the Fit Quiz →</button>
        </div>
      </div>

      {/* Continue Shopping */}
      <div className={s.continueShop}>
        <h3 className={s.continueShopTitle}>Bestsellers to Explore</h3>
        <div className={s.continueShopGrid}>
          {bestsellers.map(p => (
            <Link href={`/product/${p.slug}`} key={p.slug} className={s.card} style={{ textDecoration: 'none' }}>
              <div className={s.cardImg}>
                <Image src={p.images[0]} alt={p.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <p className={s.cardName}>{p.name}</p>
              <p className={s.cardPrice}>€{p.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
