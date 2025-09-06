import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';
import { useProducts } from '../../hooks/useProducts';
import { getMetafieldValue } from '../../lib/shopifyMetafields';
import ProductCard from '../ProductCard';
import Countdown from '../Countdown';

const OGHeroSection = () => {
  const { t } = useI18n();
  const { products } = useProducts();
  const [activeCountdown, setActiveCountdown] = useState(null);

  // Get products with active countdowns - Temporarily disabled for debugging
  // useEffect(() => {
  //   try {
  //     const productsWithCountdown = products.filter(product => {
  //       if (!product) return false;
  //       const dropEnd = product.dropEnd || (product.metafields ? getMetafieldValue(product.metafields, 'ogfilm', 'drop_end') : null);
  //       return dropEnd && new Date(dropEnd) > new Date();
  //     });

  //     if (productsWithCountdown.length > 0) {
  //       setActiveCountdown(productsWithCountdown[0].dropEnd);
  //     }
  //   } catch (error) {
  //     console.warn('Error processing countdowns:', error);
  //   }
  // }, [products]);

  // Get rebel drop products (equivalent to new arrivals) - Simplified for debugging
  const rebelDrops = Array.isArray(products) ? products.slice(0, 3) : [];

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Countdown Banner (if active drop) */}
      {activeCountdown && (
        <div className="bg-[var(--color-red)] text-white py-4 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-white text-[var(--color-red)] text-xs font-bold uppercase tracking-wider">
                {t('home.live_drop.badge')}
              </span>
              <span className="font-bold uppercase tracking-wider">
                {t('home.live_drop.countdown_label')}
              </span>
            </div>
            <Countdown 
              endTime={activeCountdown} 
              size="sm" 
              showLabels={false}
              className="font-bold"
            />
          </div>
        </div>
      )}

      {/* Main Hero Content - Preserving exact AXM layout */}
      <div className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Shop Now Button - Same position as AXM */}
          <div className="mb-8">
            <Link 
              to="/collections/new-arrivals"
              className="flex items-center space-x-2 text-sm uppercase tracking-wider font-medium hover:text-[var(--color-red)] transition-colors group"
            >
              <span>{t('home.hero.cta_primary')}</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Hero Title - Same typography scale as AXM */}
          <div className="mb-12">
            <h1 className="text-7xl lg:text-9xl xl:text-[12rem] font-brutalist font-ultra uppercase tracking-extreme leading-[0.85] mb-8 text-center drop-shadow-[0_8px_16px_rgba(193,18,31,0.8)]">
              OG ISN'T MERCH.<br />
              <span className="text-[var(--color-red)] animate-pulse">IT'S A CALLSIGN.</span>
            </h1>
            <p className="text-xl font-body text-[var(--color-text-muted)] mt-6 max-w-3xl leading-relaxed text-center">
              Cinematic drops. Theater-grade prints. Built for the tribe.
            </p>
            {/* Telugu line */}
            <p className="text-lg text-[var(--color-red)] font-bold mt-4 tracking-wide">
              {t('home.hero.te_line')}
            </p>
          </div>

          {/* Product Grid - Exact same layout as AXM */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Featured Product (Large) - Same positioning */}
            <div className="md:col-span-2 lg:col-span-2">
              {rebelDrops[0] && (
                <ProductCard 
                  product={rebelDrops[0]} 
                  className="h-full"
                />
              )}
            </div>

            {/* Regular Products - Same grid */}
            {rebelDrops.slice(1, 3).map((product) => (
              <div key={product.id} className="lg:col-span-1">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Secondary CTA - Same positioning as AXM */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 max-w-md">
            <button className="flex items-center justify-center space-x-2 bg-[var(--color-red)] text-white px-6 py-3 font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-colors">
              <Bell size={16} />
              <span>{t('home.hero.cta_secondary')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Between Seasons Section - Transformed to OG Arsenal */}
      <div className="relative py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content - Same layout structure */}
            <div className="space-y-6">
              <div className="inline-block border border-[var(--color-red)] px-4 py-2">
                <span className="text-xs uppercase tracking-wider font-medium text-[var(--color-red)]">
                  ARSENAL
                </span>
              </div>
              
              <h2 className="text-6xl lg:text-8xl font-brutalist font-ultra uppercase tracking-extreme leading-[0.85] drop-shadow-[0_6px_12px_rgba(193,18,31,0.7)]">
                CHOOSE YOUR<br /><span className="text-[var(--color-red)]">WEAPON</span>
              </h2>
              
              <p className="text-[var(--color-text-muted)] text-lg leading-relaxed max-w-md">
                Every soldier needs their gear. From hoodies that shield to tees that declare war. 
                Built for the tribe, forged for battle.
              </p>
              
              {/* Product thumbnails - Same layout */}
              <div className="flex space-x-4 mt-8">
                <img src="https://framerusercontent.com/images/TITuLcYSx53fInKnsoSGfE8Xuw.jpg" alt="Product 1" className="w-20 h-20 object-cover border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-colors" />
                <img src="https://framerusercontent.com/images/TzE4HV2Rd2nSnBPovKnaeVJ4ig.jpg" alt="Product 2" className="w-20 h-20 object-cover border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-colors" />
                <img src="https://framerusercontent.com/images/WCPUxU8le7cGYEMic8GQuKrQTLI.jpg" alt="Product 3" className="w-20 h-20 object-cover border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-colors" />
                <img src="https://framerusercontent.com/images/eVYdtpXA14mNqOPaTCQwQHElY.jpg" alt="Product 4" className="w-20 h-20 object-cover border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-colors" />
              </div>
              
              <Link 
                to="/collections"
                className="inline-flex items-center space-x-3 bg-[var(--color-red)] text-white px-8 py-4 font-brutalist font-ultra uppercase tracking-brutal hover:bg-opacity-90 hover:shadow-[0_0_20px_rgba(193,18,31,0.8)] transition-all duration-300 group mt-8"
              >
                <span>ARM UP</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right Image - Same positioning */}
            <div className="relative">
              <img
                src="https://framerusercontent.com/images/Bqu1YbtLNP6KpNMpw9Wnp1oQOJA.jpg"
                alt="OG Arsenal"
                className="w-full h-[600px] object-cover border border-[var(--color-steel)]"
              />
              
              {/* Red keyline overlay on hover */}
              <div className="absolute inset-0 border-2 border-transparent hover:border-[var(--color-red)] transition-colors pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OGHeroSection;