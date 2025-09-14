"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
  useMotionValue,
  useVelocity,
} from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Target,
  MessageCircle,
  Users,
  Award,
  Sparkles,
  Leaf,
  Heart,
  Shield,
  Star,
  LeafIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedCounter } from "@/components/global/interactive/animated-counter";
import { TiltCard } from "@/components/global/interactive/tiltcard";
import { CardScrollAnimation } from "@/components/global/interactive/card-scrollanimation";
import { ScrollProgressBar } from "@/components/global/interactive/scroll-progressbar";
import LeafBadgeStatsSlider from "@/components/global/interactive/leaf-badge-slider";

export default function AboutPage() {
  const { scrollY, scrollYProgress } = useScroll();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Enhanced parallax effects with scroll direction - reduced for mobile
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Multiple layer parallax - reduced intensity for mobile
  const parallaIntensity = isMobile ? 0.3 : 1;
  const y1 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -200 * parallaIntensity]
  );
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -400 * parallaIntensity]
  );
  const y3 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -600 * parallaIntensity]
  );

  // Scroll-based rotation and scale - reduced for mobile
  const heroRotate = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0, isMobile ? 2 : 5]
  );
  const heroScale = useTransform(scrollYProgress, [0, 0.2, 1], [1, 1.02, 0.98]);

  // Text reveal animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const statsOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const visionOpacity = useTransform(scrollYProgress, [0.3, 0.7], [0, 1]);

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const visionRef = useRef(null);
  const whyChooseRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const visionInView = useInView(visionRef, { once: true, amount: 0.3 });
  const whyChooseInView = useInView(whyChooseRef, { once: true, amount: 0.3 });

  const stats = [
    { value: 25, label: "Years of Experience", icon: Award },
    { value: 10, label: "Million+ Customers", icon: Users, suffix: "M+" },
    { value: 30, label: "Products", icon: Sparkles },
    { value: 10, label: "Awards Won", icon: Star },
  ];

  const reasons = [
    {
      text: "Our offer bridges your needs and our solution addresses your requirement, delivering results and performance.",
      icon: Target,
    },
    {
      text: "Our market positioning matches your requirement and our commitment resonates with you.",
      icon: Heart,
    },
    {
      text: "Our competence enables a proposal that showcases 'before vs after' clarity to your concerns.",
      icon: Eye,
    },
    {
      text: "Our market performance and customer referrals build lasting trust with you.",
      icon: Shield,
    },
    {
      text: "Price is never the only factor—you may be pleasantly surprised by what we bring to the table.",
      icon: Sparkles,
    },
  ];

  return (
    // <div className="min-h-screen relative overflow-hidden">
    //   {/* Reusable Progress Bar Component */}
    //   <ScrollProgressBar />

    //   {/* Hero Section with enhanced mobile responsiveness */}
    //   <motion.section
    //     ref={heroRef}
    //     className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 lg:px-6 py-16 sm:py-20"
    //     style={{
    //       y: y1,
    //       opacity: heroOpacity,
    //       scale: heroScale,
    //       rotateX: heroRotate,
    //     }}
    //   >
    //     <motion.div
    //       className="relative z-10 max-w-6xl mx-auto text-center"
    //       initial={{ opacity: 0, y: 100 }}
    //       animate={heroInView ? { opacity: 1, y: 0 } : {}}
    //       transition={{ duration: 1, ease: "easeOut" }}
    //     >
    //       <motion.h1
    //         className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4 sm:mb-6 leading-tight"
    //         initial={{ opacity: 0, y: 50 }}
    //         animate={heroInView ? { opacity: 1, y: 0 } : {}}
    //         transition={{ delay: 0.5, duration: 0.8 }}
    //         style={{
    //           textShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
    //         }}
    //       >
    //         NOVEL TISSUES
    //       </motion.h1>

    //       <motion.div
    //         className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2"
    //         initial={{ opacity: 0, y: 30 }}
    //         animate={heroInView ? { opacity: 1, y: 0 } : {}}
    //         transition={{ delay: 0.7, duration: 0.8 }}
    //       >
    //         <motion.p
    //           className="mb-4 sm:mb-6"
    //           whileInView={{ opacity: [0, 1], y: [20, 0] }}
    //           transition={{ duration: 0.8 }}
    //         >
    //           We have the pleasure to introducing ourselves as{" "}
    //           <strong className="text-green-700">"NOVEL TISSUES"</strong>, a
    //           leading manufacturer of wet tissues and other personal hygiene
    //           products.
    //         </motion.p>
    //         <motion.div
    //           className="flex flex-col sm:flex-row justify-center items-center gap-2"
    //           whileInView={{ opacity: [0, 1], y: [20, 0] }}
    //           transition={{ duration: 0.8, delay: 0.2 }}
    //         >
    //           <strong className="text-green-700">
    //             "Novel Tissues Pvt Ltd"
    //           </strong>{" "}
    //           <span>is an</span>
    //           <div className="flex gap-2 flex-wrap justify-center">
    //             <Badge variant="premium" className="text-xs sm:text-sm">
    //               ISO 9001:2000
    //             </Badge>{" "}
    //             <span>and</span>
    //             <Badge variant="premium" className="text-xs sm:text-sm">
    //               GMP certified
    //             </Badge>{" "}
    //           </div>
    //           <span>company.</span>
    //         </motion.div>
    //       </motion.div>

    //       <motion.div
    //         className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
    //         initial={{ opacity: 0, y: 30 }}
    //         animate={heroInView ? { opacity: 1, y: 0 } : {}}
    //         transition={{ delay: 0.9, duration: 0.8 }}
    //       >
    //         <Button
    //           onClick={() => router.push("/products")}
    //           size={isMobile ? "default" : "lg"}
    //           className="rounded-3xl w-full sm:w-auto"
    //           variant={"premiumOutline"}
    //         >
    //           Explore Products
    //         </Button>
    //       </motion.div>
    //     </motion.div>
    //   </motion.section>

    //   {/* Stats Section with mobile optimization */}
    //   <motion.section
    //     ref={statsRef}
    //     className=""
    //     style={{
    //       y: y2,
    //     }}
    //   >
    //     <div className="max-w-6xl mx-auto">
    //       <TiltCard>
    //         <Card className="bg-gradient-to-br from-green-500 to-emerald-200 border-green-200 shadow-2xl overflow-hidden">
    //           <CardContent className="p-6 sm:p-6 lg:p-8">
    //             <motion.div
    //               className="text-center mb-8 sm:mb-12"
    //               initial={{ opacity: 0, y: 30 }}
    //               animate={statsInView ? { opacity: 1, y: 0 } : {}}
    //               transition={{ duration: 0.8 }}
    //             >
    //               <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4 leading-tight px-2">
    //                 We work through every aspect at the planning
    //               </h2>
    //             </motion.div>

    //             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
    //               {stats.map((stat, index) => (
    //                 <motion.div
    //                   key={index}
    //                   className="text-center group"
    //                   initial={{ opacity: 0, scale: 0.5, y: 100 }}
    //                   animate={
    //                     statsInView ? { opacity: 1, scale: 1, y: 0 } : {}
    //                   }
    //                   transition={{ delay: index * 0.2, duration: 0.6 }}
    //                   whileHover={{
    //                     scale: isMobile ? 1.02 : 1.1,
    //                     y: isMobile ? -5 : -20,
    //                   }}
    //                   whileInView={{
    //                     rotateY: isMobile ? [0, 180] : [0, 360],
    //                     transition: { delay: index * 0.3, duration: 1 },
    //                   }}
    //                 >
    //                   <TiltCard className="bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
    //                     <motion.div
    //                       animate={{
    //                         rotate: isMobile ? [0, 5, -5, 0] : [0, 10, -10, 0],
    //                       }}
    //                       transition={{
    //                         duration: 3,
    //                         repeat: Infinity,
    //                         delay: index * 0.5,
    //                       }}
    //                     >
    //                       <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-4 text-green-700" />
    //                     </motion.div>
    //                     <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 mb-1 sm:mb-2">
    //                       <AnimatedCounter
    //                         target={stat.value}
    //                         suffix={stat.suffix || "+"}
    //                       />
    //                     </div>
    //                     <div className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wider px-1">
    //                       {stat.label}
    //                     </div>
    //                   </TiltCard>
    //                 </motion.div>
    //               ))}
    //             </div>
    //           </CardContent>
    //         </Card>
    //       </TiltCard>
    //     </div>
    //   </motion.section>
    //   <LeafBadgeStatsSlider />

    //   {/* Vision & Mission Section with better mobile spacing */}
    //   <motion.section ref={visionRef} className="px-3 sm:px-4 relative">
    //     <div className="max-w-6xl mx-auto">
    //       <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
    //         <TiltCard>
    //           <Card className="min-h-[200px] sm:h-[220px] lg:h-[250px] bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
    //             <CardContent className="p-4 sm:p-6 lg:p-8">
    //               <div className="flex items-center mb-4 sm:mb-6">
    //                 <motion.div
    //                   animate={{ scale: isMobile ? [1, 1.1, 1] : [1, 1.2, 1] }}
    //                   transition={{
    //                     duration: 10,
    //                     repeat: Infinity,
    //                     ease: "linear",
    //                   }}
    //                 >
    //                   <Eye className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 mr-3" />
    //                 </motion.div>
    //                 <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800">
    //                   Our Vision
    //                 </h3>
    //               </div>
    //               <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
    //                 To be India's most trusted name in personal hygiene and home
    //                 care, delivering products that promote health, comfort, and
    //                 dignity—from newborns to elders.
    //               </p>
    //             </CardContent>
    //           </Card>
    //         </TiltCard>

    //         <TiltCard>
    //           <Card className="min-h-[200px] sm:h-[220px] lg:h-[250px] bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
    //             <CardContent className="p-4 sm:p-6 lg:p-8">
    //               <div className="flex items-center mb-4 sm:mb-6">
    //                 <motion.div
    //                   animate={{ scale: isMobile ? [1, 1.1, 1] : [1, 1.2, 1] }}
    //                   transition={{ duration: 2, repeat: Infinity }}
    //                 >
    //                   <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 mr-3" />
    //                 </motion.div>
    //                 <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-800">
    //                   Our Mission
    //                 </h3>
    //               </div>
    //               <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
    //                 To provide safe, skin-friendly, and innovative hygiene
    //                 solutions for families across all age groups, while
    //                 upholding the highest standards of quality, care, and
    //                 customer satisfaction.
    //               </p>
    //             </CardContent>
    //           </Card>
    //         </TiltCard>
    //       </div>

    //       {/* MD Message with mobile optimization */}
    //       <TiltCard>
    //         <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200 shadow-xl">
    //           <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
    //             <div className="mb-4 sm:mb-6 flex flex-col items-center justify-center">
    //               <motion.div
    //                 whileHover={{
    //                   scale: isMobile ? 1.02 : 1.1,
    //                   rotateY: isMobile ? 180 : 360,
    //                 }}
    //                 transition={{ duration: 0.6 }}
    //               >
    //                 <Link href="/home" className="flex items-center">
    //                   <Image
    //                     src="/Images/logo_novel.png"
    //                     alt="Logo"
    //                     height={isMobile ? 250 : 350}
    //                     width={isMobile ? 250 : 350}
    //                     className="max-w-full h-auto"
    //                   />
    //                 </Link>
    //               </motion.div>
    //               <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mt-4 sm:mt-6 px-2">
    //                 Message from the Managing Director
    //               </h3>
    //             </div>

    //             <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed px-2">
    //               <motion.p
    //                 whileInView={{ opacity: [0, 1], y: [20, 0] }}
    //                 transition={{ duration: 0.8 }}
    //               >
    //                 "At Novel Tissues, we believe hygiene is not a luxury—it's a
    //                 necessity. Our journey began with a simple goal: to create
    //                 products that are safe, effective, and accessible for every
    //                 home."
    //               </motion.p>
    //               <motion.p
    //                 whileInView={{ opacity: [0, 1], y: [20, 0] }}
    //                 transition={{ duration: 0.8, delay: 0.2 }}
    //               >
    //                 "With a deep-rooted focus on quality, trust, and innovation,
    //                 we continue to grow—one product, one family, one smile at a
    //                 time. Thank you for being a part of our story."
    //               </motion.p>
    //               <motion.p
    //                 className="font-semibold text-green-800 italic text-sm sm:text-base lg:text-lg"
    //                 whileInView={{ opacity: [0, 1], y: [20, 0] }}
    //                 transition={{ duration: 0.8, delay: 0.4 }}
    //               >
    //                 — Founder, Novel Tissues Pvt. Ltd.
    //               </motion.p>
    //             </div>
    //           </CardContent>
    //         </Card>
    //       </TiltCard>
    //     </div>
    //   </motion.section>

    //   {/* Enhanced Why Choose Us Section with proper spacing and mobile responsiveness */}
    //   <motion.section
    //     ref={whyChooseRef}
    //     className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6 relative"
    //   >
    //     <div className="max-w-6xl mx-auto">
    //       <motion.div
    //         className="text-center mb-8 sm:mb-12"
    //         initial={{ opacity: 0, y: 30 }}
    //         animate={whyChooseInView ? { opacity: 1, y: 0 } : {}}
    //         transition={{ duration: 0.8 }}
    //         whileInView={{
    //           scale: [0.95, 1.02, 1],
    //           transition: { duration: 1.2 },
    //         }}
    //       >
    //         <motion.h2
    //           className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4 sm:mb-6 leading-tight px-2"
    //           animate={{
    //             backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    //           }}
    //           transition={{ duration: 5, repeat: Infinity }}
    //           style={{
    //             backgroundSize: "200% 200%",
    //             textShadow: "0 0 40px rgba(34, 197, 94, 0.3)",
    //           }}
    //         >
    //           WHY CHOOSE US
    //         </motion.h2>
    //         <motion.p
    //           className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto mb-4 sm:mb-6 px-2 leading-relaxed"
    //           whileInView={{ opacity: [0, 1], y: [30, 0] }}
    //           transition={{ duration: 0.8, delay: 0.3 }}
    //         >
    //           Why you should choose to work with us is not because how good we
    //           are presenting ourselves or how cost-effective our product seems
    //           to be.
    //         </motion.p>
    //       </motion.div>

    //       {/* Cards with advanced scroll animations and mobile optimization */}
    //       <div className="space-y-6 sm:space-y-8">
    //         {reasons.map((reason, index) => (
    //           <CardScrollAnimation
    //             key={index}
    //             reason={reason}
    //             index={index}
    //             scrollYProgress={scrollYProgress}
    //           />
    //         ))}
    //       </div>
    //     </div>
    //   </motion.section>
    // </div>
    <div className="min-h-screen relative overflow-hidden space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Reusable Progress Bar Component */}
      <ScrollProgressBar />

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 lg:px-6 py-16 sm:py-20"
        style={{
          y: y1,
          opacity: heroOpacity,
          scale: heroScale,
          rotateX: heroRotate,
        }}
      >
        <motion.div
          className="relative z-10 max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 100 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 mb-4 sm:mb-6 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{ textShadow: "0 0 30px rgba(34, 197, 94, 0.3)" }}
          >
            NOVEL TISSUES
          </motion.h1>

          <motion.div
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <motion.p
              className="mb-4 sm:mb-6"
              whileInView={{ opacity: [0, 1], y: [20, 0] }}
              transition={{ duration: 0.8 }}
            >
              We have the pleasure to introducing ourselves as{" "}
              <strong className="text-green-700">"NOVEL TISSUES"</strong>, a
              leading manufacturer of wet tissues and other personal hygiene
              products.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center items-center gap-2"
              whileInView={{ opacity: [0, 1], y: [20, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <strong className="text-green-700">
                "Novel Tissues Pvt Ltd"
              </strong>{" "}
              <span>is an</span>
              <div className="flex gap-2 flex-wrap justify-center">
                <Badge variant="premium" className="text-xs sm:text-sm">
                  ISO 9001:2000
                </Badge>{" "}
                <span>and</span>
                <Badge variant="premium" className="text-xs sm:text-sm">
                  GMP certified
                </Badge>{" "}
              </div>
              <span>company.</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button
              onClick={() => router.push("/products")}
              size={isMobile ? "default" : "lg"}
              className="rounded-3xl w-full sm:w-auto"
              variant={"premiumOutline"}
            >
              Explore Products
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        ref={statsRef}
        style={{ y: y2 }}
        className="px-3 sm:px-4 lg:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <TiltCard>
            <Card className="bg-gradient-to-br from-green-500 to-emerald-200 border-green-200 shadow-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-6 lg:p-8">
                <motion.div
                  className="text-center mb-8 sm:mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4 leading-tight px-2">
                    We work through every aspect at the planning
                  </h2>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center group"
                      initial={{ opacity: 0, scale: 0.5, y: 100 }}
                      animate={
                        statsInView ? { opacity: 1, scale: 1, y: 0 } : {}
                      }
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                      whileHover={{
                        scale: isMobile ? 1.02 : 1.1,
                        y: isMobile ? -5 : -20,
                      }}
                      whileInView={{
                        rotateY: isMobile ? [0, 180] : [0, 360],
                        transition: { delay: index * 0.3, duration: 1 },
                      }}
                    >
                      <TiltCard className="bg-gradient-to-br from-green-200 to-emerald-200 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg group-hover:shadow-2xl transition-all duration-300">
                        <motion.div
                          animate={{
                            rotate: isMobile ? [0, 5, -5, 0] : [0, 10, -10, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            delay: index * 0.5,
                          }}
                        >
                          <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 mx-auto mb-2 sm:mb-4 text-green-700" />
                        </motion.div>
                        <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-green-800 mb-1 sm:mb-2">
                          <AnimatedCounter
                            target={stat.value}
                            suffix={stat.suffix || "+"}
                          />
                        </div>
                        <div className="text-xs sm:text-sm font-semibold text-green-700 uppercase tracking-wider px-1">
                          {stat.label}
                        </div>
                      </TiltCard>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>
      </motion.section>

      {/* Leaf Badge Slider Section */}
      <motion.section className="px-3 sm:px-4 lg:px-6">
        <LeafBadgeStatsSlider />
      </motion.section>

      {/* Vision & Mission Section */}
      <motion.section ref={visionRef} className="px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <TiltCard>
              <Card className="min-h-[200px] sm:h-[220px] lg:h-[250px] bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <motion.div
                      animate={{ scale: isMobile ? [1, 1.1, 1] : [1, 1.2, 1] }}
                      transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Eye className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-blue-600 mr-3" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800">
                      Our Vision
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                    To be India's most trusted name in personal hygiene and home
                    care, delivering products that promote health, comfort, and
                    dignity—from newborns to elders.
                  </p>
                </CardContent>
              </Card>
            </TiltCard>

            <TiltCard>
              <Card className="min-h-[200px] sm:h-[220px] lg:h-[250px] bg-gradient-to-br from-purple-50 to-pink-100 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center mb-4 sm:mb-6">
                    <motion.div
                      animate={{ scale: isMobile ? [1, 1.1, 1] : [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Target className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 mr-3" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-800">
                      Our Mission
                    </h3>
                  </div>
                  <p className="text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed">
                    To provide safe, skin-friendly, and innovative hygiene
                    solutions for families across all age groups, while
                    upholding the highest standards of quality, care, and
                    customer satisfaction.
                  </p>
                </CardContent>
              </Card>
            </TiltCard>
          </div>

          <TiltCard>
            <Card className="bg-gradient-to-br from-green-100 to-emerald-100 border-green-200 shadow-xl">
              <CardContent className="p-6 sm:p-8 lg:p-12 text-center">
                <div className="mb-4 sm:mb-6 flex flex-col items-center justify-center">
                  <motion.div
                    whileHover={{
                      scale: isMobile ? 1.02 : 1.1,
                      rotateY: isMobile ? 180 : 360,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    <Link href="/home" className="flex items-center">
                      <Image
                        src="/Images/logo_novel.png"
                        alt="Logo"
                        height={isMobile ? 250 : 350}
                        width={isMobile ? 250 : 350}
                        className="max-w-full h-auto"
                      />
                    </Link>
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mt-4 sm:mt-6 px-2">
                    Message from the Managing Director
                  </h3>
                </div>

                <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed px-2">
                  <motion.p
                    whileInView={{ opacity: [0, 1], y: [20, 0] }}
                    transition={{ duration: 0.8 }}
                  >
                    "At Novel Tissues, we believe hygiene is not a luxury—it's a
                    necessity. Our journey began with a simple goal: to create
                    products that are safe, effective, and accessible for every
                    home."
                  </motion.p>
                  <motion.p
                    whileInView={{ opacity: [0, 1], y: [20, 0] }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    "With a deep-rooted focus on quality, trust, and innovation,
                    we continue to grow—one product, one family, one smile at a
                    time. Thank you for being a part of our story."
                  </motion.p>
                  <motion.p
                    className="font-semibold text-green-800 italic text-sm sm:text-base lg:text-lg"
                    whileInView={{ opacity: [0, 1], y: [20, 0] }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    — Founder, Novel Tissues Pvt. Ltd.
                  </motion.p>
                </div>
              </CardContent>
            </Card>
          </TiltCard>
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        ref={whyChooseRef}
        className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={whyChooseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            whileInView={{
              scale: [0.95, 1.02, 1],
              transition: { duration: 1.2 },
            }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-4 sm:mb-6 leading-tight px-2"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{
                backgroundSize: "200% 200%",
                textShadow: "0 0 40px rgba(34, 197, 94, 0.3)",
              }}
            >
              WHY CHOOSE US
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto mb-4 sm:mb-6 px-2 leading-relaxed"
              whileInView={{ opacity: [0, 1], y: [30, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Why you should choose to work with us is not because how good we
              are presenting ourselves or how cost-effective our product seems
              to be.
            </motion.p>
          </motion.div>

          <div className="space-y-6 sm:space-y-8">
            {reasons.map((reason, index) => (
              <CardScrollAnimation
                key={index}
                reason={reason}
                index={index}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
