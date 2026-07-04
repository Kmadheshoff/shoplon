import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import ProductCard from './ProductCard';
import { ChevronDown, ChevronUp, ArrowRight, Sparkles } from 'lucide-react';

interface CategorySectionProps {
  category: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  cart: CartItem[];
  onViewCart: () => void;
  onSelectCategory?: (category: string) => void;
  isSingleCategoryView?: boolean;
}

const categoryBannerDetails: Record<string, { image: string; title: string; subtitle: string }> = {
  'Toys': {
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=1200&h=350&fit=crop',
    title: 'Toys & Games',
    subtitle: 'Handcrafted & artisanal playthings for imaginative minds'
  },
  'Handbags': {
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&h=350&fit=crop',
    title: 'Designer Handbags',
    subtitle: 'Elegant bags & purses crafted with premium materials'
  },
  'Sarees': {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&h=350&fit=crop',
    title: 'Authentic Sarees',
    subtitle: 'Exquisite traditional weaves and luxurious silks'
  },
  'Kids': {
    image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?q=80&w=1200&h=350&fit=crop',
    title: 'Kids Fashion & Essentials',
    subtitle: 'Comfortable, vibrant, and durable styles for little ones'
  },
  'Fashion': {
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&h=350&fit=crop',
    title: 'Trendy Fashion',
    subtitle: 'Elevate your wardrobe with top curated fashion styles'
  },
  'Electronics': {
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&h=350&fit=crop',
    title: 'Smart Electronics',
    subtitle: 'Modern gadgets & innovative technology tools'
  },
  'Home': {
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1200&h=350&fit=crop',
    title: 'Home & Living Decor',
    subtitle: 'Artisanal essentials to make your space cozy and inviting'
  },
  'Beauty': {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1200&h=350&fit=crop',
    title: 'Beauty & Skincare',
    subtitle: 'Pure luxury wellness & personal care essentials'
  }
};

export default function CategorySection({
  category,
  products,
  onProductClick,
  onAddToCart,
  cart,
  onViewCart,
  onSelectCategory,
  isSingleCategoryView = false
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (products.length === 0) return null;

  const banner = categoryBannerDetails[category] || {
    image: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&h=350&fit=crop',
    title: `${category} Collection`,
    subtitle: `Explore our exclusive selection of top ${category.toLowerCase()} items`
  };

  const displayedProducts = isSingleCategoryView || isExpanded
    ? products
    : products.slice(0, 10);

  const hiddenCount = products.length - 10;

  return (
    <div className="mb-12">
      {/* Category Banner */}
      <div className="relative w-full h-40 md:h-52 rounded-2xl overflow-hidden mb-6 shadow-md border border-gray-200 dark:border-gray-800">
        <img
          src={banner.image}
          alt={banner.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/85 via-gray-950/50 to-transparent flex flex-col justify-center px-6 md:px-10 text-white">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 bg-blue-600/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
              <Sparkles size={12} /> {category}
            </span>
            <span className="text-xs font-medium text-gray-300 bg-black/40 px-2.5 py-1 rounded-full backdrop-blur-sm">
              {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-sm">
            {banner.title}
          </h2>
          <p className="text-sm md:text-base text-gray-200 max-w-lg mt-1 drop-shadow-sm">
            {banner.subtitle}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedProducts.map((product, index) => (
          <ProductCard
            key={`${product.id}-${index}`}
            product={product}
            onClick={onProductClick}
            onAddToCart={onAddToCart}
            isInCart={cart.some((item) => item.id === product.id)}
            onViewCart={onViewCart}
          />
        ))}
      </div>

      {/* Show More / Less Controls */}
      {!isSingleCategoryView && products.length > 10 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-blue-500 text-gray-800 dark:text-gray-200 rounded-full font-medium shadow-sm hover:shadow transition-all text-sm"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp size={16} />
              </>
            ) : (
              <>
                Show More ({hiddenCount} more {hiddenCount === 1 ? 'item' : 'items'}) <ChevronDown size={16} />
              </>
            )}
          </button>

          {onSelectCategory && (
            <button
              onClick={() => onSelectCategory(category)}
              className="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
            >
              Explore all {category} <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
