import React from 'react';
import { motion } from 'motion/react';

export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-64">
      <motion.svg
        viewBox="0 0 100 100"
        className="w-20 h-20"
      >
        <motion.path
          d="M 50 50 m -40, 0 a 40,40 0 1,0 80,0 a 40,40 0 1,0 -80,0"
          fill="none"
          stroke="#2563eb"
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1, rotate: 360 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.svg>
    </div>
  );
}
