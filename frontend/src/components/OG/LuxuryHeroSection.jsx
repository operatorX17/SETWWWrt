import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Zap, Shield, Star, ArrowRight, Play } from 'lucide-react';

const LuxuryHeroSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });

  const testimonials = [
    {
      text: "This isn't just merchandise - it's a statement of power. Quality that matches the legend.",
      author: "Rajesh K.",
      location: "Hyderabad",
      rating: 5
    },
    {
      text: "Finally, fanwear that doesn't compromise. Premium quality for premium fans.",
      author: "Priya M.",
      location: "Vijayawada",
      rating: 5
    },
    {
      text: "The craftsmanship is unreal. This is what true fan loyalty deserves.",
      author: "Arjun S.",
      location: "Guntur",
      rating: 5
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    // Testimonial rotation
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(countdownInterval);
    };
  }, [testimonials.length]);

  return (
    <section className="luxury-hero-section relative min-h-[85vh] bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-red-500/5 to-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(rgba(255,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start min-h-[70vh]">
          {/* Left Column - Main Content */}
          <div className={`transform transition-all duration-1000 mt-8 ${
            isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
          }`}>
            {/* Social Proof Badge - IMMEDIATE CREDIBILITY */}
            <div className="inline-flex items-center bg-gradient-to-r from-green-600/20 to-emerald-500/20 border border-green-500/30 rounded-full px-6 py-2 mb-6">
              <Star className="w-5 h-5 text-green-400 mr-2" />
              <span className="text-green-400 font-semibold text-sm tracking-wide">50,000+ FANS ALREADY WEARING</span>
            </div>

            {/* Main Headline - OPTIMIZED FOR CONVERSION */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight mb-6">
              <span className="text-white drop-shadow-2xl">WEAR THE</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-600 drop-shadow-2xl">
                LEGEND
              </span>
              <br />
              <span className="text-white drop-shadow-2xl">YOU ARE</span>
            </h1>
            
            {/* Powerful Subheadline */}
            <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed max-w-2xl">
              Premium fanwear for those who don't just watch—they <span className="text-red-400 font-bold">live the power</span>. 
              Every piece crafted to match your unstoppable spirit.
            </p>

            {/* Social Proof */}
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 border-2 border-white flex items-center justify-center text-white font-bold text-sm">
                      {i === 1 ? 'R' : i === 2 ? 'P' : i === 3 ? 'A' : i === 4 ? 'S' : 'M'}
                    </div>
                  ))}
                </div>
                <span className="ml-3 text-gray-300">50,000+ Happy Fans</span>
              </div>
              <div className="flex items-center">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
                <span className="ml-2 text-gray-300">4.9/5 Rating</span>
              </div>
            </div>

            {/* CTA Buttons - OPTIMIZED FOR CONVERSION */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link 
                to="/shop" 
                className="group bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white font-black py-4 px-8 rounded-2xl text-lg uppercase tracking-wider transition-all transform hover:scale-105 hover:shadow-2xl flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <span className="relative z-10">SHOP COLLECTION</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform relative z-10" />
              </Link>
              <Link 
                to="/shop?filter=under-999" 
                className="group border-2 border-green-400 hover:bg-green-400 hover:text-black text-green-400 font-black py-4 px-8 rounded-2xl text-lg uppercase tracking-wider transition-all flex items-center justify-center"
              >
                <span>UNDER ₹999</span>
              </Link>
            </div>
            
            {/* Risk Reversal */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-green-400 mr-2" />
                <span>7-Day Exchange</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 mr-2" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 text-blue-400 mr-2" />
                <span>Free Shipping</span>
              </div>
            </div>


            
            {/* Urgency Timer - SUBTLE BUT EFFECTIVE */}
            <div className="mt-6 bg-gradient-to-r from-red-600/15 to-orange-500/15 border border-red-500/20 rounded-xl p-4 mx-auto max-w-sm">
              <div className="flex items-center mb-3">
                <span className="text-orange-400 font-semibold text-sm flex items-center">
                  <Zap className="w-4 h-4 mr-2" />
                  FREE SHIPPING ENDS IN
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-center">
                <div className="bg-black/50 rounded px-2 py-1">
                  <div className="text-lg font-black text-red-400">{String(countdown.hours).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">HRS</div>
                </div>
                <span className="text-red-400 font-bold">:</span>
                <div className="bg-black/50 rounded px-2 py-1">
                  <div className="text-lg font-black text-red-400">{String(countdown.minutes).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">MIN</div>
                </div>
                <span className="text-red-400 font-bold">:</span>
                <div className="bg-black/50 rounded px-2 py-1">
                  <div className="text-lg font-black text-red-400">{String(countdown.seconds).padStart(2, '0')}</div>
                  <div className="text-xs text-gray-400">SEC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className={`transform transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            {/* Product Showcase - Larger Size */}
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-lg" />
              <div className="relative bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-xl p-6">
                <a href="/products/blood-wolf-hoodie" className="block">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-black rounded-lg mb-4 overflow-hidden">
                    <img 
                      src="https://cdn.shopify.com/s/files/1/0780/0484/6848/files/WhatsApp_Image_2025-08-31_at_10.49.04_AM_1_b91e5fd7-83b7-4c9a-8d36-d28fcafe176f.jpeg?v=1756807808" 
                      alt="Blood Wolf Hoodie" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = '/images/hoodies/blood-wolf-front.jpg';
                      }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 hover:text-red-400 transition-colors">Blood Wolf Hoodie</h3>
                  <p className="text-gray-400 mb-3 text-sm">Wolf blood runs deep - Premium rebel gear</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-400">₹4,999</span>
                    <span className="text-sm text-gray-500 line-through">₹5,999</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg p-2 text-center">
                <Shield className="w-4 h-4 text-red-400 mx-auto mb-1" />
                <p className="text-white font-semibold text-xs">Premium Quality</p>
                <p className="text-gray-400 text-xs">Military-grade materials</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg p-2 text-center">
                <Zap className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
                <p className="text-white font-semibold text-xs">Fast Delivery</p>
                <p className="text-gray-400 text-xs">2-3 days nationwide</p>
              </div>
            </div>

            {/* Testimonial */}
            <div className="mt-4 bg-black/30 backdrop-blur-sm border border-red-500/20 rounded-lg p-3">
              <div className="flex items-center mb-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-2 text-xs">
                "{testimonials[currentTestimonial].text}"
              </p>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-2 text-xs">
                  {testimonials[currentTestimonial].author[0]}
                </div>
                <div>
                  <p className="text-white font-semibold text-xs">{testimonials[currentTestimonial].author}</p>
                  <p className="text-gray-400 text-xs">{testimonials[currentTestimonial].location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};

export default LuxuryHeroSection;