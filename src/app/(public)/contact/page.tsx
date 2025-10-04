
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send, 
  MessageCircle,
  Building2,
  Users,
  Globe,
  Star,
  Sparkles,
  Leaf,
  Heart,
  Shield,
  Award,
  Factory,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleArrowOutDownLeft,
  Loader,
  AlertCircle,
} from "lucide-react";
import { ScrollProgressBar } from "@/components/global/interactive/scroll-progressbar";
import { TiltCard } from "@/components/global/interactive/tiltcard";
import { AnimatedCounter } from "@/components/global/interactive/animated-counter";
import WhatsAppButton from "@/components/global/interactive/whatsAppbutton";
import { z } from "zod";
import { ContactFormData, contactFormSchema } from "@/lib/schema/contactFormSchema";



export default function ContactPage() {
  const { scrollY, scrollYProgress } = useScroll();
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationAlert, setShowValidationAlert] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  // Enhanced parallax effects
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

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

  const heroRotate = useTransform(
    scrollYProgress,
    [0, 0.2],
    [0, isMobile ? 2 : 5]
  );
  const heroScale = useTransform(scrollYProgress, [0, 0.2, 1], [1, 1.02, 0.98]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const heroRef = useRef(null);
  const contactInfoRef = useRef(null);
  const formRef = useRef(null);
  const locationsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const contactInfoInView = useInView(contactInfoRef, {
    once: true,
    amount: 0.3,
  });
  const formInView = useInView(formRef, { once: true, amount: 0.3 });
  const locationsInView = useInView(locationsRef, { once: true, amount: 0.3 });

  const contactStats = [
    { value: 12, label: "Hours Support", icon: Clock, suffix: "/6" },
    { value: 50, label: "Countries Served", icon: Globe },
    { value: 10, label: "Million+ Customers", icon: Users, suffix: "M+" },
    { value: 15, label: "Years Experience", icon: Award },
  ];

  const contactMethods = [
    {
      icon: MapPin,
      title: "Head Office",
      details: ["65A, KIADB Industrial Area", "Hootagalli, Mysore - 570018"],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["(+91) 98453 98453", "Mon-Sat: 9AM-6PM"],
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["marketing@noveltissues.com", "customercare@noveltissues.com"],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Factory,
      title: "Manufacturing Units",
      details: ["Mysuru, Pondicherry", "Maharashtra, Haryana"],
      color: "from-orange-500 to-red-500",
    },
  ];

  const locations = [
    {
      name: "Mysore",
      address: "65A, KIADB Industrial Area, Hootagalli, Mysore - 570018",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3897.445198610282!2d76.5825179!3d12.3530832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae16637d53daf5%3A0x3308717753530b8f!2sNovel%20Tissues!5e0!3m2!1sen!2sin!4v1747976393013!5m2!1sen!2sin",
    },
    {
      name: "Mumbai",
      address: "Mumbai Distribution Center",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d6767.479576637372!2d72.84918162449426!3d19.4046715082813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDI0JzEwLjQiTiA3MsKwNTEnMTUuNSJF!5e0!3m2!1sen!2sin!4v1750005778360!5m2!1sen!2sin",
    },
    {
      name: "Haryana",
      address: "NOVEL TISSUES MANESAR",
      embedUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.328218335051!2d76.913347!3d28.379153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d3f1db7a4635f%3A0x9089da201f17f6b7!2sNOVEL%20TISSUES%20MANESAR!5e0!3m2!1sen!2sin!4v1750005804237!5m2!1sen!2sin",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name as keyof ContactFormData]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // Hide validation alert if it's showing
    if (showValidationAlert) {
      setShowValidationAlert(false);
    }
  };

  const validateForm = () => {
    try {
      contactFormSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Partial<Record<keyof ContactFormData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof ContactFormData] = err.message;
          }
        });
        setFormErrors(errors);
        setShowValidationAlert(true);
        
        // Hide alert after 5 seconds
        setTimeout(() => setShowValidationAlert(false), 5000);
        
        return false;
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = Object.keys(formErrors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setIsSubmitting(true);

    // Simulate sending
    setTimeout(() => {
      setIsSubmitting(false);

      // Open WhatsApp with filled message
      const whatsappNumber = "919845398453";
      const msg = `Hello, my name is ${formData.fullName}.
Email: ${formData.email}
Phone: ${formData.phone}
Subject: ${formData.subject}
Message: ${formData.message}`;
      
      window.open(
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`,
        "_blank"
      );

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setFormErrors({});
    }, 1500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-50">
      <ScrollProgressBar />
      
      {/* Validation Alert */}
      <AnimatePresence>
        {showValidationAlert && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-red-50 border-red-200 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Please check your form</p>
                    <p className="text-sm">Some required fields are missing or invalid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

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
            style={{
              textShadow: "0 0 30px rgba(34, 197, 94, 0.3)",
            }}
          >
            GET IN TOUCH
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
              Have questions about our products or need assistance? We'd love to hear from you and help with your hygiene product needs.
            </motion.p>
            <motion.p
              className="flex flex-wrap justify-center items-center gap-2"
              whileInView={{ opacity: [0, 1], y: [20, 0] }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge variant="premium" className="text-xs sm:text-sm">
                ISO 9001:2000 Certified
              </Badge>
              <Badge variant="premium" className="text-xs sm:text-sm">
                GMP Certified
              </Badge>
              <Badge variant="premium" className="text-xs sm:text-sm">
                25+ Years Experience
              </Badge>
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Button
              size={isMobile ? "default" : "lg"}
              className="rounded-3xl w-full sm:w-auto"
              variant="premiumOutline"
              onClick={() => {
                const el = document.getElementById("contact-form");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send Message
            </Button>
            <Button
              size={isMobile ? "default" : "lg"}
              className="rounded-3xl w-full sm:w-auto"
              variant="premium"
              onClick={() => {
                const el = document.getElementById("contact-info");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Now
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Contact Stats */}
      <motion.section
        className="px-3 sm:px-4 lg:px-6 relative py-8 sm:py-12"
        style={{ y: y2 }}
      >
        <div className="max-w-6xl mx-auto mb-8 sm:mb-12">
          <TiltCard>
            <Card className="bg-gradient-to-br from-green-500 to-emerald-200 border-green-200 shadow-2xl overflow-hidden">
              <CardContent className="p-6 sm:p-8 lg:p-12">
                <motion.div
                  className="text-center mb-8 sm:mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-4 leading-tight px-2">
                    We're Here For You
                  </h2>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                  {contactStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center group"
                      initial={{ opacity: 0, scale: 0.5, y: 100 }}
                      whileInView={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.2, duration: 0.6 }}
                      whileHover={{
                        scale: isMobile ? 1.02 : 1.1,
                        y: isMobile ? -5 : -20,
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

      {/* Contact Info & Form Section */}
      <motion.section
        className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6 relative"
        style={{ y: y2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
            {/* Contact Methods */}
            <motion.div
              ref={contactInfoRef}
              id="contact-info"
              initial={{ opacity: 0, x: -50 }}
              animate={contactInfoInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">
                Contact Information
              </h3>

              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <TiltCard>
                      <Card
                        className={`bg-gradient-to-r ${method.color} text-white shadow-lg hover:shadow-2xl transition-all duration-300`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                delay: index * 0.5,
                              }}
                            >
                              <method.icon className="w-8 h-8 flex-shrink-0 mt-1" />
                            </motion.div>
                            <div>
                              <h4 className="font-bold text-lg mb-2">
                                {method.title}
                              </h4>
                              {method.details.map((detail, idx) => (
                                <p
                                  key={idx}
                                  className="opacity-90 text-sm sm:text-base"
                                >
                                  {detail}
                                </p>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              ref={formRef}
              id="contact-form"
              className="h-full flex flex-col"
              initial={{ opacity: 0, x: 50 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <Card className="bg-white shadow-2xl border-0 h-full flex flex-col">
                <CardContent className="p-6 sm:p-8 flex flex-col flex-grow">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                    Send us a Message
                  </h3>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6 flex flex-col flex-grow"
                  >
                    <div>
                      <Label htmlFor="fullName" className="mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        className={formErrors.fullName ? "border-red-500 focus:border-red-500" : ""}
                        placeholder="Enter your full name"
                      />
                      {formErrors.fullName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.fullName}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={formErrors.email ? "border-red-500 focus:border-red-500" : ""}
                        placeholder="Enter your email address"
                      />
                      {formErrors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.email}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={formErrors.phone ? "border-red-500 focus:border-red-500" : ""}
                        placeholder="Enter your phone number"
                      />
                      {formErrors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.phone}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="subject" className="mb-2">
                        Subject <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        className={formErrors.subject ? "border-red-500 focus:border-red-500" : ""}
                        placeholder="What is this regarding?"
                      />
                      {formErrors.subject && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.subject}
                        </motion.p>
                      )}
                    </div>

                    <div className="flex-grow">
                      <Label htmlFor="message" className="mb-2">
                        Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        className={`min-h-[120px] ${formErrors.message ? "border-red-500 focus:border-red-500" : ""}`}
                        placeholder="Tell us more about your enquiry..."
                      />
                      {formErrors.message && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm mt-1 flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" />
                          {formErrors.message}
                        </motion.p>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button
                        type="submit"
                        size="lg"
                        variant="premium"
                        className="w-full rounded-2xl"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <Loader className="w-5 h-5 mr-2" />
                          </motion.div>
                        ) : (
                          <Send className="w-5 h-5 mr-2" />
                        )}
                        {isSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Locations Section */}
      <motion.section
        ref={locationsRef}
        className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6 relative"
        style={{ y: y3 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={locationsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
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
              OUR LOCATIONS
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto mb-4 sm:mb-6 px-2 leading-relaxed"
              whileInView={{ opacity: [0, 1], y: [30, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Visit us at our manufacturing facilities and offices across India
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {locations.map((location, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <TiltCard>
                  <Card className="bg-transparent shadow-none border-none hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <motion.div className="aspect-video bg-gradient-to-br from-green-400 to-emerald-500">
                        <iframe
                          src={location.embedUrl}
                          className="w-full h-full border-0 block"
                          allowFullScreen
                        />
                      </motion.div>
                      <motion.div
                        className="absolute top-0 right-2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.5,
                        }}
                      >
                        <Badge
                          variant="premium"
                          className="text-xs font-semibold"
                        >
                          {location.name}
                        </Badge>
                      </motion.div>
                    </div>
                    <CardContent className="p-2 min-h-[30px] sm:h-[35px] lg:h-[40px]">
                      <h4 className="text-xl font-bold text-gray-900 flex items-center">
                        <MapPin className="w-5 h-5 text-green-600 mr-2" />
                        {location.name}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {location.address}
                      </p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
