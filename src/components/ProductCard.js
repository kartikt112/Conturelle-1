'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import styles from './ProductCard.module.css';

const defaultBandSizes = ['70', '75', '80', '85', '90'];
const defaultCupSizes = ['B', 'C', 'D', 'E', 'F'];

function StarRating({ rating = 0, count = 0 }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>
        &#9733;
      </span>
    );
  }
  return (
    <span className={styles.rating}>
      {stars}
      {count > 0 && <span className={styles.reviewCount}>({count})</span>}
    </span>
  );
}

export default function ProductCard({
  product,
  showBadge = true,
  showSwatches = true,
  showRating = true,
  showQuickAdd = true,
}) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const wishlisted = isInWishlist(product.slug);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [selectedBand, setSelectedBand] = useState('');
  const [selectedCup, setSelectedCup] = useState('');
  const [activeColor, setActiveColor] = useState(product.colors?.[0]?.name || '');

  const handleQuickAdd = useCallback(() => {
    setQuickAddOpen(true);
  }, []);

  const handleAddToCart = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!selectedBand || !selectedCup) return;
      addToCart({
        slug: product.slug,
        name: product.name,
        image: product.images?.[0] || product.image,
        price: product.salePrice || product.price,
        originalPrice: product.salePrice ? product.price : undefined,
        color: activeColor,
        bandSize: selectedBand,
        cupSize: selectedCup,
        qty: 1,
      });
      setQuickAddOpen(false);
      setSelectedBand('');
      setSelectedCup('');
    },
    [addToCart, product, selectedBand, selectedCup, activeColor]
  );

  const badge = product.badge;
  const hasSale = product.salePrice && product.salePrice < product.price;

  return (
    <div className={styles.card}>
      <Link href={`/product/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <Image
            src={product.images?.[0] || product.image || '/images/swing-1.jpg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className={styles.image}
          />

          {/* Wishlist Heart */}
          <button
            className={`${styles.wishlistHeart} ${wishlisted ? styles.wishlistHeartActive : ''}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({
                slug: product.slug,
                name: product.name,
                image: product.images?.[0] || product.image,
                price: product.price,
                salePrice: product.salePrice,
              });
            }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Badge */}
          {showBadge && badge && (
            <span
              className={`${styles.badge} ${
                badge === 'Bestseller' ? styles.badgeBestseller : styles.badgeNew
              }`}
            >
              {badge}
            </span>
          )}

          {/* Quick Add Overlay */}
          {showQuickAdd && !quickAddOpen && (
            <button
              className={styles.quickAddOverlay}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleQuickAdd();
              }}
            >
              Quick Add
            </button>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className={styles.info}>
        {product.collection && (
          <span className={styles.collection}>{product.collection}</span>
        )}
        <Link href={`/product/${product.slug}`} className={styles.name}>
          {product.name}
        </Link>
        <div className={styles.priceRow}>
          <div className={styles.prices}>
            <span className={hasSale ? styles.salePrice : styles.price}>
              &euro;{(product.salePrice || product.price).toFixed(2)}
            </span>
            {hasSale && (
              <span className={styles.originalPrice}>
                &euro;{product.price.toFixed(2)}
              </span>
            )}
          </div>
          {showRating && product.rating && (
            <StarRating rating={product.rating} count={product.reviewCount} />
          )}
        </div>

        {/* Color Swatches */}
        {showSwatches && product.colors && product.colors.length > 0 && (
          <div className={styles.swatches}>
            {product.colors.map((color) => (
              <button
                key={color.name}
                className={`${styles.swatch} ${activeColor === color.name ? styles.swatchActive : ''}`}
                style={{ background: color.hex }}
                onClick={() => setActiveColor(color.name)}
                aria-label={color.name}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Add Panel */}
      {showQuickAdd && quickAddOpen && (
        <div className={styles.quickAddPanel} onClick={(e) => e.stopPropagation()}>
          <div className={styles.sizeSection}>
            <span className={styles.sizeLabel}>Band</span>
            <div className={styles.sizeButtons}>
              {(product.bandSizes || defaultBandSizes).map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedBand === size ? styles.sizeBtnActive : ''}`}
                  onClick={() => setSelectedBand(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.sizeSection}>
            <span className={styles.sizeLabel}>Cup</span>
            <div className={styles.sizeButtons}>
              {(product.cupSizes || defaultCupSizes).map((size) => (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedCup === size ? styles.sizeBtnActive : ''}`}
                  onClick={() => setSelectedCup(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <button
            className={styles.addToCartBtn}
            onClick={handleAddToCart}
            disabled={!selectedBand || !selectedCup}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
