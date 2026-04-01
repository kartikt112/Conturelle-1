'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  const handleAddToCart = (item) => {
    addToCart({
      slug: item.slug,
      name: item.name,
      image: item.image,
      price: item.salePrice || item.price,
      originalPrice: item.salePrice ? item.price : undefined,
      color: '',
      bandSize: '',
      cupSize: '',
    });
    openCart();
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Your Wishlist</h1>
        <p className={styles.subtitle}>
          {wishlist.length === 0
            ? 'Save your favourite pieces for later.'
            : `${wishlist.length} ${wishlist.length === 1 ? 'piece' : 'pieces'} saved`}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className={styles.emptyText}>Your wishlist is empty</p>
          <p className={styles.emptyHint}>Browse our collection and tap the heart to save pieces you love.</p>
          <Link href="/shop" className={styles.emptyBtn}>Explore the Collection</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {wishlist.map((item) => (
            <div key={item.slug} className={styles.card}>
              <Link href={`/product/${item.slug}`} className={styles.cardImgLink}>
                <div className={styles.cardImg}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </Link>
              <button
                className={styles.removeBtn}
                onClick={() => removeFromWishlist(item.slug)}
                aria-label="Remove from wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 4L20 20M20 4L4 20" strokeLinecap="round" />
                </svg>
              </button>
              <div className={styles.cardInfo}>
                <Link href={`/product/${item.slug}`} className={styles.cardName}>{item.name}</Link>
                <div className={styles.cardPriceRow}>
                  {item.salePrice && item.salePrice < item.price ? (
                    <>
                      <span className={styles.cardPriceOld}>&euro;{item.price.toFixed(2)}</span>
                      <span className={styles.cardPriceSale}>&euro;{item.salePrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <span className={styles.cardPrice}>&euro;{item.price.toFixed(2)}</span>
                  )}
                </div>
                <button className={styles.addToCartBtn} onClick={() => handleAddToCart(item)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
