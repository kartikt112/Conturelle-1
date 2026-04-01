'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import { products, bestsellerSlugs, categories } from '@/data/products';
import s from './page.module.css';

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const els = ref.current.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function HomePage() {
  const pageRef = useReveal();
  const bestsellers = bestsellerSlugs.map(slug => products.find(p => p.slug === slug)).filter(Boolean);

  return (
    <div ref={pageRef}>
      {/* ═══ 3. HERO ═══ */}
      <section className={s.hero}>
        <div className={s.heroStory}>
          <div className={s.heroStoryInner}>
            <div className={s.heroSeit}>
              <span className={s.heroSeitLine}></span>
              <span className={s.heroSeitText}>140 Years of German Precision</span>
            </div>
            <h1 className={s.heroHeadline}>
              Engineered for<br />the Way You <em>Move</em>
            </h1>
            <p className={s.heroBody}>
              80 pieces of precision engineering in every bra. Perfect fit guaranteed, made in Europe since 1885. Sizes 30–44, cups A–I.
            </p>
            <div className={s.heroCtaArea}>
              <Link href="/shop" className="cta-primary">
                Shop the Collection <span>→</span>
              </Link>
              <Link href="/#fit-finder" className="cta-secondary">
                Find Your Perfect Fit
              </Link>
            </div>
            <div className={s.heroMicroTrust}>
              <span className={s.heroMicroTrustItem}>
                <span className={s.heroMicroTrustIcon}>✓</span> Free Exchanges
              </span>
              <span className={s.heroMicroTrustItem}>
                <span className={s.heroMicroTrustIcon}>✓</span> Free Shipping €75+
              </span>
            </div>
          </div>
        </div>

        <div className={s.heroImage}>
          <Image src="/images/swing-1.jpg" alt="Model wearing Conturelle Swing collection" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} priority />
          <div className={s.heroImageTag}>
            <span className={s.heroImageTagDot}></span>
            <span className={s.heroImageTagText}>Swing Collection</span>
            <span className={s.heroImageTagPrice}>from €84</span>
          </div>
        </div>

        <div className={s.heroSidebar}>
          <div className={s.heroSidebarSection}>
            <p className={s.heroSidebarLabel}>Shop by Collection</p>
            <ul className={s.heroCollections}>
              {[
                { name: 'Pure Feeling', type: 'T-Shirt Bra', slug: 'pure-feeling-tshirt-bra' },
                { name: 'Mille Fleurs', type: 'Embroidered', slug: 'mille-fleurs-full-cup' },
                { name: 'Swing', type: 'Non-Wired', slug: 'swing-spacer-bra' },
                { name: 'Provence', type: '3D Spacer', slug: 'provence-3d-spacer' },
                { name: 'Soft Touch', type: 'Shaping', slug: 'soft-touch-shaping' },
              ].map((c) => (
                <li key={c.slug}>
                  <Link href={`/product/${c.slug}`}>
                    <span className={s.heroCollName}>{c.name}</span>
                    <span className={s.heroCollType}>{c.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={s.heroSidebarSection}>
            <p className={s.heroSidebarLabel}>Sizes Available</p>
            <div className={s.heroSizes}>
              {['30','32','34','36','38','40','42','44','A','B','C','D','E','F','G','H','I'].map(sz => (
                <button key={sz} className={s.heroSizeChip}>{sz}</button>
              ))}
            </div>
          </div>

          <div className={s.heroSidebarSection}>
            <div className={s.heroQuote}>
              <p className={s.heroQuoteStars}>★★★★★</p>
              <p className={s.heroQuoteText}>&ldquo;Finally, a bra that fits perfectly and looks beautiful. The Swing is my everyday go-to now.&rdquo;</p>
              <p className={s.heroQuoteAuthor}>— Sophie M., Size 75D</p>
              <p className={s.heroQuoteVerified}>✓ Verified Purchase</p>
            </div>
          </div>
        </div>

        <div className={s.heroBottom}>
          <span className={s.heroBottomItem}><span className={s.heroBottomIcon}>◆</span> 80 Components per Bra</span>
          <span className={s.heroBottomSep}></span>
          <span className={s.heroBottomItem}><span className={s.heroBottomIcon}>★</span> 140 Years German Engineering</span>
          <span className={s.heroBottomSep}></span>
          <span className={s.heroBottomItem}><span className={s.heroBottomIcon}>✈</span> Crafted in Europe</span>
          <span className={s.heroBottomSep}></span>
          <span className={s.heroBottomItem}><span className={s.heroBottomIcon}>★</span> 4.8/5 from 2,000+ Reviews</span>
        </div>
      </section>

      {/* ═══ 4. BRAG BAR ═══ */}
      <div className={`${s.bragBar} reveal`}>
        <div className={s.bragItem}>
          <span className={s.bragStars}>★★★★★</span>
          <span className={s.bragText}>Rated 4.8/5 by 2,000+ Women</span>
        </div>
        <span className={s.bragSeparator}>·</span>
        <div className={s.bragItem}>
          <span className={s.bragText}>Est. 1885 — 140 Years of Craft</span>
        </div>
        <span className={s.bragSeparator}>·</span>
        <div className={s.bragItem}>
          <span className={s.bragText}>OEKO-TEX® Certified · Made in Europe</span>
        </div>
      </div>

      {/* ═══ 5. CATEGORY TILES ═══ */}
      <section className={s.categories} id="categories">
        <div className={`${s.categoriesHeader} reveal`}>
          <div className="section-label">
            <span className="section-label__line"></span>
            <span className="section-label__text">Shop by Style</span>
          </div>
          <h2 className="section-heading">Find Your <em>Perfect Style</em></h2>
        </div>
        <div className={s.categoriesGrid}>
          {categories.map((cat, i) => (
            <Link href={cat.href} key={cat.name} className={`${s.categoryTile} reveal reveal-delay-${i + 1}`}>
              <div className={s.categoryTileBg}>
                <Image src={cat.image} alt={cat.name} fill style={{ objectFit: 'cover' }} />
              </div>
              <div className={s.categoryTileOverlay}></div>
              <span className={s.categoryTileName}>{cat.name}</span>
              {cat.badge && <span className={s.categoryTileBadge}>{cat.badge}</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ 6. HERITAGE ═══ */}
      <section className={s.heritage} id="heritage">
        <div className={s.heritageImage}>
          <Image src="/images/provence-2.jpg" alt="Conturelle craftsmanship" fill style={{ objectFit: 'cover', transform: 'scale(1.08)' }} />
          <span className={s.heritageImageCaption}>EST. 1885</span>
        </div>
        <div className={s.heritageContent}>
          <div className="section-label reveal">
            <span className="section-label__line"></span>
            <span className="section-label__text">The Conturelle Difference</span>
          </div>
          <h2 className={`section-heading reveal reveal-delay-1`}>
            140 Years<br />in the <em>Making</em>
          </h2>
          <p className={`${s.heritageText} reveal reveal-delay-2`}>
            Every Conturelle bra is assembled from up to 80 individual pieces — each one cut, sewn, and finished by skilled artisans in Europe. From the first thread of yarn to the finished product on your shoulders, we control every step. That&rsquo;s how we guarantee a fit no one else can.
          </p>
          <div className={`${s.heritageStats} reveal reveal-delay-3`}>
            <div><p className={s.heritageStatNumber}>80</p><p className={s.heritageStatLabel}>Pieces per Bra</p></div>
            <div><p className={s.heritageStatNumber}>140</p><p className={s.heritageStatLabel}>Years of Heritage</p></div>
            <div><p className={s.heritageStatNumber}>100%</p><p className={s.heritageStatLabel}>European Made</p></div>
          </div>
          <Link href="#" className={`${s.heritageLink} reveal reveal-delay-4`}>
            Discover Our Story <span>→</span>
          </Link>
        </div>
      </section>

      {/* ═══ 7. BESTSELLERS ═══ */}
      <section className={s.bestsellers} id="bestsellers">
        <div className={s.bestsellersHeader}>
          <div className={`${s.bestsellersHeaderLeft} reveal`}>
            <div className="section-label">
              <span className="section-label__line"></span>
              <span className="section-label__text">Our Bestsellers</span>
            </div>
            <h2 className="section-heading">Most Loved <em>This Season</em></h2>
            <p>The pieces our customers come back for, again and again.</p>
          </div>
          <Link href="/shop" className={`${s.bestsellersViewAll} reveal reveal-delay-2`}>
            View All <span>→</span>
          </Link>
        </div>
        <div className={s.bestsellersGrid}>
          {bestsellers.map((product, i) => (
            <div key={product.slug} className={`reveal reveal-delay-${i + 1}`}>
              <ProductCard product={product} showBadge showSwatches showRating showQuickAdd />
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 8. FEATURE STRIP ═══ */}
      <div className={s.featureStrip}>
        <div className={s.featureStripGrid}>
          {[
            { num: '01', title: 'European', em: 'Craft', text: 'Every bra assembled from up to 80 individual pieces by skilled European artisans. 140 years of perfecting the art of fit.' },
            { num: '02', title: 'Perfect', em: 'Fit', text: 'Our Fit Finder quiz matches your measurements to your ideal size. Sizes EU 70–100, cups B through G. No more guessing.' },
            { num: '03', title: 'Free', em: 'Returns', text: 'Not quite right? Return within 30 days, no questions asked. Free shipping on orders over €75. We make it easy.' },
            { num: '04', title: 'Yarn to', em: 'You', text: 'We control every step — from the first thread of premium European fabric to the finished product on your shoulders.' },
          ].map((f, i) => (
            <div key={f.num} className={`${s.featureItem} reveal reveal-delay-${i + 1}`}>
              <p className={s.featureNum}>{f.num} /</p>
              <p className={s.featureTitle}>{f.title} <em>{f.em}</em></p>
              <p className={s.featureText}>{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 9. FIT FINDER ═══ */}
      <section className={s.fitFinder} id="fit-finder">
        <div className={s.fitFinderContent}>
          <div className="section-label reveal" style={{ justifyContent: 'center' }}>
            <span className="section-label__line"></span>
            <span className="section-label__text">Reduce Returns. Build Confidence.</span>
          </div>
          <h2 className="section-heading reveal reveal-delay-1" style={{ color: 'var(--warm-white)', marginBottom: 20 }}>
            Find Your Perfect<br /><em>Fit</em>
          </h2>
          <p className={`${s.fitFinderSub} reveal reveal-delay-2`}>
            No measuring tape needed. Answer 4 quick questions and we&rsquo;ll recommend your ideal size and style.
          </p>
          <div className={`${s.fitFinderCtas} reveal reveal-delay-3`}>
            <Link href="#" className="cta-primary">Start the Fit Quiz <span>→</span></Link>
            <Link href="#" className="btn-ghost">View Size Guide</Link>
          </div>
          <p className={`${s.fitFinderTestimonial} reveal reveal-delay-4`}>
            &ldquo;This quiz got my size exactly right. First bra I haven&rsquo;t had to return.&rdquo; — Maria K.
          </p>
        </div>
      </section>

      {/* ═══ 10. UGC / REVIEWS ═══ */}
      <section className={s.ugcSection} id="reviews">
        <div className={s.ugcHeader}>
          <div className="reveal">
            <div className="section-label">
              <span className="section-label__line"></span>
              <span className="section-label__text">Real Women. Real Fit.</span>
            </div>
            <h2 className="section-heading">What Our <em>Customers</em> Say</h2>
          </div>
          <p className={`${s.ugcMeta} reveal reveal-delay-2`}>Tag @conturelle to be featured</p>
        </div>
        <div className={s.ugcGrid}>
          {[
            { img: '/images/swing-2.jpg', stars: '★★★★★', quote: 'Finally a bra that actually fits. The spacer cups are incredibly comfortable.', author: '— Sarah M., Size 80D' },
            { img: '/images/millefleurs-3.jpg', stars: '★★★★★', quote: 'The Mille Fleurs is gorgeous. Beautiful lace and the fit is perfect under anything.', author: '— Anna L., Size 75C' },
            { img: '/images/provence-3.jpg', stars: '★★★★★', quote: 'I\u2019ve been wearing Conturelle for 5 years. The quality is unmatched.', author: '— Julia K., Size 85E' },
            { img: '/images/purefeel-2.jpg', stars: '★★★★☆', quote: 'The Pure Feeling T-Shirt Bra is invisible under everything. So comfortable for all day.', author: '— Lena W., Size 80B' },
          ].map((review, i) => (
            <div key={i} className={`${s.ugcCard} reveal reveal-delay-${i + 1}`}>
              <div className={s.ugcCardPhoto}>
                <Image src={review.img} alt="Customer review" width={300} height={300} style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
              </div>
              <div className={s.ugcCardContent}>
                <p className={s.ugcCardStars}>{review.stars}</p>
                <p className={s.ugcCardQuote}>&ldquo;{review.quote}&rdquo;</p>
                <p className={s.ugcCardAuthor}>{review.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ 11. EMAIL CAPTURE ═══ */}
      <section className={s.emailCapture}>
        <div className="section-label reveal" style={{ justifyContent: 'center' }}>
          <span className="section-label__line"></span>
          <span className="section-label__text">Exclusive Offer</span>
        </div>
        <h2 className="section-heading reveal reveal-delay-1">Your First Fit<br />Is <em>On Us</em></h2>
        <p className={`${s.emailCaptureDesc} reveal reveal-delay-2`}>
          Get 10% off your first order + exclusive early access to new collections.
        </p>
        <form className={`${s.emailCaptureForm} reveal reveal-delay-3`} onSubmit={(e) => e.preventDefault()}>
          <input type="email" className={s.emailCaptureInput} placeholder="Enter your email" aria-label="Email address" />
          <button type="submit" className={s.emailCaptureSubmit}>Get 10% Off</button>
        </form>
        <p className={`${s.emailCapturePrivacy} reveal reveal-delay-4`}>No spam. Unsubscribe anytime. We respect your privacy.</p>
      </section>

      {/* ═══ 12. CAMPAIGN BANNER ═══ */}
      <section className={s.editorial}>
        <div className={s.editorialBg}>
          <Image src="/images/festival-1.jpg" alt="Conturelle Spring Collection" fill style={{ objectFit: 'cover', objectPosition: 'center 30%', transform: 'scale(1.08)' }} />
        </div>
        <div className={s.editorialOverlay}></div>
        <div className={`${s.editorialContent} reveal`}>
          <div className={s.editorialLine}></div>
          <p className={s.editorialEyebrow}>Spring Collection 2026</p>
          <p className={s.editorialStatement}>
            <strong>New</strong><br /><em>Arrivals</em>
          </p>
          <p className={s.editorialSub}>Fresh styles in the lightest European fabrics. Designed for warm days and effortless comfort.</p>
          <div className={s.editorialCtas}>
            <Link href="/shop?sort=newest" className="cta-primary">Shop New Arrivals <span>→</span></Link>
            <Link href="/shop?category=sale" className="btn-ghost" style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)' }}>Shop Sale — Up to 30% Off</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
