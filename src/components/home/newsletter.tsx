'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Gift, Sparkles, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you! You\'ve been subscribed to our newsletter.');
    setEmail('');
    setIsLoading(false);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-amber-600 via-rose-500 to-pink-600">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center mb-6">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-white" />
                <Gift className="h-8 w-8 text-white" />
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stay Beautiful
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Join our exclusive community and get 15% off your first order, plus early access to new products and beauty tips.
            </p>

            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/70 focus:bg-white/20"
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8"
                >
                  {isLoading ? (
                    <div className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full" />
                  ) : (
                    <>
                      Subscribe
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            <p className="text-white/80 text-sm mt-4">
              No spam, unsubscribe at any time. Your privacy is important to us.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Exclusive Offers</h3>
                <p className="text-white/80 text-sm">Get special discounts and early access to sales</p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Beauty Tips</h3>
                <p className="text-white/80 text-sm">Expert advice and tutorials for your beauty routine</p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">New Arrivals</h3>
                <p className="text-white/80 text-sm">Be the first to know about our latest products</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}