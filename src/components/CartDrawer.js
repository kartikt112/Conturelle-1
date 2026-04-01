'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';

const upsellProducts = [
  {
    name: 'Silk Wash Bag',
    price: 12,
    image: '/images/upsell-washbag.jpg',
    slug: 'silk-wash-bag',
  },
  {
    name: 'Bra Extender Set',
    price: 8,
    image: '/images/upsell-extender.jpg',
    slug: 'bra-extender-set',
  },
];

export default function CartDrawer() {
  const {
    cart, cartCount, cartSubtotal, isCartOpen, closeCart,
    removeFromCart, updateQuantity,
    shippingThreshold, amountToFreeShipping, hasFreeShipping, shippingProgress,
  } = useCart();

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const shippingCost = hasFreeShipping ? 0 : 5.95;
  const total = cartSubtotal + shippingCost;

  return (
    <div className={styles.overlay} onClick={closeCart}>
      <div className={styles.drawer} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Your Cart ({cartCount})</h2>
          <button className={styles.closeBtn} onClick={closeCart} aria-label="Close cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 4L20 20M20 4L4 20" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Shipping Progress */}
        <div className={styles.shippingBar}>
          {hasFreeShipping ? (
            <p className={styles.shippingText}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              You qualify for free shipping!
            </p>
          ) : (
            <p className={styles.shippingText}>
              Add &euro;{amountToFreeShipping.toFixed(2)} more for free shipping
            </p>
          )}
          <div className={styles.progressTrack}>
            <div
              className={`${styles.progressFill} ${hasFreeShipping ? styles.progressComplete : ''}`}
              style={{ width: `${shippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items */}
        <div className={styles.items}>
          {cart.length === 0 ? (
            <div className={styles.empty}>
              <p className={styles.emptyText}>Your cart is empty</p>
              <button className={styles.continueShopping} onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <Image
                      src={item.image || '/images/swing-1.jpg'}
                      alt={item.name}
                      fill
                      sizes="110px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className={styles.itemDetails}>
                    <h4 className={styles.itemName}>{item.name}</h4>
                    <p className={styles.itemVariant}>
                      {item.bandSize && item.cupSize
                        ? `${item.bandSize}${item.cupSize}`
                        : ''}
                      {item.color ? ` \u00B7 ${item.color}` : ''}
                    </p>
                    <div className={styles.itemPriceRow}>
                      <span className={styles.itemPrice}>&euro;{item.price.toFixed(2)}</span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className={styles.itemOriginalPrice}>&euro;{item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.qtyControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          aria-label="Decrease quantity"
                        >
                          &minus;
                        </button>
                        <span className={styles.qtyValue}>{item.qty}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upsell Section */}
              <div className={styles.upsell}>
                <h4 className={styles.upsellTitle}>Complete Your Order</h4>
                <div className={styles.upsellCards}>
                  {upsellProducts.map((product) => (
                    <div key={product.slug} className={styles.upsellCard}>
                      <div className={styles.upsellImage}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                      <div className={styles.upsellInfo}>
                        <span className={styles.upsellName}>{product.name}</span>
                        <span className={styles.upsellPrice}>&euro;{product.price.toFixed(2)}</span>
                      </div>
                      <button className={styles.upsellAdd}>Add</button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>&euro;{cartSubtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{hasFreeShipping ? 'Free' : `\u20AC${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>&euro;{total.toFixed(2)}</span>
            </div>
            <p className={styles.klarna}>
              Or 4 interest-free payments of &euro;{(total / 4).toFixed(2)} with Klarna
            </p>
            <Link href="/checkout" className={styles.checkoutBtn} onClick={closeCart}>
              Checkout
            </Link>
            <button className={styles.continueBtn} onClick={closeCart}>
              Continue Shopping
            </button>
            <p className={styles.trustText}>
              Secure checkout &middot; Free returns within 30 days
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
