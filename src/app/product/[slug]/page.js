'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getProduct, getRelatedProducts, products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import Accordion from '@/components/Accordion';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';

const EU_TO_UK_BAND = { '70': '32', '75': '34', '80': '36', '85': '38', '90': '40', '95': '42', '100': '44' };
const EU_TO_UK_CUP = { 'B': 'B', 'C': 'C', 'D': 'D', 'E': 'DD', 'F': 'E', 'G': 'F' };

function Stars({ count, size = 13 }) {
  const full = Math.round(count);
  return (
    <span style={{ fontSize: size, letterSpacing: 1 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= full ? 'var(--gold)' : 'var(--border)' }}>&#9733;</span>
      ))}
    </span>
  );
}

export default function ProductPage() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const related = getRelatedProducts(slug, 4);
  const recentlyViewed = products.filter(p => p.slug !== slug).slice(0, 3);
  const { addToCart, openCart } = useCart();

  const [activeImage, setActiveImage] = useState(0);
  const [imgAspect, setImgAspect] = useState({ w: 3, h: 4 });
  const [activeColor, setActiveColor] = useState(0);
  const [selectedBand, setSelectedBand] = useState('80');
  const [selectedCup, setSelectedCup] = useState('D');
  const [sizeSystem, setSizeSystem] = useState('EU');
  const [stickyVisible, setStickyVisible] = useState(false);
  const [activeReviewFilter, setActiveReviewFilter] = useState('All');
  const [crossSellSizes, setCrossSellSizes] = useState({});
  const [bundleSize, setBundleSize] = useState('M');

  const atcRef = useRef(null);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(0);
      setImgAspect({ w: 3, h: 4 });
      setActiveColor(0);
      setSelectedBand(product.bandSizes?.[2] || product.bandSizes?.[0] || '');
      setSelectedCup(product.cupSizes?.[2] || product.cupSizes?.[0] || '');
    }
  }, [product]);

  // Reset aspect when active image changes (show default while loading)
  useEffect(() => {
    setImgAspect({ w: 3, h: 4 });
  }, [activeImage]);

  // Sticky ATC bar observer
  useEffect(() => {
    if (!atcRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(atcRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    addToCart({
      slug: product.slug,
      name: product.name,
      image: product.images[activeImage],
      price: product.salePrice || product.price,
      originalPrice: product.salePrice ? product.price : undefined,
      color: product.colors[activeColor]?.name,
      bandSize: selectedBand,
      cupSize: selectedCup,
    });
    openCart();
  }, [product, activeImage, activeColor, selectedBand, selectedCup, addToCart, openCart]);

  const handleCrossSellAdd = useCallback((item, idx) => {
    const size = crossSellSizes[idx] || item.sizes?.[1] || item.sizes?.[0];
    addToCart({
      slug: `${slug}-crosssell-${idx}`,
      name: item.name,
      image: item.image,
      price: item.price,
      color: product.colors[activeColor]?.name,
      bandSize: size,
      cupSize: '',
    });
    openCart();
  }, [crossSellSizes, slug, product, activeColor, addToCart, openCart]);

  const handleBundleAdd = useCallback(() => {
    if (!product) return;
    addToCart({
      slug: `${slug}-bundle`,
      name: product.bundle.name,
      image: product.images[0],
      price: product.bundle.salePrice,
      originalPrice: product.bundle.originalPrice,
      color: product.colors[activeColor]?.name,
      bandSize: selectedBand + selectedCup,
      cupSize: bundleSize,
    });
    openCart();
  }, [product, slug, activeColor, selectedBand, selectedCup, bundleSize, addToCart, openCart]);

  const scrollToReviews = useCallback(() => {
    document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  if (!product) {
    return (
      <div style={{ padding: '200px 5%', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 32, marginBottom: 16 }}>Product Not Found</h1>
        <Link href="/" style={{ color: 'var(--gold)' }}>Return to Home</Link>
      </div>
    );
  }

  const displayPrice = product.salePrice || product.price;
  const hasSale = product.salePrice && product.salePrice < product.price;

  const bandSizesDisplay = sizeSystem === 'EU'
    ? product.bandSizes
    : product.bandSizes.map(s => EU_TO_UK_BAND[s] || s);

  const cupSizesDisplay = sizeSystem === 'EU'
    ? product.cupSizes
    : product.cupSizes.map(s => EU_TO_UK_CUP[s] || s);

  const selectedBandDisplay = sizeSystem === 'EU' ? selectedBand : (EU_TO_UK_BAND[selectedBand] || selectedBand);
  const selectedCupDisplay = sizeSystem === 'EU' ? selectedCup : (EU_TO_UK_CUP[selectedCup] || selectedCup);

  const allImages = product.images;

  return (
    <>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>Home</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href="/" className={styles.breadcrumbLink}>{product.collection || 'Spacer Bras'}</Link>
        <span className={styles.breadcrumbSep}>/</span>
        {product.name}
      </div>

      {/* PDP Grid */}
      <section className={styles.pdp}>
        {/* Thumbnails */}
        <div className={styles.thumbs}>
          {allImages.map((img, i) => (
            <div
              key={i}
              className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
              onClick={() => setActiveImage(i)}
            >
              <Image src={img} alt={`View ${i + 1}`} fill sizes="56px" style={{ objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* Main Image */}
        <div
          className={styles.mainImage}
          style={{ aspectRatio: `${imgAspect.w} / ${imgAspect.h}` }}
        >
          {hasSale && <span className={styles.badge}>-{product.discount}%</span>}
          <Image
            src={allImages[activeImage] || product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            className={styles.mainImageImg}
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.target;
              if (naturalWidth > 0 && naturalHeight > 0) {
                setImgAspect({ w: naturalWidth, h: naturalHeight });
              }
            }}
          />
        </div>

        {/* Buy Box */}
        <div className={styles.buybox}>
          <p className={styles.brand}>Conturelle</p>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.subtitle}>{product.subtitle}</p>

          <div className={styles.rating} onClick={scrollToReviews}>
            <Stars count={product.rating} />
            <span className={styles.ratingText}>{product.rating} ({product.reviewCount} reviews)</span>
          </div>

          <div className={styles.priceRow}>
            {hasSale && <span className={styles.priceOriginal}>&euro;{product.price.toFixed(2)}</span>}
            <span className={hasSale ? styles.priceSale : styles.priceRegular}>
              &euro;{displayPrice.toFixed(2)}
            </span>
            {hasSale && <span className={styles.priceBadge}>-{product.discount}%</span>}
          </div>
          <p className={styles.bnpl}>
            or {product.bnpl.installments} &times; &euro;{product.bnpl.amount.toFixed(2)} with Klarna
          </p>

          <div className={styles.divider} />

          {/* Color Swatches */}
          <p className={styles.optionLabel}>
            Color: <strong className={styles.optionLabelStrong}>{product.colors[activeColor]?.name}</strong>
          </p>
          <div className={styles.swatches}>
            {product.colors.map((color, i) => (
              <span
                key={color.name}
                className={`${styles.swatch} ${i === activeColor ? styles.swatchActive : ''}`}
                style={{ background: color.hex }}
                title={color.name}
                onClick={() => setActiveColor(i)}
              />
            ))}
          </div>

          <div className={styles.divider} />

          {/* Band Size */}
          <p className={styles.optionLabel}>Band Size ({sizeSystem}):</p>
          <div className={styles.sizes}>
            {product.bandSizes.map((size, i) => {
              const isOos = product.oosVariants.includes(size);
              const display = bandSizesDisplay[i];
              return (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedBand === size ? styles.sizeBtnSelected : ''} ${isOos ? styles.sizeBtnOos : ''}`}
                  onClick={() => !isOos && setSelectedBand(size)}
                  disabled={isOos}
                >
                  {display}
                </button>
              );
            })}
          </div>

          {/* Cup Size */}
          <p className={styles.optionLabel}>Cup Size:</p>
          <div className={styles.sizes}>
            {product.cupSizes.map((size, i) => {
              const display = cupSizesDisplay[i];
              return (
                <button
                  key={size}
                  className={`${styles.sizeBtn} ${selectedCup === size ? styles.sizeBtnSelected : ''}`}
                  onClick={() => setSelectedCup(size)}
                >
                  {display}
                </button>
              );
            })}
          </div>

          {/* EU/UK Toggle */}
          <div className={styles.sizeToggle}>
            <button
              className={`${styles.sizeToggleBtn} ${sizeSystem === 'EU' ? styles.sizeToggleBtnActive : ''}`}
              onClick={() => setSizeSystem('EU')}
            >
              EU
            </button>
            <button
              className={`${styles.sizeToggleBtn} ${sizeSystem === 'UK' ? styles.sizeToggleBtnActive : ''}`}
              onClick={() => setSizeSystem('UK')}
            >
              UK
            </button>
          </div>

          <a href="#" className={styles.fitLink}>
            &#9432; Find Your Size &mdash; Take the 60-Second Fit Quiz &rarr;
          </a>

          {/* Scarcity */}
          {product.scarcity && (
            <p className={styles.scarcity}>
              &#9888; Only {product.scarcity.qty} left in {product.scarcity.size}
            </p>
          )}

          {/* ATC Button */}
          <button className={styles.atc} onClick={handleAddToCart} ref={atcRef}>
            Add to Cart &mdash; &euro;{displayPrice.toFixed(2)}
          </button>

          {/* Trust Signals */}
          <div className={styles.trust}>
            <span className={styles.trustItem}>
              <span className={styles.trustIcon}>&#10003;</span> Free shipping over &euro;75
            </span>
            <span className={styles.trustItem}>
              <span className={styles.trustIcon}>&#10003;</span> 30-day hassle-free returns
            </span>
            <span className={styles.trustItem}>
              <span className={styles.trustIcon}>&#128274;</span> Secure checkout
            </span>
          </div>
        </div>
      </section>

      {/* Quick Benefits */}
      <div className={styles.benefits}>
        {product.benefits.map((b, i) => (
          <div key={i} className={styles.benefit}>
            <span className={styles.benefitIcon}>&#10003;</span> {b}
          </div>
        ))}
      </div>

      {/* Accordions */}
      <div className={styles.accordions}>
        <Accordion title="Details">
          <div className={styles.accordionContent}>
            <p><strong>Style:</strong> {product.details.style}</p>
            <p>{product.details.description}</p>
          </div>
        </Accordion>

        <Accordion title="Materials & Care">
          <div className={styles.accordionContent}>
            <p>
              <strong>Composition:</strong> {product.materials.composition}
              <br />
              <strong>Cup lining:</strong> {product.materials.cupLining}
            </p>
            <ul>
              {product.materials.care.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </Accordion>

        <Accordion title="Shipping & Returns">
          <div className={styles.accordionContent}>
            <p><strong>Shipping:</strong></p>
            <ul>
              <li>Free standard shipping on orders over &euro;75</li>
              <li>Standard delivery: 3&ndash;5 business days (EU)</li>
              <li>Express delivery: 1&ndash;2 business days (+&euro;9.95)</li>
            </ul>
            <p><strong>Returns:</strong></p>
            <ul>
              <li>30-day hassle-free returns</li>
              <li>Free return shipping within EU</li>
              <li>Items must be unworn with tags attached</li>
              <li>Refund processed within 5 business days</li>
            </ul>
          </div>
        </Accordion>

        <Accordion title="The Craft Behind This Piece">
          <div className={styles.accordionContent}>
            <p>
              This bra is assembled from 80 individual components &mdash; each one precision-cut, sewn,
              and finished by skilled artisans at our European production facilities.
            </p>
            <p>
              From the yarn selection to the final quality inspection, we control every step of the
              supply chain. This is how we&rsquo;ve been guaranteeing perfect fit for 140 years.
            </p>
            <p><Link href="/#heritage" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Discover Our Heritage &rarr;</Link></p>
          </div>
        </Accordion>
      </div>

      {/* Complete the Look */}
      {product.crossSell && product.crossSell.length > 0 && (
        <div className={styles.crossSell}>
          <h2 className={styles.crossSellTitle}>Complete the Look</h2>
          <p className={styles.crossSellSubtitle}>Pair it with the matching brief for a seamless set</p>

          <div className={styles.crossSellGrid}>
            {product.crossSell.map((item, idx) => (
              <div key={idx} className={styles.crossSellCard}>
                <div className={styles.crossSellCardImg}>
                  <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, 400px" style={{ objectFit: 'cover' }} />
                </div>
                <p className={styles.crossSellCardName}>{item.name}</p>
                <div className={styles.crossSellCardSwatches}>
                  {product.colors.slice(0, 2).map((c, ci) => (
                    <span
                      key={ci}
                      className={`${styles.crossSellMiniSwatch} ${ci === 0 ? styles.crossSellMiniSwatchActive : ''}`}
                      style={{ background: c.hex }}
                    />
                  ))}
                </div>
                <p className={styles.crossSellCardPrice}>&euro;{item.price.toFixed(2)}</p>
                <div className={styles.crossSellCardSizes}>
                  {item.sizes.map(s => (
                    <button
                      key={s}
                      className={`${styles.crossSellSizeBtn} ${(crossSellSizes[idx] || (s === 'M' ? 'M' : '')) === s ? styles.crossSellSizeBtnSelected : ''}`}
                      onClick={() => setCrossSellSizes(prev => ({ ...prev, [idx]: s }))}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <button className={styles.crossSellAddBtn} onClick={() => handleCrossSellAdd(item, idx)}>
                  + Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* Bundle */}
          {product.bundle && (
            <div className={styles.bundle}>
              <p className={styles.bundleBadge}>&#127873; Bundle &amp; Save {product.bundle.discount}%</p>
              <p className={styles.bundleItems}>{product.name} + Matching Brief</p>
              <div className={styles.bundlePriceRow}>
                <span className={styles.bundlePriceOriginal}>&euro;{product.bundle.originalPrice.toFixed(2)}</span>
                <span className={styles.bundlePriceSale}>&euro;{product.bundle.salePrice.toFixed(2)}</span>
              </div>
              <p className={styles.bundleSavings}>You save: &euro;{product.bundle.savings.toFixed(2)}</p>
              <div className={styles.bundleSizes}>
                <span className={styles.bundleSizesLabel}>Brief size:</span>
                {['S', 'M', 'L', 'XL'].map(s => (
                  <button
                    key={s}
                    className={`${styles.crossSellSizeBtn} ${bundleSize === s ? styles.crossSellSizeBtnSelected : ''}`}
                    onClick={() => setBundleSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button className={styles.bundleAtc} onClick={handleBundleAdd}>
                Add Set to Cart
              </button>
            </div>
          )}
        </div>
      )}

      {/* You May Also Love */}
      <div className={styles.upsell}>
        <div className={styles.upsellHeader}>
          <h2 className={styles.upsellTitle}>You May Also Love</h2>
        </div>
        <div className={styles.upsellGrid}>
          {related.map(p => (
            <div key={p.slug} className={styles.upsellCardWrap}>
              <ProductCard
                product={{ ...p, image: p.images[0] }}
                showQuickAdd={false}
                showSwatches={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews */}
      <section className={styles.reviews} id="reviews-section">
        <div className={styles.reviewsHeader}>
          <div className={styles.reviewsOverall}>
            <p className={styles.reviewsOverallStars}>
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ color: i <= Math.round(product.rating) ? 'var(--gold)' : 'var(--border)' }}>&#9733;</span>
              ))}
            </p>
            <p className={styles.reviewsOverallText}>{product.rating} out of 5</p>
            <p className={styles.reviewsOverallCount}>{product.reviewCount} reviews</p>
          </div>
          <div className={styles.reviewsBars}>
            {[5, 4, 3, 2, 1].map(star => (
              <div key={star} className={styles.reviewsBarRow}>
                <span className={styles.reviewsBarLabel}>{star}&#9733;</span>
                <div className={styles.reviewsBar}>
                  <div
                    className={styles.reviewsBarFill}
                    style={{ width: `${product.ratingBreakdown[star]}%` }}
                  />
                </div>
                <span className={styles.reviewsBarPct}>{product.ratingBreakdown[star]}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fit Feedback */}
        <p className={styles.fitFeedbackLabel}>Fit Feedback:</p>
        <div className={styles.reviewsFit}>
          {['Runs Small', 'True to Size', 'Runs Large'].map(label => (
            <span
              key={label}
              className={`${styles.reviewsFitChip} ${label === 'True to Size' ? styles.reviewsFitChipActive : ''}`}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Filter chips */}
        <div className={styles.reviewsFilters}>
          {['All', 'Photos', '5\u2605', '4\u2605', '3\u2605'].map(f => (
            <button
              key={f}
              className={`${styles.reviewsFilter} ${activeReviewFilter === f ? styles.reviewsFilterActive : ''}`}
              onClick={() => setActiveReviewFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Review Cards */}
        {product.reviews.map((review, i) => (
          <div key={i} className={styles.reviewCard}>
            <div className={styles.reviewCardTop}>
              <span className={styles.reviewCardStars}>
                {[1, 2, 3, 4, 5].map(s => (
                  <span key={s} style={{ color: s <= review.stars ? 'var(--gold)' : 'var(--border)' }}>&#9733;</span>
                ))}
              </span>
              <span className={styles.reviewCardAuthor}>{review.author}</span>
            </div>
            <p className={styles.reviewCardMeta}>
              Verified Buyer &middot; {review.size} &middot; {review.date}
            </p>
            <p className={styles.reviewCardText}>
              &ldquo;{review.text}&rdquo;
            </p>
            <div className={styles.reviewCardTags}>
              <span>Fit: {review.fit}</span>
              <span>Recommend: {review.recommend ? 'Yes' : 'No'} {review.recommend && <>&#10003;</>}</span>
            </div>
            <div className={styles.reviewCardHelpful}>
              Helpful?{' '}
              <button className={styles.reviewCardHelpfulBtn}>&#128077; {review.helpful}</button>
              <button className={styles.reviewCardHelpfulBtn}>&#128078; 0</button>
            </div>
          </div>
        ))}

        <div className={styles.reviewsActions}>
          <button className={`${styles.reviewsBtn} ${styles.reviewsBtnLoad}`}>Load More Reviews</button>
          <button className={`${styles.reviewsBtn} ${styles.reviewsBtnWrite}`}>Write a Review</button>
        </div>
      </section>

      {/* Recently Viewed */}
      <div className={styles.recently}>
        <h3 className={styles.recentlyTitle}>Recently Viewed</h3>
        <div className={styles.recentlyGrid}>
          {recentlyViewed.map(p => (
            <Link key={p.slug} href={`/product/${p.slug}`} style={{ textDecoration: 'none' }}>
              <div className={styles.recentlyCard}>
                <div className={styles.recentlyCardImg}>
                  <Image src={p.images[0]} alt={p.name} fill sizes="180px" style={{ objectFit: 'cover' }} />
                </div>
                <p className={styles.recentlyCardName}>{p.name}</p>
                <p className={styles.recentlyCardPrice}>&euro;{(p.salePrice || p.price).toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Sticky ATC Bar (mobile) */}
      <div className={`${styles.stickyAtc} ${stickyVisible ? styles.stickyAtcVisible : ''}`}>
        <div className={styles.stickyAtcInfo}>
          <p className={styles.stickyAtcName}>{product.name}</p>
          <p className={styles.stickyAtcVariant}>
            {selectedBandDisplay}{selectedCupDisplay} &middot; {product.colors[activeColor]?.name}
          </p>
        </div>
        <span className={styles.stickyAtcPrice}>&euro;{displayPrice.toFixed(2)}</span>
        <button className={styles.stickyAtcBtn} onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </>
  );
}
