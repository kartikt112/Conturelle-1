'use client';

import { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import { products, categories, getProductsByCategory, sortProducts } from '@/data/products';
import s from './page.module.css';

const filterOptions = [
  { label: 'All', value: 'all' },
  ...categories.map(c => ({ label: c.name, value: c.slug })),
];

const sortOptions = [
  { label: 'Bestseller', value: 'bestseller' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const gridRef = useRef(null);

  const initialCategory = searchParams.get('category') || 'all';
  const initialSort = searchParams.get('sort') || 'bestseller';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeSort, setActiveSort] = useState(initialSort);

  // Sync from URL when params change externally
  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'bestseller';
    setActiveCategory(cat);
    setActiveSort(sort);
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    const filtered = getProductsByCategory(activeCategory);
    return sortProducts(filtered, activeSort);
  }, [activeCategory, activeSort]);

  const updateURL = (category, sort) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (sort && sort !== 'bestseller') params.set('sort', sort);
    const qs = params.toString();
    router.push(`/shop${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  const handleCategoryChange = (value) => {
    setActiveCategory(value);
    updateURL(value, activeSort);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setActiveSort(value);
    updateURL(activeCategory, value);
  };

  const handleClearFilters = () => {
    setActiveCategory('all');
    setActiveSort('bestseller');
    router.push('/shop', { scroll: false });
  };

  // Scroll-reveal for product cards
  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('[data-reveal]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [filteredProducts]);

  const categoryLabel = activeCategory === 'all'
    ? 'Collection'
    : categories.find(c => c.slug === activeCategory)?.name || 'Collection';

  return (
    <>
      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroInner}>
          <div className={s.breadcrumb}>
            <Link href="/" className={s.breadcrumbLink}>Home</Link>
            <span className={s.breadcrumbSep}>/</span>
            <span>Shop</span>
            {activeCategory !== 'all' && (
              <>
                <span className={s.breadcrumbSep}>/</span>
                <span>{categoryLabel}</span>
              </>
            )}
          </div>
          <div className={s.label}>
            <span className={s.labelLine} />
            <span className={s.labelText}>Shop the Collection</span>
          </div>
          <h1 className={s.heading}>
            Our <em>{categoryLabel}</em>
          </h1>
          <p className={s.count}>
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>
      </section>

      {/* Filter / Sort Bar */}
      <div className={s.filterBar}>
        <div className={s.filters}>
          {filterOptions.map(opt => (
            <button
              key={opt.value}
              className={`${s.filterChip} ${activeCategory === opt.value ? s.filterChipActive : ''}`}
              onClick={() => handleCategoryChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className={s.sortWrap}>
          <select
            className={s.sortSelect}
            value={activeSort}
            onChange={handleSortChange}
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <section className={s.gridSection}>
        <div className={s.grid} ref={gridRef}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, i) => (
              <div
                key={product.slug}
                data-reveal
                style={{
                  opacity: 0,
                  transform: 'translateY(20px)',
                  transition: `opacity 0.5s ease ${i * 0.06}s, transform 0.5s ease ${i * 0.06}s`,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <div className={s.empty}>
              <h2 className={s.emptyHeading}>No products found</h2>
              <p className={s.emptyText}>Try adjusting your filters to find what you are looking for.</p>
              <button className={s.emptyBtn} onClick={handleClearFilters}>
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
