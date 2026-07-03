import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryBarProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryBar({ categories, selectedCategory, onSelect }: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-transparent pb-4 border-b border-gray-200 dark:border-gray-800">
      <button 
        onClick={() => scroll('left')}
        className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg ml-2 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ChevronLeft size={20} className="dark:text-white" />
      </button>
      
      <div 
        ref={scrollRef}
        className="container mx-auto px-10 flex items-center justify-start gap-4 overflow-x-auto no-scrollbar"
      >
        <div 
            className={`cursor-pointer px-4 py-1.5 rounded-full border whitespace-nowrap ${
              (selectedCategory === null) 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:text-gray-300'
            }`}
            onClick={() => onSelect(null)}
          >
            <span className="text-sm font-medium">All</span>
          </div>
        {categories.map((category) => (
          <div 
            key={category} 
            className={`cursor-pointer px-4 py-1.5 rounded-full border whitespace-nowrap ${
              (selectedCategory === category) 
                ? 'bg-blue-600 text-white border-blue-600' 
                : 'border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:text-gray-300'
            }`}
            onClick={() => onSelect(category)}
          >
            <span className="text-sm font-medium">{category}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={() => scroll('right')}
        className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg mr-2 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ChevronRight size={20} className="dark:text-white" />
      </button>
    </div>
  );
}
