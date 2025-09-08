import React, { useState, useEffect } from 'react';
import { X, Gift, Clock, Star, Shield, Zap } from 'lucide-react';

const ExitIntentPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [countdown, setCountdown] = useState(300); // 5 minutes
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e) => {
      // Trigger when mouse leaves the top of the viewport
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    // Also trigger on scroll up near top
    const handleScroll = () => {
      if (window.scrollY < 100 && !hasTriggered) {
        const timer = setTimeout(() => {
          if (!hasTriggered) {
            setIsVisible(true);
            setHasTriggered(true);
          }
        }, 2000);
        return () => clearTimeout(timer);
      }
    };

    // Trigger after 30 seconds if no interaction
    const timeoutTrigger = setTimeout(() => {
      if (!hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    }, 30000);

    document.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutTrigger);
    };
  }, [hasTriggered]);

  // Countdown timer
  useEffect(() => {
    if (isVisible && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isVisible, countdown]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      // Here you would typically send the email to your backend
      console.log('Email submitted:', email);
      
      // Auto-close after 3 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-black to-red-900 border-2 border-red-500/50 rounded-3xl max-w-2xl w-full relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 p-8">
          {!isSubmitted ? (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center bg-red-600 text-white px-4 py-2 rounded-full mb-4">
                  <Gift className="w-5 h-5 mr-2" />
                  <span className="font-bold">WAIT! DON'T LEAVE EMPTY HANDED</span>
                </div>
                <h2 className="text-4xl font-black text-white mb-4">
                  GET <span className="text-red-400">50% OFF</span> YOUR FIRST ORDER
                </h2>
                <p className="text-xl text-gray-300 mb-6">
                  Join 50,000+ Power Star fans and unlock exclusive deals
                </p>
              </div>

              {/* Countdown Timer */}
              <div className="bg-black/50 border border-red-500/30 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-red-400 mr-3" />
                  <span className="text-white font-bold text-lg">This offer expires in:</span>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-black text-red-400 mb-2">
                    {formatTime(countdown)}
                  </div>
                  <p className="text-gray-400">Don't miss out on this exclusive deal!</p>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Premium Quality</h3>
                  <p className="text-gray-400 text-sm">Military-grade materials</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Lifetime Guarantee</h3>
                  <p className="text-gray-400 text-sm">Replace if it breaks, ever</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-bold mb-2">Fast Delivery</h3>
                  <p className="text-gray-400 text-sm">2-3 days nationwide</p>
                </div>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for 50% OFF"
                    className="flex-1 bg-black/50 border border-red-500/30 rounded-xl px-6 py-4 text-white placeholder-gray-400 focus:border-red-500 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
                  >
                    CLAIM 50% OFF
                  </button>
                </div>
              </form>

              {/* Social Proof */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="text-white font-semibold ml-2">4.9/5</span>
                </div>
                <p className="text-gray-400 text-sm">
                  "Best fan merchandise I've ever bought!" - Rajesh K.
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-red-500/20">
                <div className="text-center">
                  <p className="text-white font-bold text-lg">50,000+</p>
                  <p className="text-gray-400 text-xs">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">4.9★</p>
                  <p className="text-gray-400 text-xs">Average Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold text-lg">100%</p>
                  <p className="text-gray-400 text-xs">Satisfaction</p>
                </div>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Gift className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-black text-white mb-4">
                🎉 CONGRATULATIONS!
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Your 50% OFF coupon has been sent to <span className="text-red-400 font-bold">{email}</span>
              </p>
              <div className="bg-black/50 border border-green-500/30 rounded-2xl p-6 mb-6">
                <p className="text-green-400 font-bold text-lg mb-2">Coupon Code:</p>
                <p className="text-3xl font-black text-white tracking-wider">POWERSTAR50</p>
              </div>
              <p className="text-gray-400">
                Use this code at checkout to save 50% on your first order!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitIntentPopup;