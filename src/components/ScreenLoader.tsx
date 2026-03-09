import React from 'react';
import { motion } from 'motion/react';
import NGLogo from './NGLogo';

export default function ScreenLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="flex flex-col items-center"
      >
        <NGLogo className="w-24 h-24 mb-4" />
        <motion.div
          className="h-1 w-32 bg-slate-100 rounded-full overflow-hidden"
        >
          <motion.div
            className="h-full bg-sky-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
