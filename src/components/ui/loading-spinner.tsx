import React from "react";
import { motion } from "framer-motion";

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <motion.div
        className="w-16 h-16 border-4 border-teal-300 rounded-full"
        style={{ borderTopColor: "transparent" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
