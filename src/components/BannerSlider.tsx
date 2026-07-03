import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const banners = [
  'https://images.unsplash.com/photo-1558981852-426c6c22a060?q=80&w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1596464716127-f2a82d65ee38?q=80&w=1200&h=400&fit=crop',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=1200&h=400&fit=crop',
];

export default function BannerSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-40 md:h-64 overflow-hidden rounded-lg">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, info) => {
          if (info.offset.x > 50) prevSlide();
          else if (info.offset.x < -50) nextSlide();
        }}
        className="relative w-full h-full"
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={currentIndex}
            src={banners[currentIndex]}
            custom={direction}
            variants={{
              enter: (d) => ({ x: d > 0 ? '100%' : '-100%' }),
              center: { x: 0 },
              exit: (d) => ({ x: d > 0 ? '-100%' : '100%' }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="absolute inset-0 w-full h-full object-cover"
            alt="Banner"
          />
        </AnimatePresence>
      </motion.div>
      <button onClick={prevSlide} className="hidden md:block absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/80">
        <ChevronLeft />
      </button>
      <button onClick={nextSlide} className="hidden md:block absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white/80">
        <ChevronRight />
      </button>
    </div>
  );
}
