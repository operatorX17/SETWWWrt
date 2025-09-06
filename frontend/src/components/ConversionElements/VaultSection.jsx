import React, { useState, useEffect } from 'react';
import { Crown, Timer, Sparkles, Shield, Star } from 'lucide-react';
import { useVaultProductsWithUnlock } from '../../hooks/useProducts';

const VaultSection = ({ className = "" }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 23, seconds: 47 });
  const { products: vaultProducts } = useVaultProductsWithUnlock();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const exclusiveFeatures = [
    { icon: Crown, text: "Hand-numbered editions" },
    { icon: Shield, text: "Lifetime authenticity" },
    { icon: Sparkles, text: "Premium materials" },
    { icon: Star, text: "Collector's certificate" }
  ];

  return (
    <section className={`relative bg-gradient-to-b from-zinc-950 via-black to-zinc-950 py-24 px-6 overflow-hidden ${className}`}>
      {/* Subtle Background Gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-500/5 via-transparent to-transparent blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Minimal Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <Crown className="text-amber-400" size={28} strokeWidth={1.5} />
            <h2 className="text-6xl font-light tracking-[0.2em] text-white">
              VAULT
            </h2>
          </div>
          
          <p className="text-xl text-amber-400/90 font-light tracking-wide mb-2">
            Numbered. Never Reprinted.
          </p>
          <p className="text-zinc-400 text-lg font-light">
            Exclusive access for collectors
          </p>
          
          {/* Elegant Timer */}
          <div className="mt-12 inline-flex items-center gap-8 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl px-8 py-6">
            <Timer className="text-amber-400" size={20} strokeWidth={1.5} />
            
            <div className="flex items-center gap-6 font-mono text-white">
              <div className="text-center">
                <div className="text-2xl font-light tracking-wider">
                  {timeLeft.days.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Days</div>
              </div>
              
              <div className="text-zinc-600 text-xl font-light">:</div>
              
              <div className="text-center">
                <div className="text-2xl font-light tracking-wider">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Hours</div>
              </div>
              
              <div className="text-zinc-600 text-xl font-light">:</div>
              
              <div className="text-center">
                <div className="text-2xl font-light tracking-wider">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Min</div>
              </div>
              
              <div className="text-zinc-600 text-xl font-light">:</div>
              
              <div className="text-center">
                <div className="text-2xl font-light tracking-wider text-amber-400">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Sec</div>
              </div>
            </div>
          </div>
        </div>

        {/* Exclusive Features */}
        <div className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {exclusiveFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl mb-4 group-hover:border-amber-400/30 transition-colors duration-500">
                    <IconComponent className="text-amber-400" size={24} strokeWidth={1.5} />
                  </div>
                  <p className="text-zinc-300 font-light tracking-wide">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {vaultProducts.slice(0, 4).map((product, index) => (
            <div 
              key={product.id} 
              className="group relative bg-zinc-950/80 backdrop-blur-sm border border-zinc-800/30 rounded-3xl p-8 hover:border-amber-400/20 transition-all duration-700 hover:-translate-y-2"
            >
              {/* Elegant Badge */}
              <div className="absolute top-6 right-6 z-20">
                <div className="px-2 py-1 text-xs font-black tracking-wider uppercase bg-gradient-to-r from-yellow-400 to-yellow-600 text-black">
                  VAULT
                </div>
              </div>

              {/* Product Image */}
              <div className="aspect-square bg-zinc-900/50 rounded-2xl mb-6 overflow-hidden relative">
                {product.images && product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Crown className="text-zinc-700" size={48} strokeWidth={1} />
                  </div>
                )}
                
                {/* Subtle Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              </div>

              {/* Product Info */}
              <div className="space-y-4">
                <h3 className="text-white font-light text-lg tracking-wide group-hover:text-amber-400 transition-colors duration-500">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="text-amber-400 font-light text-xl tracking-wide">
                    ₹{product.price?.toLocaleString()}
                  </div>
                  
                  {/* Edition Number */}
                  <div className="text-zinc-500 text-sm font-mono">
                    #{String(index + 1).padStart(3, '0')}/999
                  </div>
                </div>

                {/* Authenticity Badge */}
                <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-zinc-800/50 rounded-full px-3 py-1">
                  <Shield className="text-amber-400" size={12} strokeWidth={1.5} />
                  <span className="text-zinc-400 text-xs font-light tracking-wide">Authenticated</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Minimal CTA */}
        <div className="text-center">
          <button className="group relative bg-transparent border border-amber-400/30 hover:border-amber-400/60 text-amber-400 font-light py-4 px-12 rounded-2xl text-lg tracking-wider transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            <span className="relative z-10 uppercase tracking-[0.2em]">Request Access</span>
            <div className="absolute inset-0 bg-amber-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
          
          <div className="mt-8 flex items-center justify-center gap-8 text-zinc-500 text-sm font-light">
            <span>Exclusive Access</span>
            <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
            <span>Limited Quantities</span>
            <div className="w-1 h-1 bg-zinc-600 rounded-full"></div>
            <span>Premium Collection</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VaultSection;