'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

const STEPS = ['Information', 'Shipping', 'Payment'];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, clearCart } = useCart();

  const [activeStep, setActiveStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [bumpWashBag, setBumpWashBag] = useState(false);
  const [bumpGiftWrap, setBumpGiftWrap] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const shippingCost = shippingMethod === 'express' ? 9.95 : 0;
  const bumpTotal = (bumpWashBag ? 4.95 : 0) + (bumpGiftWrap ? 6.95 : 0);
  const total = cartSubtotal + shippingCost + bumpTotal;
  const klarnaInstallment = (total / 4).toFixed(2);

  const handleCompleteOrder = () => {
    clearCart();
    router.push('/thankyou');
  };

  const goNext = () => setActiveStep((s) => Math.min(s + 1, 2));
  const goBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  if (cart.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyCartIcon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </div>
        <h2 className={styles.emptyCartTitle}>Your Cart is Empty</h2>
        <p className={styles.emptyCartText}>Looks like you haven&rsquo;t added anything yet.</p>
        <Link href="/shop" className={styles.emptyCartLink}>Explore the Collection</Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* ══ Checkout Header ══ */}
      <header className={styles.checkoutHeader}>
        <Link href="/" className={styles.checkoutLogo}>Conturelle</Link>
        <nav className={styles.stepper}>
          {STEPS.map((step, i) => (
            <button
              key={step}
              className={`${styles.step} ${i === activeStep ? styles.stepActive : ''} ${i < activeStep ? styles.stepDone : ''}`}
              onClick={() => i < activeStep && setActiveStep(i)}
            >
              <span className={styles.stepNumber}>{i < activeStep ? '\u2713' : i + 1}</span>
              <span className={styles.stepLabel}>{step}</span>
            </button>
          ))}
        </nav>
        <span className={styles.checkoutSecure}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
          Secure
        </span>
      </header>

      <div className={styles.checkout}>
        {/* ══ Main Form Area ══ */}
        <div className={styles.checkoutMain}>

          {/* Step 0: Information */}
          {activeStep === 0 && (
            <>
              {/* Express Checkout */}
              <div className={styles.expressSection}>
                <p className={styles.sectionLabel}>Express Checkout</p>
                <div className={styles.expressBtns}>
                  <button className={`${styles.expressBtn} ${styles.expressBtnDark}`}>
                    <span className={styles.expressBtnIcon}>S</span> Shop Pay
                  </button>
                  <div className={styles.expressRow}>
                    <button className={styles.expressBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                      Google Pay
                    </button>
                    <button className={styles.expressBtn}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" /></svg>
                      Apple Pay
                    </button>
                  </div>
                </div>

                <div className={styles.dividerOr}>
                  <span className={styles.dividerOrLine}></span>
                  <span className={styles.dividerOrText}>or continue below</span>
                  <span className={styles.dividerOrLine}></span>
                </div>
              </div>

              {/* Contact */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionHeading}>Contact Information</h2>
                  <p className={styles.sectionHint}>Already have an account? <a href="#" className={styles.sectionLink}>Log in</a></p>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    className={styles.formInput}
                    defaultValue="sophie.mueller@email.de"
                    placeholder="you@email.com"
                  />
                </div>
                <div className={styles.formCheckbox}>
                  <input type="checkbox" id="newsletter" defaultChecked />
                  <label htmlFor="newsletter">Keep me updated on new collections and exclusive offers</label>
                </div>
              </div>

              {/* Shipping Address */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionHeading}>Shipping Address</h2>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name</label>
                    <input className={styles.formInput} defaultValue="Sophie" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name</label>
                    <input className={styles.formInput} defaultValue={`M\u00FCller`} />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Street Address</label>
                  <input className={styles.formInput} defaultValue={`Friedrichstra\u00DFe 42`} />
                </div>
                <div className={styles.formGroup}>
                  <input className={styles.formInput} placeholder="Apartment, suite, etc. (optional)" />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>City</label>
                    <input className={styles.formInput} defaultValue="Berlin" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Postal Code</label>
                    <input className={styles.formInput} defaultValue="10117" />
                  </div>
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Country</label>
                    <input className={styles.formInput} defaultValue="Germany" />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone (optional)</label>
                    <input className={styles.formInput} defaultValue="+49 170 1234567" />
                  </div>
                </div>
              </div>

              <button className={styles.continueBtn} onClick={goNext}>
                Continue to Shipping
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </>
          )}

          {/* Step 1: Shipping */}
          {activeStep === 1 && (
            <>
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionHeading}>Shipping Method</h2>
                  <p className={styles.sectionHint}>All orders ship from our European warehouse</p>
                </div>
                <div
                  className={`${styles.shippingCard} ${shippingMethod === 'standard' ? styles.shippingCardSelected : ''}`}
                  onClick={() => setShippingMethod('standard')}
                >
                  <div className={styles.shippingCardLeft}>
                    <div className={styles.radioOuter}>
                      {shippingMethod === 'standard' && <span className={styles.radioInner} />}
                    </div>
                    <div>
                      <p className={styles.shippingCardName}>Standard Shipping</p>
                      <p className={styles.shippingCardMeta}>3&ndash;5 business days &middot; Tracked delivery</p>
                    </div>
                  </div>
                  <span className={styles.shippingCardPrice} style={{ color: 'var(--success)' }}>FREE</span>
                </div>
                <div
                  className={`${styles.shippingCard} ${shippingMethod === 'express' ? styles.shippingCardSelected : ''}`}
                  onClick={() => setShippingMethod('express')}
                >
                  <div className={styles.shippingCardLeft}>
                    <div className={styles.radioOuter}>
                      {shippingMethod === 'express' && <span className={styles.radioInner} />}
                    </div>
                    <div>
                      <p className={styles.shippingCardName}>Express Shipping</p>
                      <p className={styles.shippingCardMeta}>1&ndash;2 business days &middot; Priority handling</p>
                    </div>
                  </div>
                  <span className={styles.shippingCardPrice}>&euro;9.95</span>
                </div>
              </div>

              {/* Order Bumps */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionHeading}>Enhance Your Order</h2>
                </div>
                <label className={`${styles.bumpCard} ${bumpWashBag ? styles.bumpCardSelected : ''}`}>
                  <input
                    type="checkbox"
                    className={styles.bumpCheck}
                    checked={bumpWashBag}
                    onChange={(e) => setBumpWashBag(e.target.checked)}
                  />
                  <div className={styles.bumpImg}>
                    <Image src="/images/softtouch-1.jpg" alt="Lingerie Wash Bag" fill sizes="72px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.bumpInfo}>
                    <p className={styles.bumpName}>Lingerie Wash Bag</p>
                    <p className={styles.bumpDesc}>Extend the life of your Conturelle with our premium mesh wash bag.</p>
                  </div>
                  <span className={styles.bumpPrice}>&euro;4.95</span>
                </label>
                <label className={`${styles.bumpCard} ${bumpGiftWrap ? styles.bumpCardSelected : ''}`}>
                  <input
                    type="checkbox"
                    className={styles.bumpCheck}
                    checked={bumpGiftWrap}
                    onChange={(e) => setBumpGiftWrap(e.target.checked)}
                  />
                  <div className={styles.bumpImg}>
                    <Image src="/images/blossom-1.jpg" alt="Gift Wrapping" fill sizes="72px" style={{ objectFit: 'cover' }} />
                  </div>
                  <div className={styles.bumpInfo}>
                    <p className={styles.bumpName}>Gift Wrapping</p>
                    <p className={styles.bumpDesc}>Premium gift box with ribbon and personalized note card.</p>
                  </div>
                  <span className={styles.bumpPrice}>&euro;6.95</span>
                </label>
              </div>

              <div className={styles.stepNav}>
                <button className={styles.backBtn} onClick={goBack}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Back
                </button>
                <button className={styles.continueBtn} onClick={goNext}>
                  Continue to Payment
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </>
          )}

          {/* Step 2: Payment */}
          {activeStep === 2 && (
            <>
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionHeading}>Payment Method</h2>
                  <p className={styles.sectionHint}>All transactions are encrypted and secure</p>
                </div>

                <div
                  className={`${styles.paymentCard} ${paymentMethod === 'credit' ? styles.paymentCardSelected : ''}`}
                  onClick={() => setPaymentMethod('credit')}
                >
                  <div className={styles.paymentCardTop}>
                    <div className={styles.radioOuter}>
                      {paymentMethod === 'credit' && <span className={styles.radioInner} />}
                    </div>
                    <span className={styles.paymentCardName}>Credit / Debit Card</span>
                    <div className={styles.paymentCardLogos}>
                      <span className={styles.miniLogo}>Visa</span>
                      <span className={styles.miniLogo}>MC</span>
                      <span className={styles.miniLogo}>Amex</span>
                    </div>
                  </div>
                  {paymentMethod === 'credit' && (
                    <div className={styles.cardFields}>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Card Number</label>
                        <input className={styles.formInput} placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>Expiry</label>
                          <input className={styles.formInput} placeholder="MM / YY" />
                        </div>
                        <div className={styles.formGroup}>
                          <label className={styles.formLabel}>CVV</label>
                          <input className={styles.formInput} placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`${styles.paymentCard} ${paymentMethod === 'klarna' ? styles.paymentCardSelected : ''}`}
                  onClick={() => setPaymentMethod('klarna')}
                >
                  <div className={styles.paymentCardTop}>
                    <div className={styles.radioOuter}>
                      {paymentMethod === 'klarna' && <span className={styles.radioInner} />}
                    </div>
                    <span className={styles.paymentCardName}>Klarna &mdash; Pay in 4</span>
                    <span className={styles.paymentCardBadge}>4 &times; &euro;{klarnaInstallment}</span>
                  </div>
                </div>

                <div
                  className={`${styles.paymentCard} ${paymentMethod === 'paypal' ? styles.paymentCardSelected : ''}`}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div className={styles.paymentCardTop}>
                    <div className={styles.radioOuter}>
                      {paymentMethod === 'paypal' && <span className={styles.radioInner} />}
                    </div>
                    <span className={styles.paymentCardName}>PayPal</span>
                  </div>
                </div>
              </div>

              {/* Discount Code */}
              <div className={styles.formSection}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionHeading}>Discount Code</h2>
                </div>
                <div className={styles.discountRow}>
                  <input
                    className={styles.discountInput}
                    placeholder="Enter promo code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                  />
                  <button className={styles.discountBtn}>Apply</button>
                </div>
              </div>

              <div className={styles.stepNav}>
                <button className={styles.backBtn} onClick={goBack}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  Back
                </button>
                <button className={styles.completeBtn} onClick={handleCompleteOrder}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  Pay &euro;{total.toFixed(2)}
                </button>
              </div>
              <p className={styles.legalText}>
                By placing this order, you agree to our <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link>. Your payment information is encrypted and secure.
              </p>
            </>
          )}
        </div>

        {/* ══ Sidebar ══ */}
        <aside className={styles.sidebar}>
          {/* Mobile toggle */}
          <button className={styles.summaryToggle} onClick={() => setShowSummary(!showSummary)}>
            <span className={styles.summaryToggleLeft}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              {showSummary ? 'Hide' : 'Show'} order summary
            </span>
            <span className={styles.summaryTogglePrice}>&euro;{total.toFixed(2)}</span>
          </button>

          <div className={`${styles.sidebarInner} ${showSummary ? styles.sidebarInnerOpen : ''}`}>
            <h3 className={styles.sidebarTitle}>Order Summary</h3>

            <div className={styles.cartItems}>
              {cart.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.cartItemImg}>
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className={styles.cartItemQty}>{item.qty}</span>
                  </div>
                  <div className={styles.cartItemInfo}>
                    <p className={styles.cartItemName}>{item.name}</p>
                    <p className={styles.cartItemVariant}>
                      {item.bandSize && item.cupSize ? `${item.bandSize}${item.cupSize}` : item.bandSize || item.cupSize || ''}
                      {(item.bandSize || item.cupSize) && item.color ? ' \u00B7 ' : ''}
                      {item.color || ''}
                    </p>
                  </div>
                  <div className={styles.cartItemPrice}>
                    {item.originalPrice && item.originalPrice > item.price && (
                      <span className={styles.cartItemPriceOld}>&euro;{item.originalPrice.toFixed(2)}</span>
                    )}
                    <span>&euro;{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.summaryLines}>
              <div className={styles.summaryLine}>
                <span>Subtotal</span>
                <span>&euro;{cartSubtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryLine}>
                <span>Shipping</span>
                <span className={shippingCost === 0 ? styles.freeLabel : ''}>
                  {shippingCost === 0 ? 'FREE' : `\u20AC${shippingCost.toFixed(2)}`}
                </span>
              </div>
              {bumpTotal > 0 && (
                <div className={styles.summaryLine}>
                  <span>Add-ons</span>
                  <span>&euro;{bumpTotal.toFixed(2)}</span>
                </div>
              )}
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.totalLine}>
              <span>Total</span>
              <span className={styles.totalAmount}>&euro;{total.toFixed(2)}</span>
            </div>
            <p className={styles.bnplNote}>or 4 interest-free payments of &euro;{klarnaInstallment} with Klarna</p>

            <div className={styles.trustBlock}>
              <div className={styles.trustRow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                <span>256-bit SSL Encryption</span>
              </div>
              <div className={styles.trustRow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                <span>30-Day Money-Back Guarantee</span>
              </div>
              <div className={styles.trustRow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                <span>Secure Payment Processing</span>
              </div>
              <div className={styles.trustRow}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>
                <span>Made in Europe</span>
              </div>
            </div>

            <div className={styles.paymentIcons}>
              {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Klarna', 'Apple Pay', 'Google Pay'].map((p) => (
                <span key={p} className={styles.paymentIcon}>{p}</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
