# Conturelle by Felina — CRO Implementation Guide
## Mapping Wireframe to Velour Template (luxury-lingerie-boutique)

**Template:** `luxury-lingerie-boutique-websi` (Omma-generated, single-page HTML)  
**Target Brand:** Conturelle by Felina (European Lingerie Group)  
**Current Audit Score:** 28/100 → Target: 85+/100  
**Date:** April 2026

---

## How This Document Works

The Velour template provides a premium dark-mode luxury aesthetic with editorial layout, silk canvas animations, custom cursor, 3D product card tilts, and scroll-reveal effects. This document maps each existing template section to Conturelle's CRO requirements, details exactly what changes, and identifies new sections that must be injected into the template.

**Section Status Key:**
- `REBRAND` — Section exists in template, needs content/copy swap
- `MODIFY` — Section exists but needs structural changes for CRO
- `NEW` — Section doesn't exist in template, must be built and injected
- `REMOVE` — Section exists but should be removed or replaced

---

## Design System Overrides

### Brand Swap: Velour → Conturelle

| Element | Velour (Current) | Conturelle (Target) |
|---------|-----------------|-------------------|
| Brand Name | Velour | Conturelle |
| Tagline | "Intimate Luxury" | "Engineered for the Way You Move" |
| Sub-tagline | "Crafted for the skin, remembered by the soul" | "140 Years of German Precision. Perfect Fit." |
| Origin | Paris, France | European Lingerie Group (Germany) |
| Heritage | "Since MCMXCVIII" (1998) | "Est. 1885 — 140 Years" |
| Price Range | €190–€890 (ultra-luxury) | €35–€95 (premium accessible) |
| Tone | Seductive, exclusive, French couture | Confident, warm, engineering-proud, accessible luxury |

### CSS Variable Updates

The template's existing `:root` palette is already close to what Conturelle needs. Make these adjustments:

```css
:root {
  --rose: #c9a89a;        /* KEEP — warm, premium */
  --burgundy: #4a1825;    /* KEEP — accent depth */
  --terracotta: #b5614a;  /* KEEP — warm accent for badges/eyebrows */
  --cream: #f5efe8;       /* KEEP — primary text on dark */
  --dust: #d4bfb0;        /* KEEP — muted text */
  --gold: #c9a96e;        /* KEEP — CTA borders, accents */
  --dark: #1a0f0d;        /* KEEP — body background */
  --mid: #2e1a14;         /* KEEP — card/section backgrounds */
  
  /* NEW — Conturelle additions */
  --sale-red: #B5484A;    /* muted red for sale badges */
  --star-gold: #D4A017;   /* review stars */
  --success: #4A7C59;     /* stock/trust signals */
  --oos-gray: #666;       /* out-of-stock indicator */
}
```

### Typography — KEEP AS-IS

The template's font pairing is excellent for this use case:
- **Cormorant Garamond** (serif) — headlines, product names, stats → conveys heritage
- **Space Grotesk** (sans-serif) — body, UI elements, captions → clean, modern readability

No font changes needed. This pairing already matches the wireframe's recommendation.

### Template Features Assessment

| Feature | Keep/Remove | Reasoning |
|---------|-------------|-----------|
| Custom cursor (gold dot + ring) | `REMOVE` | Breaks mobile, adds JS overhead, confuses older demographic |
| Silk canvas animation | `KEEP (reduce opacity)` | Premium ambient texture, low performance impact if throttled |
| Product card 3D tilt | `KEEP` | Delightful hover state, desktop-only, lightweight |
| Scroll-reveal animations | `KEEP` | Standard CRO pattern, improves perceived quality |
| Count-up stat animation | `KEEP` | Good for heritage stats section |
| Parallax hero content | `KEEP (subtle)` | Keep at 0.15 multiplier instead of 0.25 to reduce motion sickness |
| Lace corner SVG | `KEEP` | Subtle brand texture, zero performance cost |

**Custom Cursor Removal:**
```css
/* REMOVE these rules */
body { cursor: none; }  /* → change to: cursor: default; */
.cursor { ... }         /* → delete entirely */
.cursor-ring { ... }    /* → delete entirely */
.product-card { cursor: none; }  /* → change to: cursor: pointer; */
```
```html
<!-- REMOVE these elements -->
<div class="cursor" id="cursor"></div>
<div class="cursor-ring" id="cursorRing"></div>
```
```javascript
// REMOVE the entire cursor JS block (lines ~1200-1228)
```

---

## Section-by-Section Implementation

---

### SECTION 1: Announcement Bar
**Status:** `NEW` — Template has no announcement bar  
**Inject:** Before `<nav>` element  
**Purpose:** Trust / Friction Reduction

**HTML to add:**
```html
<!-- ANNOUNCEMENT BAR — inject before <nav> -->
<div class="announcement-bar" id="announcementBar">
  <div class="announcement-ticker">
    <span class="announcement-msg active">Free Shipping on Orders Over €75</span>
    <span class="announcement-msg">30-Day Easy Returns — No Questions Asked</span>
    <span class="announcement-msg">Crafted in Europe Since 1885</span>
  </div>
  <button class="announcement-close" onclick="this.parentElement.style.display='none'">&times;</button>
</div>
```

**CSS to add:**
```css
.announcement-bar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 200; /* above nav's z-index: 100 */
  background: var(--dark);
  border-bottom: 1px solid rgba(201,169,110,0.15);
  padding: 10px 48px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.announcement-msg {
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  display: none;
}
.announcement-msg.active { display: inline; }
.announcement-close {
  position: absolute; right: 16px;
  background: none; border: none;
  color: rgba(245,239,232,0.3);
  font-size: 16px; cursor: pointer;
}
```

**JS (ticker rotation):**
```javascript
// Rotate announcement messages every 4 seconds
setInterval(() => {
  const msgs = document.querySelectorAll('.announcement-msg');
  const active = document.querySelector('.announcement-msg.active');
  const idx = [...msgs].indexOf(active);
  active.classList.remove('active');
  msgs[(idx + 1) % msgs.length].classList.add('active');
}, 4000);
```

**Nav adjustment:** When announcement bar is visible, push nav down:
```css
nav { top: 36px; } /* height of announcement bar */
```

---

### SECTION 2: Navigation
**Status:** `MODIFY`  
**Template element:** `<nav>` (lines 824-836)  
**Purpose:** Navigation / Brand identity

**Changes required:**

1. **Brand name swap:**
```html
<!-- BEFORE -->
<div class="nav-logo">
  <span>Velour</span>
  Intimate Luxury
</div>

<!-- AFTER -->
<div class="nav-logo">
  <span>Conturelle</span>
  by Felina
</div>
```

2. **Navigation links — update for e-commerce categories:**
```html
<!-- BEFORE -->
<ul class="nav-links">
  <li><a href="#">Collections</a></li>
  <li><a href="#">Bridal</a></li>
  <li><a href="#">Editorial</a></li>
  <li><a href="#">Atelier</a></li>
</ul>

<!-- AFTER -->
<ul class="nav-links">
  <li><a href="#collection">Shop All</a></li>
  <li><a href="#categories">Categories</a></li>
  <li><a href="#heritage">Our Story</a></li>
  <li><a href="#fit-finder">Fit Finder</a></li>
</ul>
```

3. **Replace corner number with cart icon:**
```html
<!-- BEFORE -->
<div class="nav-corner-num">01</div>

<!-- AFTER -->
<div class="nav-cart">
  <a href="#" class="cart-icon" aria-label="Shopping Cart">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 01-8 0"/>
    </svg>
    <span class="cart-count">0</span>
  </a>
</div>
```

4. **Mobile hamburger menu:** Template has NO mobile nav. Must add:
```html
<button class="nav-hamburger" aria-label="Menu">
  <span></span><span></span><span></span>
</button>
```

---

### SECTION 3: Hero
**Status:** `MODIFY` — Structure stays, content changes significantly  
**Template element:** `<section class="hero">` (lines 839-864)  
**Purpose:** Conversion — convert cold paid traffic

**What stays:**
- Full-viewport hero with centered content layout
- Background glow animation (`hero-glow`)
- Gradient background (`hero-bg`)
- CTA button with gold-border + fill-on-hover animation

**Content changes:**

```html
<!-- BEFORE -->
<p class="hero-eyebrow">Autumn Collection — 2026</p>
<h1 class="hero-title">The Art of<br><em>Intimacy</em></h1>
<p class="hero-sub">Crafted in Lyon · Worn by few</p>
<a href="#" class="hero-cta"><span>Discover the Collection</span></a>

<!-- AFTER -->
<p class="hero-eyebrow">140 Years of German Precision</p>
<h1 class="hero-title">Engineered for<br>the Way You <em>Move</em></h1>
<p class="hero-sub">80 pieces · Perfect fit · Made in Europe</p>
<a href="#collection" class="hero-cta"><span>Shop the Collection</span></a>
<a href="#fit-finder" class="hero-cta-secondary">Find Your Perfect Fit →</a>
```

**Add secondary CTA styling:**
```css
.hero-cta-secondary {
  display: block;
  margin-top: 20px;
  font-size: 10px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: rgba(245,239,232,0.5);
  text-decoration: none;
  border-bottom: 1px solid rgba(245,239,232,0.2);
  padding-bottom: 3px;
  transition: color 0.3s, border-color 0.3s;
}
.hero-cta-secondary:hover {
  color: var(--gold);
  border-color: var(--gold);
}
```

**Corner elements update:**
```html
<!-- BEFORE -->
<div class="hero-coords">
  <span>PARIS <span class="blink">48°51'N</span></span><br>
  <span>MAISON DE VELOUR</span><br>
  <span>SINCE MCMXCVIII</span>
</div>
<div class="hero-tagline">Designed with intention. Worn with desire.</div>
<div class="hero-badge">SSÆN ORIGINAL™<br>EST. COLLECTION</div>

<!-- AFTER -->
<div class="hero-coords">
  <span>EUROPE <span class="blink">EST. 1885</span></span><br>
  <span>CONTURELLE BY FELINA</span><br>
  <span>EUROPEAN LINGERIE GROUP</span>
</div>
<div class="hero-tagline">From yarn to perfect fit — every step, ours.</div>
<div class="hero-badge">★★★★★ 4.8/5<br>2,000+ REVIEWS</div>
```

**A/B Test Variants (implement via Shopify sections or Google Optimize):**

| Variant | hero-eyebrow | hero-title | hero-sub |
|---------|-------------|------------|----------|
| A — Heritage | "140 Years of German Precision" | "Engineered for the Way You Move" | "80 pieces · Perfect fit · Made in Europe" |
| B — Outcome | "The Fit That Changes Everything" | "The Last Bra You'll<br>Need to <em>Try</em>" | "80 pieces of precision engineering in every bra" |
| C — TikTok | "This Is the Bra Everyone's Talking About" | "Feel <em>Nothing.</em><br>Look Everything." | "European craftsmanship · 2,000+ 5-star reviews" |

**Hero background:** Replace CSS gradient with actual editorial photo when available:
```css
.hero-bg {
  /* PHASE 1: Keep gradient (current) */
  background: radial-gradient(ellipse 80% 80% at 55% 40%, #2e1520 0%, #1a0f0d 60%, #0d0808 100%);
  
  /* PHASE 2: Replace with editorial image */
  /* background: url('/assets/hero-editorial.webp') center/cover; */
}
```

---

### SECTION 4: Marquee Strip → Social Proof / Trust Bar
**Status:** `MODIFY` — Repurpose from decorative marquee to CRO trust bar  
**Template element:** `<div class="marquee-strip">` (lines 867-882)  
**Purpose:** Trust — immediate credibility for cold visitors

The template's marquee is currently decorative luxury copy ("Silk Chantilly Lace," "Exclusively Yours"). Repurpose it as a conversion-driving trust bar.

**Option A — Keep as scrolling marquee (simpler):**
```html
<div class="marquee-inner" id="marquee">
  <span class="marquee-item">★★★★★ Rated 4.8/5 by 2,000+ Women<span class="marquee-dot"></span></span>
  <span class="marquee-item">Free Shipping Over €75<span class="marquee-dot"></span></span>
  <span class="marquee-item">Made in Europe Since 1885<span class="marquee-dot"></span></span>
  <span class="marquee-item">80 Pieces Per Bra<span class="marquee-dot"></span></span>
  <span class="marquee-item">30-Day Easy Returns<span class="marquee-dot"></span></span>
  <span class="marquee-item">OEKO-TEX® Certified<span class="marquee-dot"></span></span>
  <!-- Duplicate set for seamless loop -->
  <span class="marquee-item">★★★★★ Rated 4.8/5 by 2,000+ Women<span class="marquee-dot"></span></span>
  <span class="marquee-item">Free Shipping Over €75<span class="marquee-dot"></span></span>
  <span class="marquee-item">Made in Europe Since 1885<span class="marquee-dot"></span></span>
  <span class="marquee-item">80 Pieces Per Bra<span class="marquee-dot"></span></span>
  <span class="marquee-item">30-Day Easy Returns<span class="marquee-dot"></span></span>
  <span class="marquee-item">OEKO-TEX® Certified<span class="marquee-dot"></span></span>
</div>
```

**Option B — Static brag bar (higher trust, recommended):**
Replace the entire marquee section with a static 3-column trust bar:
```html
<div class="brag-bar">
  <div class="brag-item">
    <span class="brag-stars">★★★★★</span>
    <span class="brag-text">Rated 4.8/5 by 2,000+ women</span>
  </div>
  <div class="brag-separator">·</div>
  <div class="brag-item">
    <span class="brag-text">As Featured In</span>
    <span class="brag-logos">[Vogue DE] [Elle] [Brigitte]</span>
  </div>
  <div class="brag-separator">·</div>
  <div class="brag-item">
    <span class="brag-text">Est. 1885 — 140 Years of Craft</span>
  </div>
</div>
```

```css
.brag-bar {
  position: relative; z-index: 2;
  border-top: 1px solid rgba(201,169,110,0.12);
  border-bottom: 1px solid rgba(201,169,110,0.12);
  padding: 18px 48px;
  background: rgba(74,24,37,0.15);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
}
.brag-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.brag-stars {
  color: var(--star-gold);
  font-size: 12px;
}
.brag-text {
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245,239,232,0.5);
}
.brag-separator {
  color: rgba(201,169,110,0.3);
  font-size: 18px;
}
.brag-logos img {
  height: 16px;
  opacity: 0.4;
  filter: grayscale(100%);
  margin: 0 6px;
}
```

**Recommendation:** Go with Option B (static) for higher trust impact. The scrolling marquee is visually beautiful but visitors can't scan it quickly — and for CRO, quick scanning beats aesthetic movement.

---

### SECTION 5: Category Navigation Tiles
**Status:** `NEW` — Template has no category navigation  
**Inject:** Between brag bar and editorial section  
**Purpose:** Conversion — reduce clicks to product, guide browsing

**HTML to add:**
```html
<section class="categories" id="categories">
  <div class="section-header">
    <div style="display:flex;align-items:flex-end;gap:24px;">
      <div class="section-num">01</div>
      <h2 class="section-title">Shop by <em>Style</em></h2>
    </div>
  </div>
  
  <div class="category-grid">
    <a href="/collections/spacer-bras" class="category-tile">
      <div class="category-image" style="background: linear-gradient(145deg, #2e1520, #1a0f0d);">
        <!-- Replace gradient with actual category image -->
      </div>
      <span class="category-name">Spacer Bras</span>
    </a>
    <a href="/collections/lace-bras" class="category-tile">
      <div class="category-image" style="background: linear-gradient(145deg, #3d1820, #2a1218);">
      </div>
      <span class="category-name">Lace Bras</span>
    </a>
    <a href="/collections/t-shirt-bras" class="category-tile">
      <div class="category-image" style="background: linear-gradient(145deg, #1e1a20, #2e1828);">
      </div>
      <span class="category-name">T-Shirt Bras</span>
    </a>
    <a href="/collections/briefs" class="category-tile">
      <div class="category-image" style="background: linear-gradient(145deg, #261818, #3a1e1a);">
      </div>
      <span class="category-name">Matching Briefs</span>
    </a>
    <a href="/collections/sets" class="category-tile">
      <div class="category-image" style="background: linear-gradient(145deg, #2e1c20, #1e1015);">
      </div>
      <span class="category-name">Complete Sets</span>
    </a>
    <a href="/collections/sale" class="category-tile category-sale">
      <div class="category-image" style="background: linear-gradient(145deg, #281618, #3c1e20);">
      </div>
      <span class="category-name">Sale</span>
      <span class="category-badge">Up to 30% Off</span>
    </a>
  </div>
</section>
```

```css
.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 48px 80px;
}
.category-tile {
  position: relative;
  aspect-ratio: 4/3;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  padding: 24px;
  text-decoration: none;
  cursor: pointer;
}
.category-image {
  position: absolute; inset: 0;
  transition: transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94);
}
.category-tile:hover .category-image { transform: scale(1.04); }
.category-name {
  position: relative; z-index: 1;
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  color: var(--cream);
  font-weight: 300;
}
.category-badge {
  position: absolute;
  top: 16px; right: 16px;
  font-size: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cream);
  background: var(--sale-red);
  padding: 4px 10px;
}

/* Mobile: horizontal scroll */
@media (max-width: 768px) {
  .category-grid {
    grid-template-columns: none;
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 2px;
    padding: 0 24px 40px;
  }
  .category-tile {
    min-width: 65vw;
    scroll-snap-align: start;
    aspect-ratio: 3/4;
  }
}
```

---

### SECTION 6: Editorial / Brand Heritage
**Status:** `MODIFY` — Template's editorial section becomes heritage storytelling  
**Template element:** `<section class="editorial">` (lines 885-931)  
**Purpose:** Trust + Engagement — Conturelle's unfair advantage

**What stays:**
- 3-column grid layout (stats left, image center, copy right)
- Stat blocks with border-left accent
- Image placeholder area (replace with factory/craft image later)
- Editorial heading + text styling
- Gold separator line

**Stat blocks update:**
```html
<!-- BEFORE -->
<div class="stat-block">
  <div class="stat-num">XIV</div>
  <div class="stat-label">Collections crafted</div>
</div>
<div class="stat-block">
  <div class="stat-num">48</div>
  <div class="stat-label">Master artisans</div>
</div>
<div class="stat-block">
  <div class="stat-num">9</div>
  <div class="stat-label">Silks sourced</div>
</div>

<!-- AFTER -->
<div class="stat-block">
  <div class="stat-num">80</div>
  <div class="stat-label">Pieces per bra</div>
</div>
<div class="stat-block">
  <div class="stat-num">140</div>
  <div class="stat-label">Years of heritage</div>
</div>
<div class="stat-block">
  <div class="stat-num">100%</div>
  <div class="stat-label">European made</div>
</div>
```

**Center image update:**
```html
<!-- Replace the SVG placeholder with craft imagery -->
<div class="editorial-center">
  <div class="img-placeholder">
    <div class="img-label-corner">EST. — 1885</div>
    <!-- PHASE 1: Keep decorative SVG (current) -->
    <!-- PHASE 2: Replace with <img> or <video> of craft process -->
    <!-- <video autoplay muted loop playsinline>
      <source src="/assets/craft-process.mp4" type="video/mp4">
    </video> -->
    <svg class="fabric-svg" viewBox="0 0 200 280" ...>
      <!-- Keep existing SVG as placeholder -->
    </svg>
    <p class="img-caption">Precision Engineering</p>
  </div>
</div>
```

**Right column copy update:**
```html
<!-- BEFORE -->
<p style="...">The Velour Manifesto</p>
<h2 class="editorial-heading">Where <em>skin</em><br>meets silk</h2>
...
<p class="editorial-text">Every piece is conceived in our Paris atelier...</p>
<a href="#" class="line-link">Our Craft →</a>

<!-- AFTER -->
<p style="font-size:9px;letter-spacing:0.35em;text-transform:uppercase;color:var(--terracotta);margin-bottom:16px;">
  The Conturelle Difference
</p>
<h2 class="editorial-heading">140 Years<br>in the <em>Making</em></h2>
<div class="gold-line gold-line-right"></div>
...
<p class="editorial-text">
  Every Conturelle bra is assembled from up to 80 individual pieces — 
  each one cut, sewn, and finished by skilled artisans in Europe. From 
  the first thread of yarn to the finished product on your shoulders, 
  we control every step. That's how we guarantee a fit no one else can.
</p>
<a href="/pages/our-story" class="line-link">Discover Our Story →</a>
```

---

### SECTION 7: Bestseller Product Grid
**Status:** `MODIFY` — Template's product grid needs CRO elements  
**Template element:** `<section class="collection">` (lines 934-1087)  
**Purpose:** Conversion — surface top products, enable quick purchase

**Section header update:**
```html
<!-- BEFORE -->
<h2 class="section-title">La <em>Collection</em></h2>
<p class="section-meta">Autumn — Winter 2026</p>

<!-- AFTER -->
<h2 class="section-title">Our <em>Bestsellers</em></h2>
<p class="section-meta">The pieces our customers come back for, again and again</p>
```

**Product card enhancements — each card needs these CRO additions:**

The template's current product card has: image, product name, material subtitle, price. It's MISSING: star ratings, color swatches, badges, strikethrough pricing, quick-add.

```html
<!-- ENHANCED PRODUCT CARD (replaces existing card structure) -->
<div class="product-card">
  <div class="product-image">
    <div class="product-bg pc1">
      <!-- Keep existing SVG placeholder, replace with real photos later -->
      <div class="pc-decor">...</div>
    </div>
    <div class="product-overlay"></div>
    
    <!-- NEW: Badge -->
    <div class="product-badge badge-bestseller">Bestseller</div>
    
    <!-- MODIFY: Quick-add instead of generic "Add to Selection" -->
    <div class="product-hover-cta" onclick="event.stopPropagation(); toggleQuickAdd(this)">
      Quick Add +
    </div>
  </div>
  
  <!-- NEW: Quick-add size selector (hidden by default, shown on click) -->
  <div class="quick-add-panel" style="display:none;">
    <div class="quick-add-sizes">
      <span class="qa-label">Band:</span>
      <button class="qa-size">70</button>
      <button class="qa-size">75</button>
      <button class="qa-size">80</button>
      <button class="qa-size">85</button>
      <button class="qa-size">90</button>
    </div>
    <div class="quick-add-sizes">
      <span class="qa-label">Cup:</span>
      <button class="qa-size">B</button>
      <button class="qa-size">C</button>
      <button class="qa-size">D</button>
      <button class="qa-size">E</button>
    </div>
    <button class="qa-add-btn">Add to Cart</button>
  </div>
  
  <div class="product-info">
    <div>
      <div class="product-name"><em>Silhouette</em> Spacer Bra</div>
      <div class="product-meta">Spacer Foam · Microfiber</div>
      
      <!-- NEW: Star rating -->
      <div class="product-stars">
        <span class="stars">★★★★★</span>
        <span class="review-count">(124)</span>
      </div>
      
      <!-- NEW: Color swatches -->
      <div class="product-swatches">
        <span class="swatch active" style="background:#D4BFB0;" title="Champagne"></span>
        <span class="swatch" style="background:#1a0f0d;" title="Black"></span>
        <span class="swatch" style="background:#c9a89a;" title="Rose"></span>
      </div>
    </div>
    
    <!-- MODIFY: Price with sale support -->
    <div class="product-pricing">
      <!-- Regular price -->
      <div class="product-price">€89</div>
      
      <!-- OR: Sale price -->
      <!--
      <div class="product-price-original">€89</div>
      <div class="product-price sale">€62</div>
      <span class="discount-badge">-30%</span>
      -->
    </div>
  </div>
</div>
```

**New CSS for product card CRO elements:**
```css
/* Badge */
.product-badge {
  position: absolute;
  top: 16px; left: 16px;
  font-size: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  padding: 4px 10px;
  z-index: 3;
}
.badge-bestseller { background: var(--dark); color: var(--gold); border: 1px solid rgba(201,169,110,0.3); }
.badge-new { background: var(--gold); color: var(--dark); }
.badge-sale { background: var(--sale-red); color: var(--cream); }

/* Stars */
.product-stars {
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.stars { color: var(--star-gold); font-size: 10px; }
.review-count { font-size: 9px; color: rgba(245,239,232,0.3); }

/* Swatches */
.product-swatches {
  display: flex;
  gap: 6px;
  margin-top: 8px;
}
.swatch {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 1px solid rgba(245,239,232,0.2);
  cursor: pointer;
  transition: border-color 0.2s;
}
.swatch.active, .swatch:hover {
  border-color: var(--gold);
  box-shadow: 0 0 0 2px var(--dark), 0 0 0 3px var(--gold);
}

/* Sale pricing */
.product-pricing { text-align: right; }
.product-price-original {
  font-size: 13px;
  color: rgba(245,239,232,0.3);
  text-decoration: line-through;
}
.product-price.sale { color: var(--sale-red); }
.discount-badge {
  font-size: 8px;
  background: var(--sale-red);
  color: var(--cream);
  padding: 2px 6px;
  margin-left: 4px;
}

/* Quick-add panel */
.quick-add-panel {
  background: var(--mid);
  padding: 12px 16px;
  border-top: 1px solid rgba(201,169,110,0.1);
}
.quick-add-sizes {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
}
.qa-label {
  font-size: 8px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245,239,232,0.4);
  width: 36px;
}
.qa-size {
  width: 32px; height: 32px;
  background: transparent;
  border: 1px solid rgba(201,169,110,0.2);
  color: var(--cream);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.qa-size:hover, .qa-size.selected {
  background: var(--gold);
  color: var(--dark);
  border-color: var(--gold);
}
.qa-add-btn {
  width: 100%;
  padding: 10px;
  background: var(--burgundy);
  border: 1px solid var(--burgundy);
  color: var(--cream);
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.3s;
}
.qa-add-btn:hover {
  background: transparent;
  border-color: var(--rose);
  color: var(--rose);
}
```

**Product data update (replace Velour products with Conturelle):**

| # | Template Product | → Conturelle Product | Price |
|---|-----------------|---------------------|-------|
| 1 | Nuit Bralette (€480) | Silhouette Spacer Bra | €89 |
| 2 | Aurore Brief (€320) | Provence Lace Bra | €79 |
| 3 | Douceur Set (€740) | Essential T-Shirt Bra | €69 |
| 4 | Soir Chemise (€620) | Jardin Lace Set | €129 |
| 5 | Minuit Garter (€190) | Daily Comfort Brief | €39 |
| 6 | Rêve Robe (€890) | Luxe Full Cup Bra | €95 |

---

### SECTION 8: Feature Strip → Trust Value Propositions
**Status:** `MODIFY` — Rebrand content, keep layout  
**Template element:** `<div class="feature-strip">` (lines 1089-1113)  
**Purpose:** Trust — address purchase objections

```html
<!-- BEFORE -->
<div class="feature-num">01 /</div>
<div class="feature-title">Lyon <em>Silk</em></div>
<p class="feature-text">Every thread sourced from centuries-old mulberry silk farms...</p>

<!-- AFTER (all 4 features) -->

<!-- Feature 1 -->
<div class="feature-num">01 /</div>
<div class="feature-title">European <em>Craft</em></div>
<p class="feature-text">Every bra assembled from up to 80 individual pieces by skilled European artisans. 140 years of perfecting the art of fit.</p>

<!-- Feature 2 -->
<div class="feature-num">02 /</div>
<div class="feature-title">Perfect <em>Fit</em></div>
<p class="feature-text">Our Fit Finder quiz matches your measurements to your ideal size. Sizes EU 70-100, cups B through G. No more guessing.</p>

<!-- Feature 3 -->
<div class="feature-num">03 /</div>
<div class="feature-title">Free <em>Returns</em></div>
<p class="feature-text">Not quite right? Return within 30 days, no questions asked. Free shipping on orders over €75. We make it easy.</p>

<!-- Feature 4 -->
<div class="feature-num">04 /</div>
<div class="feature-title">Yarn to <em>You</em></div>
<p class="feature-text">We control every step — from the first thread of premium European fabric to the finished product on your shoulders.</p>
```

---

### SECTION 9: Fit Finder CTA
**Status:** `NEW` — Template has no fit finder  
**Inject:** After feature strip, before banner  
**Purpose:** Conversion + Friction Reduction

```html
<section class="fit-finder" id="fit-finder">
  <div class="fit-finder-content">
    <p class="banner-eyebrow">Reduce Returns. Build Confidence.</p>
    <h2 class="banner-title">Find Your Perfect<br><em>Fit</em></h2>
    <p class="banner-sub">No measuring tape needed. Answer 4 quick questions and we'll recommend your ideal size and style.</p>
    <div class="banner-cta">
      <a href="/pages/fit-quiz" class="btn-primary">Start the Fit Quiz</a>
      <a href="/pages/size-guide" class="btn-ghost">View Size Guide</a>
    </div>
    <p class="fit-testimonial">
      "This quiz got my size exactly right. First bra I haven't had to return." — Maria K.
    </p>
  </div>
</section>
```

Use the same CSS as `.banner` section (gradient background, centered content). Add:
```css
.fit-testimonial {
  margin-top: 32px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-style: italic;
  color: rgba(245,239,232,0.35);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
```

---

### SECTION 10: UGC / Reviews Section
**Status:** `NEW` — Template has no social proof section  
**Inject:** After fit finder, before email capture  
**Purpose:** Trust + Engagement

```html
<section class="ugc-section" id="reviews">
  <div class="section-header" style="max-width:1400px;margin:0 auto;padding:80px 48px 40px;">
    <div style="display:flex;align-items:flex-end;gap:24px;">
      <div class="section-num">03</div>
      <h2 class="section-title">Real Women.<br><em>Real Fit.</em></h2>
    </div>
    <p class="section-meta">Tag @conturelle to be featured</p>
  </div>
  
  <div class="ugc-grid" style="max-width:1400px;margin:0 auto;padding:0 48px 80px;">
    <!-- Populated by Judge.me or Loox widget -->
    <!-- Placeholder cards for design reference: -->
    <div class="ugc-card">
      <div class="ugc-photo" style="aspect-ratio:1;background:var(--mid);"></div>
      <div class="ugc-content">
        <div class="stars">★★★★★</div>
        <p class="ugc-quote">"Finally a bra that actually fits. The spacer cups are incredibly comfortable."</p>
        <p class="ugc-author">— Sarah M., Size 80D</p>
      </div>
    </div>
    <!-- Repeat 3-4 cards -->
  </div>
</section>
```

```css
.ugc-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.ugc-card {
  background: var(--mid);
  overflow: hidden;
}
.ugc-content {
  padding: 16px;
}
.ugc-quote {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  font-style: italic;
  color: rgba(245,239,232,0.5);
  line-height: 1.6;
  margin: 8px 0;
}
.ugc-author {
  font-size: 9px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(245,239,232,0.3);
}

@media (max-width: 768px) {
  .ugc-grid {
    grid-template-columns: none;
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .ugc-card {
    min-width: 280px;
    scroll-snap-align: start;
  }
}
```

**Tech:** Judge.me or Loox review widget populates this dynamically.

---

### SECTION 11: Email Capture
**Status:** `NEW` — Template has no email capture  
**Inject:** After UGC, before banner/footer  
**Purpose:** Conversion — capture visitors not ready to buy

```html
<section class="email-capture">
  <div class="email-capture-inner">
    <h2 class="banner-title" style="font-size:clamp(36px,6vw,72px);">
      Your First Fit<br>Is <em>On Us</em>
    </h2>
    <p class="banner-sub">
      Get 10% off your first order + exclusive early access to new collections.
    </p>
    <div class="email-form" id="klaviyo-form">
      <input type="email" placeholder="Enter your email" class="email-input">
      <button class="btn-primary" style="white-space:nowrap;">Get 10% Off</button>
    </div>
    <p class="email-privacy">
      No spam. Unsubscribe anytime. We respect your privacy.
    </p>
  </div>
</section>
```

```css
.email-capture {
  position: relative; z-index: 2;
  padding: 100px 48px;
  text-align: center;
  background: rgba(74,24,37,0.1);
  border-top: 1px solid rgba(201,169,110,0.08);
  border-bottom: 1px solid rgba(201,169,110,0.08);
}
.email-form {
  display: inline-flex;
  gap: 0;
  margin-top: 40px;
  max-width: 480px;
}
.email-input {
  flex: 1;
  padding: 16px 20px;
  background: rgba(245,239,232,0.05);
  border: 1px solid rgba(201,169,110,0.2);
  border-right: none;
  color: var(--cream);
  font-family: 'Space Grotesk', sans-serif;
  font-size: 12px;
  letter-spacing: 0.05em;
  outline: none;
}
.email-input::placeholder { color: rgba(245,239,232,0.3); }
.email-input:focus { border-color: var(--gold); }
.email-privacy {
  margin-top: 16px;
  font-size: 9px;
  letter-spacing: 0.15em;
  color: rgba(245,239,232,0.2);
}

@media (max-width: 768px) {
  .email-form {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
  .email-input { border-right: 1px solid rgba(201,169,110,0.2); }
}
```

**Tech:** Replace the native form with **Klaviyo** embedded form snippet. The styling above serves as visual reference.

---

### SECTION 12: Banner → Seasonal Campaign CTA
**Status:** `MODIFY` — Keep structure, change content  
**Template element:** `<section class="banner">` (lines 1116-1136)  
**Purpose:** Conversion — seasonal/campaign-specific CTA

```html
<!-- BEFORE -->
<p class="banner-eyebrow">Limited Bridal Edition</p>
<h2 class="banner-title">Your most<br><em>intimate</em><br>moment</h2>
<p class="banner-sub">Custom bridal lingerie, conceived with you...</p>
<a href="#" class="btn-primary">Book Appointment</a>
<a href="#" class="btn-ghost">View Bridal Collection</a>

<!-- AFTER — Use for seasonal campaigns -->
<p class="banner-eyebrow">Spring Collection 2026</p>
<h2 class="banner-title">New<br><em>Arrivals</em></h2>
<p class="banner-sub">Fresh styles in the lightest European fabrics. Designed for warm days and effortless comfort.</p>
<a href="/collections/new" class="btn-primary">Shop New Arrivals</a>
<a href="/collections/sale" class="btn-ghost">Shop Sale — Up to 30% Off</a>
```

**Note:** This section is flexible — swap content for seasonal campaigns, flash sales, or new collection launches. The template's background gradient and SVG line decoration work well as-is.

---

### SECTION 13: Footer
**Status:** `MODIFY` — Update links, add trust signals  
**Template element:** `<footer>` (lines 1139-1185)  
**Purpose:** Trust + Navigation + GDPR compliance

```html
<!-- Brand column -->
<div class="footer-brand">
  <span class="nav-logo"><span>Conturelle</span>by Felina</span>
  <p class="footer-tagline">"Engineered for the Way You Move.<br>Since 1885."</p>
  <div class="footer-social">
    <a href="#">Instagram</a>
    <a href="#">Pinterest</a>
    <a href="#">TikTok</a>
    <a href="#">Facebook</a>
  </div>
</div>

<!-- Shop column -->
<div>
  <p class="footer-col-title">Shop</p>
  <ul class="footer-links">
    <li><a href="/collections/spacer-bras">Spacer Bras</a></li>
    <li><a href="/collections/lace-bras">Lace Bras</a></li>
    <li><a href="/collections/t-shirt-bras">T-Shirt Bras</a></li>
    <li><a href="/collections/briefs">Briefs</a></li>
    <li><a href="/collections/sets">Complete Sets</a></li>
    <li><a href="/collections/sale">Sale</a></li>
  </ul>
</div>

<!-- Help column -->
<div>
  <p class="footer-col-title">Help</p>
  <ul class="footer-links">
    <li><a href="/pages/size-guide">Size Guide</a></li>
    <li><a href="/pages/fit-quiz">Fit Finder Quiz</a></li>
    <li><a href="/pages/shipping">Shipping</a></li>
    <li><a href="/pages/returns">Returns</a></li>
    <li><a href="/pages/contact">Contact Us</a></li>
    <li><a href="/pages/faq">FAQs</a></li>
  </ul>
</div>

<!-- About column -->
<div>
  <p class="footer-col-title">About</p>
  <ul class="footer-links">
    <li><a href="/pages/our-story">Our Story</a></li>
    <li><a href="/pages/heritage">140 Years of Heritage</a></li>
    <li><a href="/pages/sustainability">Sustainability</a></li>
    <li><a href="/pages/press">Press</a></li>
  </ul>
</div>
```

**Footer bottom update:**
```html
<div class="footer-bottom">
  <!-- Payment icons -->
  <div class="footer-payments">
    <!-- SVG payment icons: Visa, MC, Amex, PayPal, Klarna, Apple Pay, Google Pay -->
  </div>
  
  <p class="footer-copy">
    © 2026 Conturelle by Felina — European Lingerie Group
  </p>
  
  <!-- GDPR-required links -->
  <div class="footer-legal">
    <a href="/policies/privacy-policy">Privacy Policy</a> · 
    <a href="/policies/terms-of-service">Terms of Service</a> · 
    <a href="/pages/imprint">Imprint</a> · 
    <a href="#" onclick="Pandectes.openPreferences()">Cookie Settings</a>
  </div>
  
  <div class="footer-trust">
    🔒 Secure Checkout · OEKO-TEX® Certified · Made in Europe
  </div>
  
  <div class="footer-corner">C</div>
</div>
```

---

## Final Section Order (Homepage)

| # | Section | Template Status | Purpose |
|---|---------|----------------|---------|
| 1 | Announcement Bar | `NEW` | Trust |
| 2 | Navigation | `MODIFY` | Navigation |
| 3 | Hero | `MODIFY` | Conversion |
| 4 | Trust / Brag Bar | `MODIFY` (was marquee) | Trust |
| 5 | Category Tiles | `NEW` | Conversion |
| 6 | Heritage / Editorial | `MODIFY` | Trust + Engagement |
| 7 | Bestseller Grid | `MODIFY` | Conversion |
| 8 | Feature Strip / Value Props | `MODIFY` | Trust |
| 9 | Fit Finder CTA | `NEW` | Friction Reduction |
| 10 | UGC / Reviews | `NEW` | Trust |
| 11 | Email Capture | `NEW` | Conversion |
| 12 | Campaign Banner | `MODIFY` | Conversion |
| 13 | Footer | `MODIFY` | Trust + GDPR |

---

---

## HOMEPAGE — Additional CRO Enhancements (Mobile-First)

These additions layer on top of the 13 homepage sections already defined above. They address mobile-specific conversion gaps and add missing CRO patterns.

---

### Homepage CRO Addition 1: Mobile Bottom Navigation Bar
**Status:** `NEW`  
**Purpose:** Conversion — persistent access to key actions on mobile  
**Visibility:** Mobile only (≤768px), fixed to bottom

```
MOBILE — Fixed Bottom Nav (always visible)
┌────────┬────────┬────────┬────────┐
│  🏠    │  🔍    │  ❤️    │  🛒    │
│  Home  │ Search │  Wish  │  Cart  │
│        │        │  list  │  (2)   │
└────────┴────────┴────────┴────────┘
Height: 56px + safe area inset
Z-index: above everything except cart drawer
```

**Behavior:**
- Cart icon shows item count badge (red dot)
- Tapping Cart opens the slide-out cart drawer (not a new page)
- Tapping Search opens a full-screen search overlay with recent searches + trending
- Hide this bar when the sticky ATC bar is visible on product pages (avoid double-bar)

```css
.mobile-bottom-nav {
  display: none; /* hidden on desktop */
}
@media (max-width: 768px) {
  .mobile-bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 150;
    background: var(--dark);
    border-top: 1px solid rgba(201,169,110,0.15);
    padding: 8px 0 calc(8px + env(safe-area-inset-bottom));
    justify-content: space-around;
  }
  .mobile-bottom-nav a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(245,239,232,0.4);
    text-decoration: none;
    min-width: 60px;
    min-height: 44px; /* thumb target */
    justify-content: center;
  }
  .mobile-bottom-nav a.active { color: var(--gold); }
  
  /* Push page content up so it doesn't hide behind the bar */
  body { padding-bottom: 72px; }
}
```

---

### Homepage CRO Addition 2: Exit-Intent / Scroll-Triggered Popup (Mobile)
**Status:** `NEW`  
**Purpose:** Conversion — capture abandoning visitors

Mobile has no mouse-exit detection, so trigger differently:

**Trigger rules:**
- Fire at 50% scroll depth OR 45 seconds on page — whichever comes first
- Show only once per session (sessionStorage flag)
- Never show to returning visitors who already have a Klaviyo cookie
- Never show if the visitor has already interacted with the inline email capture

```
MOBILE POPUP WIREFRAME
┌─────────────────────────┐
│            ✕             │
│                          │
│   [Lifestyle image —     │
│    woman looking          │
│    confident, cropped    │
│    to top third]         │
│                          │
│  "Your First Fit         │
│   Is On Us"              │
│                          │
│  10% off your first      │
│  order. No spam.         │
│                          │
│  ┌──────────────────┐    │
│  │ Enter your email  │    │
│  └──────────────────┘    │
│  ┌──────────────────┐    │
│  │   GET 10% OFF    │    │
│  └──────────────────┘    │
│                          │
│  "No thanks, I'll pay    │
│   full price"            │
│                          │
└─────────────────────────┘
```

- "No thanks" text link dismisses + sets the session flag
- The dismiss language uses loss aversion ("I'll pay full price") — standard Klaviyo pattern
- On desktop: trigger on exit-intent (mouse-to-top) instead of scroll/time

**Tech:** Klaviyo popup form. Do NOT custom-build — Klaviyo handles the display logic, A/B testing, cookie management, and Shopify integration natively.

---

### Homepage CRO Addition 3: Recently Viewed (Mobile)
**Status:** `NEW`  
**Purpose:** Conversion — help returning mobile visitors pick up where they left off  
**Position:** Above the bestseller grid, only shown to returning visitors

```
MOBILE — Recently Viewed (returning visitors only)
┌────────────────────────────────┐
│ Recently Viewed                │
│                                │
│ ┌──────┐ ┌──────┐ ┌──────┐   │
│ │ img  │ │ img  │ │ img  │ ← │
│ │      │ │      │ │      │   │
│ │ Name │ │ Name │ │ Name │   │
│ │ €79  │ │ €89  │ │ €69  │   │
│ └──────┘ └──────┘ └──────┘   │
│        ← swipe →              │
└────────────────────────────────┘
```

- Horizontal scroll, 2.3 cards visible (peek pattern)
- Stored in localStorage, max 8 products
- Only render if ≥ 2 products viewed in previous sessions
- Minimal card: image + name + price (no stars, no swatches — keep it fast)

**Tech:** Custom Liquid + JS using localStorage. Or Rebuy "Recently Viewed" widget.

---

### Homepage CRO Addition 4: Floating "Need Help?" Chat Trigger
**Status:** `NEW`  
**Purpose:** Friction reduction — catch confused visitors before they bounce

```
Bottom-right corner (desktop) / above mobile bottom nav (mobile)

┌──────────────────────┐
│  💬 Need sizing help? │
│      Chat with us     │
└──────────────────────┘
```

- Appears after 20 seconds on page
- On tap: opens Shopify Inbox chat or Gorgias widget
- Pulsing subtle gold border animation to draw attention
- Dismiss after one interaction (don't keep nagging)
- On mobile: position above the bottom nav bar (bottom: 72px)

---

## PRODUCT PAGE — Complete Wireframe (Mobile-First)

The Velour template has no product page. This is built from scratch, matching the template's dark premium aesthetic (same CSS variables, fonts, animation patterns).

---

### Product Page: Full Mobile Wireframe

This is the PRIMARY design. Desktop is a responsive scale-up of this layout.

```
MOBILE PRODUCT PAGE — Complete scroll flow
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────┐
│ ← Back    CONTURELLE    🛒(2) │  ← Sticky header
├────────────────────────────────┤
│ Home > Spacer Bras > Silhou…  │  ← Breadcrumb
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │                          │ │
│  │     PRODUCT IMAGE        │ │  ← Full-width swipe carousel
│  │     (front on-model)     │ │     Aspect ratio: 3:4
│  │                          │ │     Pinch-to-zoom enabled
│  │                          │ │
│  │  [BESTSELLER]     🔍     │ │  ← Badge top-left, zoom icon
│  │                          │ │
│  └──────────────────────────┘ │
│  ○ ○ ● ○ ○ ○ ○ ○            │  ← Dot indicators (8 images)
│                                │
│  ┌──────────────────────────┐ │
│  │ Thumbnail strip (scroll) │ │  ← Small thumbs, tap to jump
│  │ [1][2][3][4][5][6][7][8] │ │
│  └──────────────────────────┘ │
│                                │
│ ── BUY BOX ────────────────── │
│                                │
│  CONTURELLE                    │  ← Brand name (small, muted)
│  Silhouette Spacer Bra         │  ← Product title (Cormorant, 24px)
│  "Daily Comfort"               │  ← Collection subtitle (italic)
│                                │
│  ★★★★★ 4.8 (124 reviews)     │  ← Tappable → scrolls to reviews
│                                │
│  ~~€89.00~~ €62.30  [-30%]    │  ← Strikethrough + sale price + badge
│  or 4 × €15.58 with Klarna ⓘ │  ← BNPL line
│                                │
│  ─────────────────────────────│
│                                │
│  Color: Champagne Nude         │
│  ● ● ● ●                     │  ← Color swatches (tap to change)
│  (Champagne) (Black) (Rose)   │     Selected = gold ring
│  (Pearl)                       │     Each swatch updates main image
│                                │
│  ─────────────────────────────│
│                                │
│  Band Size (EU):               │
│  ┌────┐┌────┐┌────┐┌────┐    │
│  │ 70 ││ 75 ││ 80 ││ 85 │    │  ← Button pickers, 48×44px
│  └────┘└────┘└────┘└────┘    │     min tap target
│  ┌────┐┌────┐┌────┐          │
│  │ 90 ││ 95 ││100 │          │
│  └────┘└────┘└────┘          │
│                                │
│  Cup Size:                     │
│  ┌───┐┌───┐┌───┐┌───┐┌───┐  │
│  │ B ││ C ││ D ││ E ││ F │  │
│  └───┘└───┘└───┘└───┘└───┘  │
│  ┌───┐                        │
│  │ G │                        │
│  └───┘                        │
│                                │
│  [EU ●] / [UK ○]  ← toggle   │  ← Switches labels 70→32, etc.
│                                │
│  ⓘ Find Your Size — Take the │  ← Links to fit quiz
│    60-Second Fit Quiz          │
│                                │
│  ⚠️ Only 3 left in 80D       │  ← Scarcity (show only if stock ≤5)
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │    ADD TO CART — €62.30  │ │  ← Full-width, 52px height
│  │                          │ │     Gold bg, dark text
│  └──────────────────────────┘ │
│                                │
│  ✓ Free shipping over €75     │  ← Trust signals (3 lines)
│  ✓ 30-day hassle-free returns │
│  🔒 Secure checkout           │
│                                │
│ ── QUICK BENEFITS ──────────  │
│                                │
│  ✓ Spacer foam cups for a     │  ← 4 benefit bullets
│    natural, rounded shape      │     Benefit-first language
│  ✓ Breathable European        │
│    microfiber — cool all day   │
│  ✓ Wide comfort straps that   │
│    never dig in                │
│  ✓ 80-piece precision         │
│    engineering                 │
│                                │
│ ── ACCORDIONS ────────────── │
│                                │
│  ▸ Details                 [+]│  ← Tap to expand
│  ─────────────────────────────│
│  ▸ Materials & Care        [+]│
│  ─────────────────────────────│
│  ▸ Shipping & Returns      [+]│
│  ─────────────────────────────│
│  ▸ The Craft Behind This   [+]│  ← Unique Conturelle section
│    Piece                      │
│  ─────────────────────────────│
│                                │
│ ── COMPLETE THE LOOK ──────── │  ← Cross-sell section
│                                │
│  "Pair it with the matching   │
│   brief for a complete set"   │
│                                │
│  ┌───────────┐ ┌───────────┐ │
│  │           │ │           │ │
│  │  [IMAGE]  │ │  [IMAGE]  │ │
│  │           │ │           │ │
│  │ Matching  │ │ Matching  │ │
│  │ Brief     │ │ Thong     │ │
│  │ €39       │ │ €35       │ │
│  │ [+ ADD]   │ │ [+ ADD]   │ │
│  └───────────┘ └───────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │ 🎁 SAVE 15% — Buy Set   │ │  ← Bundle offer
│  │ Bra + Brief              │ │
│  │ ~~€128~~ €108.80         │ │
│  │                          │ │
│  │ [ADD SET TO CART]        │ │
│  └──────────────────────────┘ │
│                                │
│ ── YOU MAY ALSO LOVE ──────── │  ← Upsell carousel
│                                │
│  ┌──────┐ ┌──────┐ ┌────     │
│  │ img  │ │ img  │ │ img     │  ← Horizontal scroll
│  │      │ │      │ │         │     2.3 cards visible
│  │ Name │ │ Name │ │ Na      │     Same card design as
│  │ ★★★★★│ │ ★★★★★│ │ ★★      │     homepage bestsellers
│  │ €79  │ │ €89  │ │ €9      │
│  │[QUICK│ │[QUICK│ │[QU      │
│  │ ADD] │ │ ADD] │ │ AD      │
│  └──────┘ └──────┘ └────     │
│        ← swipe →              │
│                                │
│ ── CUSTOMER REVIEWS ────────  │
│                                │
│  ★★★★★ 4.8 out of 5           │
│  124 reviews                   │
│                                │
│  ┌──────────────────────────┐ │
│  │ 5★ ████████████████ 89%  │ │  ← Rating breakdown bars
│  │ 4★ █████ 8%              │ │
│  │ 3★ █ 2%                  │ │
│  │ 2★ ░ 1%                  │ │
│  │ 1★   0%                  │ │
│  └──────────────────────────┘ │
│                                │
│  Fit Feedback:                 │
│  [Runs Small] [TRUE SIZE] [Lg]│  ← Crowdsourced fit indicator
│                ^^^^^^^^^^^     │     Highlighted = majority
│                                │
│  Filter: [All][Photos][5★][4★]│  ← Horizontal scroll chips
│                                │
│  ┌──────────────────────────┐ │
│  │ ★★★★★  Maria K.          │ │  ← Individual review card
│  │ Verified Buyer · 80D     │ │
│  │                          │ │
│  │ "Finally a bra that      │ │
│  │  actually fits. The      │ │
│  │  spacer cups are         │ │
│  │  incredibly comfortable  │ │
│  │  and the shape is        │ │
│  │  perfect under shirts."  │ │
│  │                          │ │
│  │ Fit: True to size        │ │
│  │ Recommend: Yes ✓         │ │
│  │                          │ │
│  │ [PHOTO] [PHOTO]          │ │  ← Tappable to enlarge
│  │                          │ │
│  │ Helpful? 👍 12  👎 0    │ │
│  └──────────────────────────┘ │
│                                │
│  [LOAD MORE REVIEWS]          │
│  [WRITE A REVIEW]             │
│                                │
│ ── RECENTLY VIEWED ────────── │  ← Only if ≥2 products viewed
│                                │
│  ┌──────┐ ┌──────┐ ┌────     │
│  │ img  │ │ img  │ │         │
│  │ Name │ │ Name │ │         │
│  │ €69  │ │ €95  │ │         │
│  └──────┘ └──────┘ └────     │
│        ← swipe →              │
│                                │
│ ── FOOTER ────────────────── │
│  (same as homepage footer)    │
│                                │
├────────────────────────────────┤
│                                │
│  STICKY ADD-TO-CART BAR       │  ← Appears when main ATC
│                                │     scrolls out of view
│  Silhouette  ~~€89~~ €62.30  │
│  80D Champagne                │
│  ┌──────────────────────────┐│
│  │    ADD TO CART — €62.30  ││
│  └──────────────────────────┘│
│                                │
└────────────────────────────────┘
```

---

### Product Page: Desktop Layout (Scale-Up)

```
DESKTOP PRODUCT PAGE — Above the fold
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────────────────────────────────────────────────────┐
│ ← CONTURELLE by Felina          Shop All  Fit Finder  🛒(2) │
├──────────────────────────────────────────────────────────────┤
│ Home > Spacer Bras > Silhouette Spacer Bra                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  THUMBNAILS    MAIN IMAGE            BUY BOX (40% width)    │
│  ┌──┐                                                       │
│  │01│  ┌────────────────────┐   CONTURELLE                  │
│  ├──┤  │                    │   Silhouette Spacer Bra        │
│  │02│  │                    │   "Daily Comfort"              │
│  ├──┤  │   PRODUCT IMAGE    │                                │
│  │03│  │   (click to zoom)  │   ★★★★★ 4.8 (124 reviews)    │
│  ├──┤  │                    │                                │
│  │04│  │                    │   ~~€89.00~~ €62.30 [-30%]    │
│  ├──┤  │                    │   or 4 × €15.58 with Klarna   │
│  │05│  │                    │                                │
│  ├──┤  │                    │   Color: Champagne Nude        │
│  │06│  │                    │   ● ● ● ●                    │
│  ├──┤  └────────────────────┘                                │
│  │07│                            Band Size (EU):             │
│  ├──┤                            [70][75][80][85][90][95][100]│
│  │08│                                                        │
│  └──┘                            Cup Size:                   │
│                                  [B][C][D][E][F][G]          │
│                                                              │
│                                  [EU ●] / [UK ○]             │
│                                  ⓘ Take the Fit Quiz        │
│                                                              │
│                                  ⚠️ Only 3 left in 80D      │
│                                                              │
│                                  ┌────────────────────────┐  │
│                                  │  ADD TO CART — €62.30   │  │
│                                  └────────────────────────┘  │
│                                                              │
│                                  ✓ Free shipping over €75   │
│                                  ✓ 30-day free returns      │
│                                  🔒 Secure checkout          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│                   (Below the fold)                            │
│                                                              │
│  QUICK BENEFITS (left 60%)    │   ACCORDIONS (right 40%)    │
│  ✓ Spacer foam cups...       │   ▸ Details            [+]  │
│  ✓ Breathable European...    │   ▸ Materials & Care   [+]  │
│  ✓ Wide comfort straps...    │   ▸ Shipping & Returns [+]  │
│  ✓ 80-piece engineering      │   ▸ The Craft          [+]  │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  COMPLETE THE LOOK               │  YOU MAY ALSO LOVE       │
│  (2 matching items + bundle)      │  (4-card carousel)       │
├──────────────────────────────────────────────────────────────┤
│  CUSTOMER REVIEWS (full width)                               │
├──────────────────────────────────────────────────────────────┤
│  FOOTER                                                      │
└──────────────────────────────────────────────────────────────┘
```

---

### Product Page: Image Gallery Spec

| Slot | Image Type | Purpose | Requirements |
|------|-----------|---------|-------------|
| 1 | Front on-model | Primary selling image | Hero quality, warm lighting |
| 2 | Video (10-15s) | Show movement, fit, drape | Autoplay muted, loop on desktop. Play button on mobile |
| 3 | Back on-model | Full product visibility | Same model, same lighting |
| 4 | Side profile on-model | Silhouette shape | Shows lift and support |
| 5 | Fabric close-up | Quality proof | Macro shot of lace, stitching, or fabric texture |
| 6 | Construction detail | 80-piece story | Show seaming, boning channels, underwire |
| 7 | Flat lay / ghost mannequin | Clean reference | White or cream background for contrast |
| 8 | Lifestyle / editorial | Aspirational | Styled look, movement, confidence |

**Mobile gallery behavior:**
- Full-width horizontal swipe carousel
- Dot indicators below (max 8 dots, then show "1/8" counter)
- Pinch-to-zoom on any image
- Tap opens full-screen lightbox with swipe
- Video slot: show play button overlay, tap to play inline

**Desktop gallery behavior:**
- Left vertical thumbnail strip (60px wide)
- Main image area with click-to-zoom (lightbox)
- Hover on main image shows magnifying glass cursor
- Thumbnails scroll if more than 6 visible

---

### Product Page: Accordion Content Specs

**Accordion 1 — Details:**
```
Style: 81080
Padded underwired spacer bra with smooth, seamless cups 
for a natural rounded silhouette. Features adjustable 
straps, 3-position hook-and-eye closure, and powermesh 
side panels for a secure fit.
```

**Accordion 2 — Materials & Care:**
```
Composition: 78% Polyamide, 22% Elastane
Cup lining: 100% Polyester spacer foam

Care:
• Hand wash at 30°C or use lingerie bag in delicates cycle
• Do not tumble dry
• Air dry flat, reshape cups while damp
• Do not iron
• Do not bleach
```

**Accordion 3 — Shipping & Returns:**
```
Shipping:
• Free standard shipping on orders over €75
• Standard delivery: 3-5 business days (EU)
• Express delivery: 1-2 business days (+€9.95)
• International shipping available

Returns:
• 30-day hassle-free returns
• Free return shipping within EU
• Items must be unworn with tags attached
• Refund processed within 5 business days
```

**Accordion 4 — The Craft Behind This Piece (Conturelle exclusive):**
```
This bra is assembled from 80 individual components — 
each one precision-cut, sewn, and finished by skilled 
artisans at our European production facilities. 

From the yarn selection to the final quality inspection, 
we control every step of the supply chain. This is how 
we've been guaranteeing perfect fit for 140 years.

[DISCOVER OUR HERITAGE →]
```

---

### Product Page: Cross-Sell "Complete the Look" — Detailed Spec

**Logic:** Show products that share the same `collection_handle` AND `color_tag` metafield as the current product. If no exact colorway match, show same collection in closest color.

**Mobile layout:**
```
┌──────────────────────────────────┐
│ COMPLETE THE LOOK                │
│ "Pair with the matching brief    │
│  for a seamless set"            │
│                                  │
│ ┌────────────┐ ┌────────────┐   │
│ │            │ │            │   │
│ │  [IMAGE]   │ │  [IMAGE]   │   │
│ │            │ │            │   │
│ │ Matching   │ │ Matching   │   │
│ │ Brief      │ │ Thong      │   │
│ │            │ │            │   │
│ │ ● ● ●     │ │ ● ● ●     │   │  ← Same color swatches
│ │            │ │            │   │
│ │ €39.00     │ │ €35.00     │   │
│ │            │ │            │   │
│ │ Size:      │ │ Size:      │   │
│ │ [S][M][L]  │ │ [S][M][L]  │   │  ← Inline size picker
│ │ [XL]       │ │ [XL]       │   │
│ │            │ │            │   │
│ │ [+ ADD]    │ │ [+ ADD]    │   │  ← AJAX add, no page reload
│ └────────────┘ └────────────┘   │
│                                  │
│ ┌──────────────────────────────┐│
│ │                              ││
│ │  🎁 BUNDLE & SAVE 15%       ││  ← Highlighted bundle box
│ │                              ││
│ │  Silhouette Spacer Bra      ││
│ │  + Matching Brief            ││
│ │                              ││
│ │  ~~€128.00~~ €108.80        ││
│ │  You save: €19.20            ││
│ │                              ││
│ │  Select brief size:          ││
│ │  [S] [M] [L] [XL]           ││
│ │                              ││
│ │  ┌────────────────────────┐  ││
│ │  │  ADD SET TO CART       │  ││
│ │  └────────────────────────┘  ││
│ │                              ││
│ └──────────────────────────────┘│
│                                  │
└──────────────────────────────────┘
```

**Bundle box styling:**
```css
.bundle-offer {
  background: rgba(74,24,37,0.2);
  border: 1px solid rgba(201,169,110,0.2);
  padding: 24px;
  margin-top: 16px;
}
.bundle-badge {
  font-size: 9px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 12px;
}
.bundle-savings {
  font-size: 11px;
  color: var(--success);
  margin-top: 4px;
}
```

**Tech:** Rebuy "Complete the Look" widget or Shopify Bundles app. Cross-sell products linked via product metafield `matching_products` (list of handles).

---

### Product Page: Upsell "You May Also Love" — Detailed Spec

**Logic:** AI-powered recommendations (Rebuy) based on:
1. Same category, different style (if viewing spacer bra → show lace bra, t-shirt bra)
2. Browsing history (what else this visitor has viewed)
3. "Customers who bought this also bought" collaborative filtering
4. Never show the product they're currently viewing
5. Never show the cross-sell items already shown above

**Mobile layout:**
```
┌──────────────────────────────────┐
│ YOU MAY ALSO LOVE                │
│                                  │
│ ┌─────────┐┌─────────┐┌─────   │
│ │         ││         ││        │
│ │ [IMAGE] ││ [IMAGE] ││ [IM   │  ← 2.3 cards visible
│ │         ││         ││        │     Swipe gesture
│ │[NEW]    ││         ││        │     Same card component
│ │         ││         ││        │     as homepage bestsellers
│ │ Name    ││ Name    ││ Na    │
│ │ ★★★★★  ││ ★★★★☆  ││ ★★    │
│ │ ● ● ●  ││ ● ●    ││ ●     │
│ │ €79     ││ €89     ││ €9    │
│ │         ││         ││        │
│ │[QUICK   ││[QUICK   ││[QU    │
│ │ ADD]    ││ ADD]    ││ AD    │
│ └─────────┘└─────────┘└─────   │
│          ← swipe →              │
└──────────────────────────────────┘
```

**Quick Add behavior on mobile:**
1. Tap "Quick Add" → card expands downward showing size picker
2. Select band size → select cup size → "Add to Cart" button appears
3. Tap "Add to Cart" → item added, mini success toast shows at top
4. Card collapses back to normal

**Tech:** Rebuy AI-powered recommendations widget. Configure:
- Rule 1: Same collection, exclude current product
- Rule 2: Collaborative filtering ("bought together")
- Rule 3: Fallback to bestsellers if < 4 recommendations
- Display: 8 products in carousel, 4 visible on desktop, 2.3 on mobile

---

### Product Page: Sticky Mobile ATC Bar — Detailed Spec

```
STICKY BAR — appears when main ATC button scrolls out of view

┌──────────────────────────────────────────┐
│                                          │
│  Silhouette Spacer    ~~€89~~ €62.30    │
│  80D · Champagne      ┌──────────────┐  │
│                        │ ADD TO CART  │  │
│                        └──────────────┘  │
│                                          │
└──────────────────────────────────────────┘

Height: 64px + env(safe-area-inset-bottom)
Background: var(--dark) with top border
```

**States:**
- **No size selected:** Button reads "SELECT SIZE ↑" in muted style. Tapping scrolls page up to size picker with a highlight animation on the picker.
- **Size selected:** Button reads "ADD TO CART — €62.30" in full gold CTA style.
- **Adding:** Button shows spinner for 300ms then "✓ ADDED" in green for 1.5s, then reverts.
- **Out of stock:** Button reads "SOLD OUT — NOTIFY ME" and triggers back-in-stock email capture.

```css
.sticky-atc {
  display: none;
}
@media (max-width: 768px) {
  .sticky-atc {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 160; /* above mobile bottom nav */
    background: var(--dark);
    border-top: 1px solid rgba(201,169,110,0.2);
    padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
    display: flex;
    align-items: center;
    justify-content: space-between;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  .sticky-atc.visible {
    transform: translateY(0);
  }
  .sticky-atc-info {
    flex: 1;
  }
  .sticky-atc-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 14px;
    color: var(--cream);
  }
  .sticky-atc-variant {
    font-size: 9px;
    color: rgba(245,239,232,0.4);
    letter-spacing: 0.1em;
  }
  .sticky-atc-btn {
    padding: 14px 24px;
    background: var(--gold);
    color: var(--dark);
    border: none;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    min-height: 44px;
  }
  
  /* Hide mobile bottom nav when sticky ATC is showing */
  .sticky-atc.visible ~ .mobile-bottom-nav {
    transform: translateY(100%);
  }
}
```

**JS (Intersection Observer):**
```javascript
const mainATC = document.querySelector('.product-atc-btn');
const stickyBar = document.querySelector('.sticky-atc');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    stickyBar.classList.toggle('visible', !entry.isIntersecting);
  });
}, { threshold: 0 });

observer.observe(mainATC);
```

---

## CART DRAWER — Complete Wireframe (Mobile-First)

The cart should NEVER be a separate page. It's a slide-out drawer from the right side. This keeps the shopping flow unbroken and enables upselling.

```
CART DRAWER — Slides from right
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Overlay: rgba(0,0,0,0.6) on rest of page
Width: 100vw on mobile, 420px on desktop
Transition: slide-in 0.3s ease

┌────────────────────────────────┐
│  YOUR CART (2)            ✕    │  ← Item count + close button
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐ │
│  │ 🎉 You're €13 away from │ │  ← Free shipping progress bar
│  │    FREE SHIPPING!        │ │
│  │ ████████████████░░░░░░░░ │ │     Fills as cart total grows
│  │ €62.30 / €75.00          │ │     Turns gold when reached
│  └──────────────────────────┘ │
│                                │
│ ── CART ITEMS ──────────────── │
│                                │
│  ┌──────┐  Silhouette         │
│  │      │  Spacer Bra         │
│  │[IMG] │  80D · Champagne    │
│  │      │                     │
│  │      │  ~~€89~~ €62.30    │
│  └──────┘                     │
│            Qty: [−] 1 [+]     │  ← Quantity adjuster
│            [Remove]            │  ← Text link, muted
│                                │
│  ─────────────────────────    │
│                                │
│  ┌──────┐  Matching Brief     │
│  │      │  M · Champagne      │
│  │[IMG] │                     │
│  │      │  €39.00             │
│  └──────┘                     │
│            Qty: [−] 1 [+]     │
│            [Remove]            │
│                                │
│ ── CART UPSELL ────────────── │  ← THIS IS THE KEY CRO SECTION
│                                │
│  "Complete Your Order"         │
│                                │
│  ┌──────────────────────────┐ │
│  │ 🎁 Add matching thong    │ │  ← Contextual upsell
│  │    and SAVE 10%           │ │     Based on what's in cart
│  │                          │ │
│  │  ┌────┐ Matching Thong   │ │
│  │  │IMG │ Champagne        │ │
│  │  └────┘ ~~€35~~ €31.50  │ │
│  │                          │ │
│  │  Size: [S][M][L][XL]    │ │  ← Inline size picker
│  │                          │ │
│  │  [+ ADD TO CART]         │ │  ← Adds without closing drawer
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │ 👀 Bestseller:           │ │  ← Second upsell slot
│  │ Provence Lace Bra        │ │
│  │                          │ │
│  │  ┌────┐ €79.00           │ │
│  │  │IMG │                  │ │
│  │  └────┘ [VIEW PRODUCT →] │ │  ← Links to PDP (opens in
│  │                          │ │     background, drawer stays)
│  └──────────────────────────┘ │
│                                │
│ ── ORDER SUMMARY ───────────── │
│                                │
│  Subtotal:          €101.30   │
│  Shipping:     Calculated at  │
│                checkout       │
│                                │
│  ┌──────────────────────────┐ │
│  │ Got a discount code?      │ │  ← Expandable field
│  │ [Enter code] [APPLY]     │ │
│  └──────────────────────────┘ │
│                                │
│  ─────────────────────────    │
│  TOTAL:             €101.30   │  ← Large, clear
│  or 4 × €25.33 with Klarna  │  ← BNPL reminder
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │     CHECKOUT — €101.30   │ │  ← Primary CTA, full-width
│  │                          │ │     Gold bg, 52px height
│  └──────────────────────────┘ │
│                                │
│  [Continue Shopping]           │  ← Text link, closes drawer
│                                │
│  ✓ Free returns · 🔒 Secure  │  ← Mini trust bar
│  ✓ Crafted in Europe          │
│                                │
│  [PayPal] [Klarna] [G Pay]   │  ← Express checkout buttons
│                                │
└────────────────────────────────┘
```

### Cart Upsell Logic (Rebuy or Custom)

| If cart contains… | Show upsell… | Offer |
|-------------------|-------------|-------|
| Bra only | Matching brief/thong in same color | "Save 10% — add the match" |
| Brief only | Matching bra in same color | "Complete the set — save 15%" |
| Bra + brief (no thong) | Matching thong | "Add the thong — save 10%" |
| Any 2+ items | Bestseller not in cart | "Bestseller pick" (no discount) |
| Cart total < €75 | Item that pushes over free shipping threshold | "Add €X more for FREE shipping" |
| Cart total ≥ €75 | Premium product (highest margin) | "Treat yourself — you've earned free shipping" |

### Free Shipping Progress Bar Spec

```css
.shipping-progress {
  background: rgba(201,169,110,0.1);
  padding: 12px 16px;
  border: 1px solid rgba(201,169,110,0.15);
  margin-bottom: 16px;
}
.shipping-bar {
  height: 4px;
  background: rgba(245,239,232,0.1);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}
.shipping-bar-fill {
  height: 100%;
  background: var(--gold);
  border-radius: 2px;
  transition: width 0.4s ease;
}
/* When threshold reached */
.shipping-bar-fill.complete {
  background: var(--success);
}
.shipping-msg {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--gold);
}
.shipping-msg.complete {
  color: var(--success);
}
/* Message changes:
   Below threshold: "You're €X away from FREE SHIPPING!"
   At/above threshold: "🎉 You've unlocked FREE SHIPPING!" */
```

**Tech:** Rebuy Smart Cart (includes upsell logic, progress bar, drawer UI) OR custom Liquid + AJAX Cart API.

---

## CHECKOUT PAGE — Complete CRO Wireframe

Shopify checkout customization depends on the plan:
- **Shopify Basic/Shopify:** Limited — use checkout extensions (Shopify Functions + UI extensions) or post-purchase apps
- **Shopify Plus:** Full checkout.liquid customization

This wireframe covers what's achievable on standard Shopify plans + what opens up on Plus.

---

### Checkout: Mobile Wireframe (Standard Shopify + Extensions)

```
CHECKOUT PAGE — Mobile
━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────┐
│  CONTURELLE by Felina          │  ← Brand logo (top-left)
│  ───────────────────────────── │
│  Secure Checkout 🔒            │
├────────────────────────────────┤
│                                │
│ ── EXPRESS CHECKOUT ────────── │
│                                │
│  ┌──────────────────────────┐ │
│  │      [Shop Pay]          │ │  ← Express checkout buttons
│  └──────────────────────────┘ │     (Shopify native)
│  ┌───────────┐┌─────────────┐ │
│  │  [G Pay]  ││ [Apple Pay] │ │
│  └───────────┘└─────────────┘ │
│  ┌──────────────────────────┐ │
│  │      [PayPal]            │ │
│  └──────────────────────────┘ │
│                                │
│  ── or ──                     │
│                                │
│ ── CONTACT ─────────────────── │
│                                │
│  Email:                        │
│  ┌──────────────────────────┐ │
│  │ you@email.com            │ │
│  └──────────────────────────┘ │
│  ☑ Email me with news and    │
│    offers (pre-checked)       │  ← Klaviyo opt-in
│                                │
│ ── SHIPPING ADDRESS ────────── │
│                                │
│  [Standard address form]       │
│                                │
│ ── SHIPPING METHOD ──────────  │
│                                │
│  ○ Standard (3-5 days)  FREE  │  ← If over €75
│  ○ Express (1-2 days) €9.95   │
│                                │
│ ── ORDER BUMP ────────────── │  ← KEY CRO ELEMENT
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │  ☐ ADD: Lingerie Wash   │ │  ← Checkbox upsell
│  │     Bag (€4.95)          │ │     Pre-selected = NO
│  │                          │ │
│  │  ┌────┐ Protect your     │ │     Low-cost, high-margin,
│  │  │IMG │ investment.      │ │     relevant to every order
│  │  └────┘ Extend the life  │ │
│  │  of your Conturelle      │ │
│  │  with our premium mesh   │ │
│  │  wash bag.               │ │
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │  ☐ ADD: Gift Wrapping   │ │  ← Second order bump
│  │     (€6.95)              │ │
│  │                          │ │
│  │  Premium gift box with   │ │
│  │  ribbon and personalized │ │
│  │  note card.              │ │
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
│ ── PAYMENT ────────────────── │
│                                │
│  ○ Credit card               │
│    ┌──────────────────────┐  │
│    │ Card number           │  │
│    └──────────────────────┘  │
│    ┌──────────┐┌──────────┐  │
│    │ Expiry   ││ CVV      │  │
│    └──────────┘└──────────┘  │
│                                │
│  ○ Klarna — Pay in 4          │
│  ○ PayPal                     │
│                                │
│ ── DISCOUNT CODE ───────────── │
│                                │
│  ┌────────────────┐ [APPLY]   │
│  │ Enter code     │           │
│  └────────────────┘           │
│                                │
│ ── ORDER SUMMARY ───────────── │
│                                │
│  ┌──────┐ Silhouette Spacer  │
│  │ IMG  │ 80D · Champagne    │
│  └──────┘ ~~€89~~ €62.30    │
│                                │
│  ┌──────┐ Matching Brief     │
│  │ IMG  │ M · Champagne      │
│  └──────┘ €39.00             │
│                                │
│  Subtotal:          €101.30   │
│  Shipping:              FREE  │
│  Wash Bag:             €4.95  │  ← If order bump checked
│  Discount (10%):     -€10.13  │  ← If code applied
│  ─────────────────────────    │
│  TOTAL:              €96.12   │
│                                │
│ ── TRUST SIGNALS ───────────── │
│                                │
│  🔒 256-bit SSL Encryption    │
│  ✓ 30-Day Money-Back Guarantee│
│  ✓ Secure Payment Processing  │
│  🇪🇺 Made in Europe           │
│                                │
│  [Visa][MC][Amex][PayPal]     │  ← Payment method logos
│  [Klarna][Apple Pay][G Pay]   │
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │   COMPLETE ORDER         │ │  ← Final CTA
│  │                          │ │     Gold bg, 56px height
│  └──────────────────────────┘ │
│                                │
│  By placing this order, you   │
│  agree to our Terms of Service│
│  and Privacy Policy.          │
│                                │
└────────────────────────────────┘
```

---

### Checkout: Post-Purchase Upsell Page

After the customer clicks "Complete Order" and payment is confirmed, BEFORE the thank-you page, show a one-time upsell offer. This is the highest-converting upsell placement in all of e-commerce (10-15% acceptance rate typical).

```
POST-PURCHASE UPSELL — One-click offer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────┐
│  CONTURELLE by Felina          │
│  ───────────────────────────── │
│  Thank you! Your order is      │
│  confirmed. 🎉                │
├────────────────────────────────┤
│                                │
│  WAIT — EXCLUSIVE OFFER        │
│  (for the next 10:00 only)     │  ← Countdown timer
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │  [PRODUCT IMAGE]         │ │
│  │                          │ │
│  │  Provence Lace Bra       │ │
│  │  Our #1 Bestseller       │ │
│  │                          │ │
│  │  ~~€79.00~~ €55.30       │ │  ← 30% off (post-purchase
│  │  SAVE 30%                │ │     exclusive pricing)
│  │                          │ │
│  │  This offer won't be     │ │
│  │  available again.        │ │
│  │                          │ │
│  │  Size: [same as order]   │ │  ← Pre-selected based on
│  │  Color: ● ● ● ●        │ │     what they just bought
│  │                          │ │
│  │  ┌────────────────────┐  │ │
│  │  │  YES — ADD TO MY   │  │ │  ← One-click add
│  │  │  ORDER (€55.30)    │  │ │     No re-entering payment
│  │  └────────────────────┘  │ │     Charges same payment
│  │                          │ │     method automatically
│  │  [No thanks, continue    │ │
│  │   to my order summary]   │ │  ← Skip link
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
│  ✓ Same-shipment delivery     │  ← Reassurance
│  ✓ 30-day return policy       │
│  ✓ One-click, no re-entering  │
│    payment info               │
│                                │
└────────────────────────────────┘
```

**Post-purchase upsell logic:**

| Customer just bought… | Offer them… | Discount | Why |
|----------------------|-------------|----------|-----|
| Single bra | Bestseller bra in different style | 30% off | Try another style |
| Bra + brief set | Premium lace bra | 25% off | Upgrade occasion |
| Single brief | Matching bra | 20% off | Complete the set |
| Any order < €100 | Wash bag + 2-pack | 40% off bundle | Low-cost add-on |
| Any order ≥ €150 | Gift card (€25 for €20) | €5 free | Return visit incentive |

**Tech:**
- **ReConvert** (post-purchase upsell app, works on all Shopify plans) — ~$5/mo
- OR **AfterSell** (similar, slightly better UI) — ~$8/mo
- OR **Rebuy** (if already using for cart upsells, includes post-purchase) — included in $99/mo

---

### Checkout: Thank You / Order Confirmation Page

```
THANK YOU PAGE — Post-purchase CRO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌────────────────────────────────┐
│  CONTURELLE by Felina          │
├────────────────────────────────┤
│                                │
│  ✓ ORDER CONFIRMED             │
│  Order #CN-10042               │
│                                │
│  Thank you, [First Name]!      │
│  Your order is being prepared  │
│  with the same care we put     │
│  into every stitch.            │
│                                │
│  Confirmation email sent to    │
│  [email@domain.com]            │
│                                │
│ ── ORDER DETAILS ──────────── │
│  [Standard order summary]      │
│                                │
│ ── WHAT'S NEXT ────────────── │
│                                │
│  📧 Confirmation email sent   │
│  📦 Shipping notification     │
│     within 24 hours            │
│  🚚 Delivery in 3-5 days      │
│                                │
│ ── SHARE & EARN ──────────── │  ← Referral program
│                                │
│  ┌──────────────────────────┐ │
│  │                          │ │
│  │  Give €10, Get €10       │ │
│  │                          │ │
│  │  Share your unique link  │ │
│  │  with a friend. They     │ │
│  │  get €10 off their first │ │
│  │  order, you get €10 off  │ │
│  │  your next.              │ │
│  │                          │ │
│  │  Your link:              │ │
│  │  conturelle.com/ref/XK92 │ │
│  │  [COPY LINK] [SHARE]    │ │
│  │                          │ │
│  └──────────────────────────┘ │
│                                │
│ ── SOCIAL FOLLOW ──────────── │
│                                │
│  Follow us for styling tips    │
│  and new arrivals:             │
│                                │
│  [Instagram] [TikTok]         │
│  [Pinterest] [Facebook]       │
│                                │
│ ── FIT QUIZ INVITE ────────── │
│                                │
│  Haven't taken our Fit Quiz   │
│  yet? Get personalized size    │
│  recommendations for your     │
│  next order.                   │
│                                │
│  [TAKE THE FIT QUIZ →]        │
│                                │
│ ── CONTINUE SHOPPING ──────── │
│                                │
│  ┌──────┐ ┌──────┐ ┌──────┐ │  ← Bestseller carousel
│  │      │ │      │ │      │ │
│  │      │ │      │ │      │ │
│  └──────┘ └──────┘ └──────┘ │
│      Bestsellers to explore   │
│                                │
└────────────────────────────────┘
```

**Tech:**
- Referral: **ReferralCandy** or **Smile.io** — ~$49/mo (launch in Month 2)
- Thank you page customization: **ReConvert** (same app as post-purchase upsell) or Shopify's native thank-you page sections (limited)
- Social follow: static HTML, no app needed

---

### Checkout: Order Bump Product Recommendations

Low-cost, high-margin add-ons that make sense for every lingerie order:

| Order Bump Product | Price | Margin | Why it works |
|-------------------|-------|--------|-------------|
| Lingerie Wash Bag | €4.95 | ~85% | Protects their investment, universal need |
| Gift Wrapping | €6.95 | ~90% | Gifting occasion, premium unboxing |
| Stain Remover Pen (lingerie-safe) | €3.95 | ~80% | Care product, impulse add |
| Extended Return Window (60 days) | €2.95 | 100% | Reduces return anxiety, pure margin |
| Matching Hair Scrunchie (same fabric) | €9.95 | ~75% | Instagram-friendly, color-matched |

**Rule:** Maximum 2 order bumps visible at checkout. Rotate based on A/B test performance. Never show more than 2 — decision fatigue kills conversion.

---

## Shopify App Stack (Updated with Full Funnel)

### Essential (Launch Day)

| App | Purpose | Where It Works | Monthly Cost |
|-----|---------|---------------|-------------|
| **Klaviyo** | Email/SMS capture, popups, welcome flows, abandoned cart | Homepage, popup, checkout opt-in | Free ≤250 contacts |
| **Judge.me** | Product reviews, photo reviews, fit feedback, star ratings | Product page, homepage cards | Free tier |
| **Kiwi Sizing** | Size guide modal, fit quiz | Product page, homepage CTA | ~$7 |
| **Pandectes GDPR** | Cookie consent, GDPR compliance | Sitewide | ~$15 |
| **ReConvert** or **AfterSell** | Post-purchase upsell, thank you page customization, order bumps | Checkout, post-purchase | ~$8 |

### Growth (Month 2-3)

| App | Purpose | Where It Works | Monthly Cost |
|-----|---------|---------------|-------------|
| **Rebuy** | Cart upsells, cross-sell, AI recs, smart cart drawer | Cart drawer, PDP, homepage | ~$99 |
| **Klarna On-Site Messaging** | BNPL installment display | PDP, cart, checkout | Free |
| **Instafeed** | Instagram UGC feed widget | Homepage UGC section | ~$6 |
| **Back in Stock** | Restock alerts for OOS sizes | PDP (out-of-stock variants) | ~$19 |

### Optimization (Month 3+)

| App | Purpose | Where It Works | Monthly Cost |
|-----|---------|---------------|-------------|
| **Hotjar / Lucky Orange** | Heatmaps, session recordings | Sitewide | Free tier |
| **Swatch King** | Advanced color variant swatches | PDP, collection page | ~$15 |
| **ReferralCandy** or **Smile.io** | Referral program (Give €10, Get €10) | Thank you page, email | ~$49 |
| **Gorgias** or **Shopify Inbox** | Live chat / chatbot for sizing help | Sitewide (floating widget) | Free–$50 |

---

## Mobile-First Responsive System (Complete)

The Velour template has NO mobile CSS. This complete responsive layer covers homepage, product page, cart, and checkout.

```css
/* ══════════════════════════════════════════
   MOBILE-FIRST BASE (< 768px)
   Design for mobile first, scale up
   ══════════════════════════════════════════ */

/* Global mobile rules */
@media (max-width: 768px) {
  
  /* ── TYPOGRAPHY ── */
  .hero-title { font-size: 38px; }
  .section-title { font-size: 32px; }
  .editorial-heading { font-size: 28px; }
  .banner-title { font-size: 36px; }
  .section-num { font-size: 48px; }
  
  /* ── SPACING ── */
  section, .editorial, .collection, footer {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  /* ── NAVIGATION ── */
  nav { 
    padding: 12px 20px;
    top: 36px; /* below announcement bar */
  }
  .nav-links { display: none; }
  .nav-hamburger { 
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    min-width: 44px;
    min-height: 44px;
    justify-content: center;
  }
  .nav-hamburger span {
    width: 20px;
    height: 1px;
    background: var(--cream);
    transition: transform 0.3s;
  }
  
  /* ── HERO ── */
  .hero { min-height: 85vh; } /* leave room for CTA visibility */
  .hero-coords, .hero-badge { display: none; }
  .hero-tagline { font-size: 8px; }
  .hero-eyebrow { font-size: 8px; margin-bottom: 16px; }
  .hero-sub { font-size: 9px; margin-top: 16px; }
  .hero-cta {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 32px;
    padding: 16px 24px;
  }
  .hero-cta-secondary {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 12px;
    padding: 12px;
  }
  
  /* ── BRAG BAR ── */
  .brag-bar {
    flex-direction: column;
    gap: 8px;
    padding: 12px 20px;
  }
  .brag-separator { display: none; }
  
  /* ── CATEGORY TILES ── */
  .category-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 2px;
    padding: 0 20px 40px;
  }
  .category-tile {
    min-width: 65vw;
    scroll-snap-align: start;
    flex-shrink: 0;
  }
  
  /* ── EDITORIAL / HERITAGE ── */
  .editorial {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 60px 20px;
  }
  .editorial-left {
    flex-direction: row;
    justify-content: space-between;
    order: 2;
  }
  .editorial-center { order: 1; }
  .editorial-right { 
    text-align: left;
    order: 3;
  }
  .editorial-right .gold-line { margin-left: 0; }
  .editorial-right .line-link { align-self: flex-start; }
  
  /* ── PRODUCT GRID ── */
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
  }
  .product-name { font-size: 16px; }
  .product-price { font-size: 14px; }
  .product-hover-cta {
    /* Always visible on mobile (no hover state) */
    opacity: 1;
    transform: translateX(-50%) translateY(0);
    font-size: 8px;
  }
  
  /* ── FEATURE STRIP ── */
  .feature-strip {
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 40px 20px;
  }
  .feature-item {
    border-right: none;
    padding: 0;
    border-bottom: 1px solid rgba(201,169,110,0.08);
    padding-bottom: 24px;
  }
  .feature-item:last-child { border-bottom: none; }
  
  /* ── BANNER ── */
  .banner { min-height: 400px; }
  .banner-content { padding: 48px 20px; }
  .banner-cta {
    flex-direction: column;
    gap: 16px;
    align-items: center;
  }
  .btn-primary {
    display: block;
    width: 100%;
    text-align: center;
    padding: 16px;
  }
  
  /* ── EMAIL CAPTURE ── */
  .email-capture { padding: 60px 20px; }
  .email-form {
    flex-direction: column;
    width: 100%;
    gap: 12px;
  }
  .email-input {
    border-right: 1px solid rgba(201,169,110,0.2);
    text-align: center;
  }
  
  /* ── UGC GRID ── */
  .ugc-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 12px;
    padding: 0 20px 40px;
  }
  .ugc-card {
    min-width: 260px;
    scroll-snap-align: start;
    flex-shrink: 0;
  }
  
  /* ── FOOTER ── */
  footer {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 40px 20px;
  }
  .footer-bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 20px;
  }
  .footer-corner { display: none; }
  
  /* ── PRODUCT PAGE MOBILE ── */
  .pdp-gallery {
    width: 100vw;
    margin: 0 -20px;
  }
  .pdp-gallery-carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }
  .pdp-gallery-slide {
    min-width: 100vw;
    scroll-snap-align: start;
    aspect-ratio: 3/4;
  }
  .pdp-thumbstrip {
    display: flex;
    gap: 4px;
    padding: 8px 20px;
    overflow-x: auto;
  }
  .pdp-thumb {
    width: 48px; height: 48px;
    border: 1px solid rgba(201,169,110,0.15);
    flex-shrink: 0;
  }
  .pdp-thumb.active { border-color: var(--gold); }
  
  .pdp-buybox { padding: 20px; }
  
  .size-picker {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 8px 0;
  }
  .size-btn {
    min-width: 48px;
    min-height: 44px; /* thumb target */
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: 1px solid rgba(201,169,110,0.25);
    color: var(--cream);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .size-btn.selected {
    background: var(--gold);
    color: var(--dark);
    border-color: var(--gold);
  }
  .size-btn.oos {
    opacity: 0.3;
    text-decoration: line-through;
    pointer-events: none;
  }
  
  .pdp-atc-btn {
    width: 100%;
    padding: 16px;
    min-height: 52px;
    background: var(--gold);
    color: var(--dark);
    border: none;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    cursor: pointer;
  }
  
  /* Accordions */
  .pdp-accordion {
    border-top: 1px solid rgba(201,169,110,0.1);
    padding: 16px 0;
  }
  .pdp-accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    color: var(--cream);
    font-size: 12px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    padding: 4px 0;
    min-height: 44px;
  }
  .pdp-accordion-body {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    font-size: 12px;
    line-height: 1.8;
    color: rgba(245,239,232,0.5);
  }
  .pdp-accordion.open .pdp-accordion-body {
    max-height: 500px;
    padding-top: 12px;
  }
  
  /* Cross-sell */
  .crosssell-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  
  /* Upsell carousel */
  .upsell-carousel {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 12px;
    padding: 0 20px;
  }
  .upsell-card {
    min-width: 160px;
    scroll-snap-align: start;
    flex-shrink: 0;
  }
}

/* ══════════════════════════════════════════
   SMALL MOBILE (< 380px — iPhone SE etc.)
   ══════════════════════════════════════════ */
@media (max-width: 380px) {
  .hero-title { font-size: 32px; }
  .product-grid { grid-template-columns: 1fr; }
  .feature-strip { grid-template-columns: 1fr; }
  .crosssell-grid { grid-template-columns: 1fr; }
  .size-btn { min-width: 42px; }
}

/* ══════════════════════════════════════════
   TABLET (768px — 1024px)
   ══════════════════════════════════════════ */
@media (min-width: 769px) and (max-width: 1024px) {
  .editorial {
    grid-template-columns: 1fr 1fr;
  }
  .editorial-left { display: none; } /* show stats inline instead */
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}
```

---

## Performance Optimization Notes

1. **Silk canvas animation:** Throttle to 30fps on mobile via `requestAnimationFrame` with frame skipping. Pause completely when page is not visible (`document.hidden`). Disable entirely on devices with `prefers-reduced-motion: reduce`.
2. **Font loading:** Append `&display=swap` to Google Fonts URL to prevent invisible text flash.
3. **Images:** When real product photos replace SVG placeholders, use WebP at 2x max, lazy load everything below the fold with `loading="lazy"`.
4. **JS:** The template's JS is ~160 lines. Cart drawer, sticky ATC, and upsell logic will add ~200 more. Keep total under 400 lines — no jQuery, no heavy libraries.
5. **Critical CSS:** Inline the above-fold CSS in `<head>`, defer the rest.
6. **Target Core Web Vitals:** LCP < 2.5s, FID < 100ms, CLS < 0.1.

---

## Implementation Priority (Updated with Full Funnel)

| Phase | Tasks | Timeline |
|-------|-------|----------|
| **Phase 1: Critical Fixes** | Rebrand, remove custom cursor, add mobile CSS, announcement bar, hero CTAs, fix footer policy links | Week 1 |
| **Phase 2: Homepage CRO** | Product card enhancements (badges, stars, swatches), heritage section, feature strip, email capture, category tiles, UGC section | Week 2 |
| **Phase 3: Product Page** | Build complete PDP: gallery, buy box with size pickers, accordions, cross-sell with bundle, upsell carousel, reviews, sticky mobile ATC | Week 2-3 |
| **Phase 4: Cart & Checkout** | Cart drawer with upsells + free shipping bar, checkout order bumps, post-purchase upsell page, thank you page CRO | Week 3 |
| **Phase 5: Apps & Integrations** | Install Judge.me, Klaviyo, Kiwi Sizing, ReConvert/AfterSell, Rebuy. Configure flows and automation. | Week 3-4 |
| **Phase 6: Polish & Launch** | Performance optimization, A/B test setup, GA4 + Hotjar install, cross-device QA, accessibility audit | Week 4 |

---

## Conversion Funnel Summary

```
VISITOR LANDS (paid ad / organic)
    │
    ▼
┌─────────────────────┐
│  HOMEPAGE            │  ← Hero CTA, category tiles, bestsellers
│  Trust bar, heritage │     Email popup captures non-buyers
│  Email capture       │     Fit quiz reduces size anxiety
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  PRODUCT PAGE        │  ← Gallery, size picker, reviews, trust
│  Cross-sell bundle   │     "Complete the Look" increases AOV
│  Upsell carousel     │     Sticky ATC on mobile prevents bounce
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  CART DRAWER         │  ← Free shipping progress bar
│  Cart upsell         │     Contextual product upsell
│  Express checkout    │     Discount code field
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  CHECKOUT            │  ← Express pay (Shop Pay, Apple Pay)
│  Order bumps         │     Wash bag / gift wrap add-ons
│  Trust signals       │     Klarna BNPL option
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  POST-PURCHASE       │  ← One-click upsell (30% off bestseller)
│  UPSELL              │     Pre-selected size from order
└─────────┬───────────┘
          │
          ▼
┌─────────────────────┐
│  THANK YOU PAGE      │  ← Referral program (Give €10, Get €10)
│  Social follow       │     Fit quiz invite
│  Referral program    │     Bestseller carousel
└─────────────────────┘
          │
          ▼
┌─────────────────────┐
│  POST-PURCHASE       │  ← Klaviyo flows:
│  EMAIL FLOW          │     Review request (Day 14)
│  (Klaviyo)           │     Repurchase nudge (Day 60)
│                      │     Referral reminder (Day 30)
└─────────────────────┘
```

**Revenue impact model (estimated):**

| CRO Element | Expected Impact on AOV/CVR |
|-------------|---------------------------|
| Size picker (visual vs dropdown) | +8-12% CVR |
| Product reviews (Judge.me) | +10-15% CVR |
| Cross-sell "Complete the Look" | +15-25% AOV |
| Cart upsell (Rebuy) | +8-12% AOV |
| Free shipping progress bar | +5-10% AOV |
| Order bumps (checkout) | +3-5% AOV |
| Post-purchase upsell | +5-8% revenue per order |
| Sticky mobile ATC | +5-8% mobile CVR |
| Fit quiz (reduce returns) | -20-30% return rate |

---

*This document now covers the complete conversion funnel — from homepage to post-purchase — with mobile-first wireframes for every page. Each section includes layout specs, copy direction, CSS, behavioral logic, and the Shopify app that powers it. The template's dark luxury aesthetic carries through consistently while every section earns its place by building trust, reducing friction, or driving action.*
