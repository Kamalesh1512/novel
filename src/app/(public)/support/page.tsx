"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  ChevronDown,
  Mail,
  Phone,
  MessageCircle,
  Baby,
  Package,
  Settings,
  Heart,
  User,
  Sparkles,
  FileText,
  HelpCircle,
  Send,
  X,
  Clock,
  CheckCircle,
  Bike,
} from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  hasEmail?: boolean;
  emailSubject?: string;
}

// Define all possible categories as a union
type FAQCategory =
  | "partner-onboarding"
  | "baby-care"
  | "outdoor-gear"
  | "nursing-feeding"
  | "personal-care";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<FAQCategory>("partner-onboarding");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });

  const categories = [
    { id: "partner-onboarding", name: "Partner Onboarding", icon: Package },
    { id: "baby-care", name: "Baby Care", icon: Baby },
    { id: "outdoor-gear", name: "Outdoor Gear", icon: Bike },
    { id: "nursing-feeding", name: "Nursing & Feeding", icon: Heart },
    { id: "personal-care", name: "Personal Care", icon: Sparkles },
    { id: "faqs", name: "General FAQs", icon: HelpCircle },
  ];

  const faqs = {
    "partner-onboarding": [
      {
        question: "I want to become a distributor for Novel Tissues",
        answer:
          "We welcome new distribution partners! Please contact our B2B team for partnership opportunities.",
        hasEmail: true,
        emailSubject: "Distribution Partnership Inquiry",
      },
      {
        question:
          "What are the mandatory documents needed to become a distributor?",
        answer:
          "Required documents include: GST Certificate, PAN Card, Trade License, Bank Account Details, and Business Address Proof.",
      },
      {
        question: "What is the minimum order quantity for bulk purchases?",
        answer:
          "Minimum order quantities vary by product category. Contact our sales team for specific MOQ requirements and pricing.",
      },
      {
        question: "How long does the onboarding process take?",
        answer:
          "After all documents are verified, the onboarding process typically takes 5-7 working days to complete.",
      },
      {
        question: "What are the commission rates for distributors?",
        answer:
          "Commission rates vary based on product categories and order volumes. Detailed pricing will be shared during the onboarding process.",
      },
      {
        question: "Who should I contact for distribution support?",
        answer:
          "You can reach our distribution support team at +91 98453-98453 or email us at partnerships@noveltissues.com",
        hasEmail: true,
        emailSubject: "Distribution Support Query",
      },
    ],
    "baby-care": [
      {
        question: "Are your baby wipes safe for newborns?",
        answer:
          "Yes, our baby wipes are specially formulated for sensitive newborn skin with natural, gentle ingredients.",
      },
      {
        question: "What age group are your baby products suitable for?",
        answer:
          "Our baby care products are designed for infants from birth to 24 months, with specific products for different age ranges.",
      },
      {
        question: "Do you offer organic baby care products?",
        answer:
          "We have a range of natural and organic baby care products. Check our product catalog for organic options.",
      },
      {
        question: "How should I store baby wipes and other products?",
        answer:
          "Store in a cool, dry place away from direct sunlight. Keep wipes sealed to maintain moisture.",
      },
    ],
    "outdoor-gear": [
      {
        question: "What safety certifications do your car seats have?",
        answer:
          "All our car seats meet Indian safety standards and are certified by relevant authorities.",
      },
      {
        question: "Do you provide installation support for car seats?",
        answer:
          "Yes, we provide detailed installation guides and video tutorials for all car seat models.",
      },
      {
        question: "What is the warranty period for outdoor gear?",
        answer:
          "Most outdoor gear products come with a 1-year manufacturer warranty against defects.",
      },
    ],
    "nursing-feeding": [
      {
        question: "Are your feeding bottles BPA-free?",
        answer:
          "Yes, all our feeding bottles are made from BPA-free materials and are completely safe for babies.",
      },
      {
        question: "How often should I replace feeding bottles?",
        answer:
          "We recommend replacing feeding bottles every 4-6 months or when you notice any cracks or wear.",
      },
      {
        question: "Can I sterilize your bottles in a microwave?",
        answer:
          "Yes, our bottles are microwave-safe for sterilization. Follow the instructions provided with each product.",
      },
    ],
    "personal-care": [
      {
        question: "Are your face tissues eco-friendly?",
        answer:
          "Yes, our face tissues are made from sustainably sourced materials and are biodegradable.",
      },
      {
        question: "Do you offer bulk packaging for personal care items?",
        answer:
          "Yes, we offer bulk packaging options for businesses, offices, and institutions.",
      },
    ],
    faqs: [
      {
        question: "What is your return policy?",
        answer:
          "We offer a 30-day return policy for unopened products. Hygiene products can only be returned if defective.",
      },
      {
        question: "How can I track my order?",
        answer:
          "You'll receive a tracking number via SMS and email once your order is shipped.",
      },
      {
        question: "Do you offer cash on delivery?",
        answer:
          "Yes, COD is available for orders within our delivery areas, subject to order value limits.",
      },
      {
        question: "What are your delivery charges?",
        answer:
          "Delivery is free for orders above Rs. 500. For smaller orders, delivery charges apply based on location.",
      },
    ],
  };

  const filteredFAQs: FAQ[] = faqs[selectedCategory].filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactSubmit = (e: any) => {
    e.preventDefault();
    const mailtoLink = `mailto:customercare@noveltissues.com?subject=${encodeURIComponent(
      contactForm.subject
    )}&body=${encodeURIComponent(
      `Name: ${contactForm.name}\nEmail: ${contactForm.email}\n\nMessage:\n${contactForm.message}`
    )}`;
    window.location.href = mailtoLink;
    setShowContactForm(false);
    setContactForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.section
        ref={heroRef}
        className="bg-white shadow-sm py-16 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Let's take a step ahead and help you better.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-lg border-gray-300"
            />
          </div>
        </div>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card className="sticky top-8">
              <CardContent className="p-0">
                <nav>
                  <ul>
                    {categories.map((category) => (
                      <li key={category.id}>
                        <button
                          onClick={() =>
                            setSelectedCategory(category.id as FAQCategory)
                          }
                          className={`w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                            selectedCategory === category.id
                              ? "bg-green-50 text-green-700 border-r-4 border-r-green-500"
                              : "text-gray-700"
                          }`}
                        >
                          <category.icon className="w-5 h-5" />
                          <span className="font-medium">{category.name}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.find((cat) => cat.id === selectedCategory)?.name}
                </h2>
              </div>

              <div className="p-6">
                {filteredFAQs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() =>
                            setOpenFAQ(openFAQ === index ? null : index)
                          }
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900 pr-4">
                            {faq.question}
                          </span>
                          <motion.div
                            animate={{ rotate: openFAQ === index ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {openFAQ === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 pt-2 text-gray-600 leading-relaxed bg-gray-50">
                                {faq.answer}
                                {faq.hasEmail && (
                                  <div className="mt-4">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        const mailtoLink = `mailto:customercare@noveltissues.com?subject=${encodeURIComponent(
                                          faq.emailSubject || faq.question
                                        )}`;
                                        window.location.href = mailtoLink;
                                      }}
                                    >
                                      <Mail className="w-4 h-4 mr-2" />
                                      SEND AN EMAIL
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search or browse different categories
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <section className="bg-white py-16 px-4 mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Still Need Help?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setShowContactForm(true)}
            >
              <CardContent className="p-6 text-center">
                <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm">
                  customercare@noveltissues.com
                </p>
                <Badge variant="outline" className="mt-2">
                  24-48 hrs response
                </Badge>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.open("tel:+919845398453")}
            >
              <CardContent className="p-6 text-center">
                <Phone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 text-sm">+91 98453-98453</p>
                <Badge variant="outline" className="mt-2">
                  Mon-Sat 9AM-6PM
                </Badge>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => window.open("https://wa.me/919845398453")}
            >
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">WhatsApp</h3>
                <p className="text-gray-600 text-sm">Quick support chat</p>
                <Badge variant="outline" className="mt-2">
                  Instant response
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      <AnimatePresence>
        {showContactForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowContactForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Contact Support</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowContactForm(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        subject: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm({
                        ...contactForm,
                        message: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowContactForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
