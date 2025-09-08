import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, TrendingUp, Clock, Shield, Star, Zap, Crown, Award, CheckCircle, Heart, Gift } from 'lucide-react';

const PsychologySection = () => {
  const [liveViewers, setLiveViewers] = useState(847);
  const [recentPurchases, setRecentPurchases] = useState([
    { name: 'Rajesh from Hyderabad', item: 'Power Star Hoodie', time: '2 minutes ago' },
    { name: 'Priya from Vijayawada', item: 'Premium T-Shirt', time: '5 minutes ago' },
    { name: 'Arjun from Guntur', item: 'Limited Edition Cap', time: '8 minutes ago' }
  ]);
  const [currentPurchase, setCurrentPurchase] = useState(0);
  const [stockCount, setStockCount] = useState(23);

  useEffect(() => {
    // Simulate live viewer count fluctuation
    const viewerInterval = setInterval(() => {
      setLiveViewers(prev => prev + Math.floor(Math.random() * 10) - 5);
    }, 3000);

    // Rotate recent purchases
    const purchaseInterval = setInterval(() => {
      setCurrentPurchase(prev => (prev + 1) % recentPurchases.length);
    }, 4000);

    // Simulate stock decrease
    const stockInterval = setInterval(() => {
      setStockCount(prev => Math.max(1, prev - Math.floor(Math.random() * 2)));
    }, 15000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(purchaseInterval);
      clearInterval(stockInterval);
    };
  }, [recentPurchases.length]);

  const psychologyTriggers = [
    {
      icon: Users,
      title: "50,000+ FANS TRUST US",
      description: "Join the elite community of Power Star supporters worldwide",
      color: "from-blue-500 to-blue-600",
      type: "social_proof"
    },
    {
      icon: Award,
      title: "#1 PSPK MERCHANDISE",
      description: "Officially recognized as the premium fan gear destination",
      color: "from-green-500 to-green-600",
      type: "authority"
    },
    {
      icon: Shield,
      title: "LIFETIME QUALITY GUARANTEE",
      description: "Premium materials that last as long as your fandom - or money back",
      color: "from-purple-500 to-purple-600",
      type: "risk_reversal"
    },
    {
      icon: Crown,
      title: "CELEBRITY ENDORSED",
      description: "Worn by industry insiders, celebrities, and PSPK himself",
      color: "from-yellow-500 to-yellow-600",
      type: "authority"
    },
    {
      icon: Heart,
      title: "GIVING BACK PROGRAM",
      description: "₹10 from every purchase supports fan community initiatives",
      color: "from-red-500 to-pink-600",
      type: "reciprocity"
    },
    {
      icon: Gift,
      title: "EXCLUSIVE MEMBER PERKS",
      description: "Free shipping, early access, and surprise gifts for loyal fans",
      color: "from-indigo-500 to-purple-600",
      type: "reciprocity"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-20 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Live Activity Banner */}
        <div className="bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-6 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3" />
              <span className="text-white font-bold text-lg">
                {liveViewers} fans viewing this page right now
              </span>
            </div>
            <div className="bg-black/50 rounded-lg px-4 py-2">
              <p className="text-gray-300 text-sm">
                <span className="text-yellow-400 font-semibold">{recentPurchases[currentPurchase].name}</span> just bought{' '}
                <span className="text-red-400">{recentPurchases[currentPurchase].item}</span>{' '}
                <span className="text-gray-500">{recentPurchases[currentPurchase].time}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Enhanced Psychology Triggers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {psychologyTriggers.map((trigger, index) => {
            const IconComponent = trigger.icon;
            return (
              <div key={index} className="group">
                <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 h-full transition-all duration-300 hover:border-red-500/50 hover:bg-black/80 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20">
                  <div className={`w-14 h-14 bg-gradient-to-r ${trigger.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-bold text-lg">{trigger.title}</h3>
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-3">{trigger.description}</p>
                  <div className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">
                    {trigger.type === 'social_proof' && '👥 Trusted by thousands'}
                    {trigger.type === 'authority' && '🏆 Industry leader'}
                    {trigger.type === 'risk_reversal' && '🛡️ Risk-free guarantee'}
                    {trigger.type === 'reciprocity' && '🎁 Giving back'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Commitment & Scarcity Section */}
        <div className="bg-gradient-to-r from-red-600/20 to-orange-500/20 border border-red-500/30 rounded-3xl p-8 mb-16 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-pulse"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-3 rounded-full mb-4 shadow-lg">
                <Clock className="w-5 h-5 mr-2 animate-pulse" />
                <span className="font-bold">COMMITMENT REQUIRED</span>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Join The Elite Brotherhood
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Only {stockCount} spots left in our exclusive fan community. Make your commitment today.
              </p>
              
              {/* Commitment Triggers */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-black/40 border border-yellow-500/30 rounded-xl p-4">
                  <Crown className="mx-auto mb-2 text-yellow-400" size={24} />
                  <h4 className="text-white font-bold mb-1">VIP STATUS</h4>
                  <p className="text-gray-300 text-sm">Lifetime access to exclusive drops</p>
                </div>
                <div className="bg-black/40 border border-blue-500/30 rounded-xl p-4">
                  <Users className="mx-auto mb-2 text-blue-400" size={24} />
                  <h4 className="text-white font-bold mb-1">BROTHERHOOD</h4>
                  <p className="text-gray-300 text-sm">Connect with 50,000+ true fans</p>
                </div>
                <div className="bg-black/40 border border-green-500/30 rounded-xl p-4">
                  <Gift className="mx-auto mb-2 text-green-400" size={24} />
                  <h4 className="text-white font-bold mb-1">REWARDS</h4>
                  <p className="text-gray-300 text-sm">Earn points with every purchase</p>
                </div>
              </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Power Star Hoodie', stock: 8, price: '₹2,999', image: '🔥' },
              { name: 'Limited Edition Tee', stock: 5, price: '₹1,499', image: '⚡' },
              { name: 'Premium Cap', stock: 10, price: '₹899', image: '👑' }
            ].map((item, index) => (
              <div key={index} className="bg-black/50 rounded-2xl p-6 border border-red-500/20">
                <div className="text-center">
                  <div className="text-4xl mb-4">{item.image}</div>
                  <h3 className="text-white font-bold text-lg mb-2">{item.name}</h3>
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-2xl font-bold text-red-400">{item.price}</span>
                  </div>
                  <div className="bg-red-600/20 rounded-lg p-3 mb-4">
                    <p className="text-red-400 font-semibold text-sm">
                      Only {item.stock} left in stock!
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(item.stock / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                  <Link to={`/product/${item.name.toLowerCase().replace(/\s+/g, '-')}`}>
                    <button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105">
                      SECURE YOURS NOW
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="bg-black/40 backdrop-blur-sm border border-red-500/20 rounded-3xl p-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-white mb-4">
              WHAT <span className="text-red-400">POWER STAR FANS</span> SAY
            </h2>
            <p className="text-xl text-gray-300">
              Real reviews from real fans who've experienced the quality
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rajesh Kumar",
                location: "Hyderabad",
                rating: 5,
                review: "The quality is insane! This hoodie feels like armor. Finally, fanwear that matches our hero's standards.",
                verified: true,
                purchase: "Power Star Hoodie"
              },
              {
                name: "Priya Sharma",
                location: "Vijayawada",
                rating: 5,
                review: "I've bought fan merchandise before, but this is different. Premium quality, perfect fit, and the design is fire!",
                verified: true,
                purchase: "Limited Edition Tee"
              },
              {
                name: "Arjun Reddy",
                location: "Guntur",
                rating: 5,
                review: "Worth every rupee. The attention to detail is incredible. This isn't just clothing, it's a statement.",
                verified: true,
                purchase: "Premium Collection"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-800/50 to-black/50 rounded-2xl p-6 border border-red-500/10">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  {testimonial.verified && (
                    <div className="ml-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                <p className="text-gray-300 italic mb-4 leading-relaxed">
                  "{testimonial.review}"
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-gray-400 text-sm">{testimonial.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 text-sm font-semibold">Purchased:</p>
                    <p className="text-gray-300 text-xs">{testimonial.purchase}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-red-500/20">
            <div className="flex items-center text-gray-300">
              <Award className="w-6 h-6 text-yellow-400 mr-2" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Users className="w-6 h-6 text-blue-400 mr-2" />
              <span>50,000+ Happy Customers</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Shield className="w-6 h-6 text-green-400 mr-2" />
              <span>100% Authentic</span>
            </div>
            <div className="flex items-center text-gray-300">
              <Zap className="w-6 h-6 text-orange-400 mr-2" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PsychologySection;