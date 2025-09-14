"use client";

import { motion } from "framer-motion";

export default function TrustedByMothers() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="p-3 md:p-6 max-w-2xl md:max-w-6xl mx-auto"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-auto rounded-xl"
      >
        <source src="/videos/trusted_by_mothers.mp4" type="video/mp4" />
        <source src="/videos/trusted_by_mothers.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </motion.div>
  );
}
