"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

const LoadingData = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        className="flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 0.5,
            type: "spring",
            bounce: 0.4,
          },
        }}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        >
          <Leaf className="w-24 h-24 text-primary" strokeWidth={1.5} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: {
              delay: 0.3,
              duration: 0.5,
            },
          }}
          className="mt-6 text-xl font-semibold text-muted-foreground"
        >
          Loading data...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoadingData;
