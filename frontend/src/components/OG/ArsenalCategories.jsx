import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

const ArsenalCategories = () => {
  const { t } = useI18n();

  // Arsenal categories with OG cinematic brutality theme
  const categories = [
    {
      title: "Hoodies",
      subtitle: "Katana Hoodies",
      description: "armor for midnight battles",
      href: "/collections/hoodies",
      image: {
        src: "https://images.unsplash.com/photo-1562327699-e48794711fe9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwyfHxkYXJrJTIwY2luZW1hdGljfGVufDB8fHx8MTc1Njc5MTcwN3ww&ixlib=rb-4.1.0&q=85",
        alt: "Katana Hoodies - Armor for midnight battles"
      }
    },
    {
      title: "Tees",
      subtitle: "Rebel Tees", 
      description: "simple, deadly, frontline gear",
      href: "/collections/t-shirts",
      image: {
        src: "https://images.unsplash.com/photo-1718117455350-829dde835cec?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwyfHxiYXR0bGUlMjByZWFkeXxlbnwwfHx8fDE3NTY3OTE3MDB8MA&ixlib=rb-4.1.0&q=85",
        alt: "Rebel Tees - Simple, deadly, frontline gear"
      }
    },
    {
      title: "Chains",
      subtitle: "Blood Chains",
      description: "forged in rebellion",
      href: "/collections/chains", 
      image: {
        src: "https://images.unsplash.com/photo-1529981188441-8a2e6fe30103?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwzfHxiYXR0bGUlMjByZWFkeXxlbnwwfHx8fDE3NTY3OTE3MDB8MA&ixlib=rb-4.1.0&q=85",
        alt: "Blood Chains - Forged in rebellion"
      }
    },
    {
      title: "Posters",
      subtitle: "Scene Captures",
      description: "scenes captured in blood & fire",
      href: "/collections/posters",
      image: {
        src: "https://images.unsplash.com/photo-1651627567991-e4ec7b8fc72c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHw0fHxkYXJrJTIwY2luZW1hdGljfGVufDB8fHx8MTc1Njc5MTcwN3ww&ixlib=rb-4.1.0&q=85",
        alt: "Scene Captures - Scenes captured in blood & fire"
      }
    },
    {
      title: "Accessories",
      subtitle: "Every Detail",
      description: "bands, caps, slippers — every detail matters",
      href: "/collections/accessories",
      image: {
        src: "https://images.unsplash.com/photo-1577223618563-3d858655ab86?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw0fHxhcnNlbmFsfGVufDB8fHx8MTc1Njc5MTY5NHww&ixlib=rb-4.1.0&q=85",
        alt: "Every Detail - Bands, caps, slippers — every detail matters"
      }
    }
  ];

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Brutal Typography */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-5xl lg:text-7xl font-brutalist font-ultra uppercase tracking-extreme text-white drop-shadow-[0_4px_8px_rgba(193,18,31,0.6)]">
            CHOOSE YOUR ARSENAL
          </h2>
          <Link 
            to="/collections"
            className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors group"
          >
            <span className="text-sm uppercase tracking-wider font-medium">Explore All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Categories Grid - Same layout as AXM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.title}
              to={category.href}
              className="group relative overflow-hidden bg-[var(--color-steel)] border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-all duration-300"
            >
              {/* Category Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={category.image.src}
                  alt={category.image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Subtle OG brass glow on hover */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-[var(--color-gold)]/10 transition-colors duration-300"></div>
                
                {/* Red keyline border on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-red)] transition-colors duration-300 pointer-events-none"></div>
              </div>

              {/* Category Text Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="space-y-1">
                  <h4 className="text-sm font-brutalist font-ultra uppercase tracking-brutal text-[var(--color-gold)] drop-shadow-[0_2px_4px_rgba(201,151,0,0.8)]">
                    {category.subtitle}
                  </h4>
                  <h3 className="text-xl font-display font-black uppercase tracking-brutal text-[var(--color-text)] group-hover:text-[var(--color-red)] transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {category.title}
                  </h3>
                  <p className="text-xs font-body text-[var(--color-text-muted)] leading-tight">
                    {category.description}
                  </p>
                </div>
              </div>

              {/* Hover arrow indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-[var(--color-red)] text-white p-2 rounded-full">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}

          {/* Featured Category (spans 2 columns on larger screens) */}
          <div className="md:col-span-2 lg:col-span-1">
            <Link 
              to="/collections/limited"
              className="group relative overflow-hidden bg-[var(--color-steel)] border border-[var(--color-gold)] hover:border-[var(--color-red)] transition-all duration-300 block h-64"
            >
              {/* Limited Collection Banner */}
              <div className="relative h-full flex items-center justify-center bg-gradient-to-br from-[var(--color-steel)] to-black">
                {/* Golden accent lines */}
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[var(--color-gold)]"></div>
                  <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[var(--color-gold)]"></div>
                </div>
                
                <div className="text-center z-10">
                  <div className="inline-block px-4 py-2 bg-[var(--color-gold)] text-black font-bold text-xs uppercase tracking-wider mb-4">
                    Vault Only
                  </div>
                  <h3 className="text-2xl font-bold font-headline uppercase tracking-wider text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">
                    Vault<br />Exclusive
                  </h3>
                  <p className="text-[var(--color-text-muted)] text-sm mt-2">
                    not for the weak (బలహీనులకు కాదు)
                  </p>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-[var(--color-gold)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </Link>
          </div>
        </div>

        {/* Bottom tagline - OG specific */}
        <div className="text-center mt-16">
          <p className="text-[var(--color-text-muted)] text-lg">
            Every soldier needs their weapon. Choose yours.
          </p>
          <p className="text-[var(--color-red)] font-bold mt-2 tracking-wide">
            Built for battle. Forged for the tribe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ArsenalCategories;