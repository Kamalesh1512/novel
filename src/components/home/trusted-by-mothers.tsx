"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function TrustedByMothers() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-[#94e999] rounded-xl p-3 md:p-6 shadow-md max-w-2xl md:max-w-6xl mx-auto"
    >
      <h2 className="text-base md:text-3xl font-semibold text-gray-800 pb-5 font-serif underline">
        Why Parents Love BABIO!!!
      </h2>

      <div className="flex flex-row items-center justify-center gap-6">
        {/* Left Section (Image) */}
        <div className="md:w-3/4">
          <Image
            src="/Images/trusted_heart_logo.png"
            alt="Brand Trusted by Mothers"
            width={520}
            height={520}
            className="object-contain"
          />
        </div>

        {/* Right Section (Text) */}
        <div className="mt-2 md:mt-0">
          <p className="text-[8.5px] md:text-sm text-black leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis
            ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
            accumsan lacus vel facilisis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Quis ipsum suspendisse ultrices
            gravida. Risus commodo viverra maecenas accumsan lacus vel
            facilisis.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
