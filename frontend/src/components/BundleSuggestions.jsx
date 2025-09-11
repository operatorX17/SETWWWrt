import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Percent } from 'lucide-react';
import { useBundleSuggestions } from '../hooks/usePremiumCatalog';

const BundleSuggestions = () => {
  const { bundles, loading, error } = useBundleSuggestions();

  if (loading) {
    return (
      <div className="bg-[#0B0B0D] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-64 mx-auto mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => (
                <div key={i} className="h-64 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bundles || bundles.length === 0) {
    return null;
  }

  return (
    <section className="bg-[#0B0B0D] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-[#C1121F]/20 to-[#C99700]/20 border border-[#C1121F]/30 rounded-full px-6 py-2 mb-6">
            <Package className="w-5 h-5 text-[#C99700] mr-2" />
            <span className="text-[#C99700] font-bold text-sm tracking-wide">BUNDLE DEALS</span>
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C1121F] to-[#C99700]">
              COMBO OFFERS
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Save more when you bundle your favorite designs together
          </p>
        </div>

        {/* Bundle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {bundles.map((bundle, index) => (
            <div 
              key={index}
              className="group relative bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 backdrop-blur-sm border border-zinc-800/30 rounded-3xl p-8 hover:border-[#C1121F]/30 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Savings Badge */}
              <div className="absolute top-6 right-6 z-20">
                <div className="flex items-center bg-gradient-to-r from-[#C1121F] to-[#C99700] text-black px-3 py-1 rounded-full">
                  <Percent className="w-4 h-4 mr-1" />
                  <span className="text-xs font-black tracking-wider">
                    SAVE ₹{bundle.savings}
                  </span>
                </div>
              </div>

              {/* Bundle Title */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                  {bundle.title}
                </h3>
                <p className="text-gray-400 text-sm">
                  {bundle.description || 'Perfect combination for style enthusiasts'}
                </p>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl font-black text-[#C99700]">
                    ₹{bundle.bundle_price}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    ₹{bundle.original_price}
                  </span>
                </div>
                <p className="text-sm text-[#C1121F] font-semibold mt-1">
                  You save ₹{bundle.savings}
                </p>
              </div>

              {/* Bundle Items */}
              {bundle.items && (
                <div className="mb-6">
                  <p className="text-sm text-gray-400 mb-2">Includes:</p>
                  <ul className="space-y-1">
                    {bundle.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm text-gray-300 flex items-center">
                        <span className="w-2 h-2 bg-[#C99700] rounded-full mr-2 flex-shrink-0"></span>
                        {item.title || item.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button */}
              <Link 
                to={`/bundle/${bundle.id || index}`}
                className="group/btn w-full bg-gradient-to-r from-[#C1121F] to-[#C99700] text-black font-black py-4 px-6 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#C1121F]/25 flex items-center justify-center space-x-2"
              >
                <span className="tracking-wider">GET BUNDLE</span>
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* View All Bundles */}
        <div className="text-center mt-12">
          <Link 
            to="/bundles"
            className="inline-flex items-center space-x-2 text-[#C99700] hover:text-white transition-colors group"
          >
            <span className="font-semibold tracking-wide">VIEW ALL BUNDLE DEALS</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BundleSuggestions;