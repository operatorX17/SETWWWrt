import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-[var(--color-bg)] border-t border-[var(--color-steel)] text-[var(--color-text)] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="text-3xl font-black font-headline tracking-wider text-[var(--color-red)]">
              OG
            </Link>
            <p className="text-[var(--color-text-muted)] max-w-xs leading-relaxed">
              Every product is a weapon. Every fan is a soldier. (ప్రతి అభిమాని ఒక సైనికుడు)
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors duration-200">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-[var(--color-text-muted)] hover:text-[var(--color-red)] transition-colors duration-200">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* ARMORY - UPDATED NAVIGATION */}
          <div className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-wider">
              ARMORY
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link to="/shop" className="block text-gray-400 hover:text-white transition-colors text-sm">
                All Arsenal
              </Link>
              <Link to="/shop?filter=teeshirts" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Rebel Tees
              </Link>
              <Link to="/shop?filter=hoodies" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Predator Hoodies
              </Link>
              <Link to="/shop?filter=shirts" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Formal Arsenal
              </Link>
              <Link to="/shop?filter=posters" className="block text-gray-400 hover:text-white transition-colors text-sm">
                War Posters
              </Link>
              <Link to="/shop?filter=accessories" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Gear & Accessories
              </Link>
            </nav>
          </div>

          {/* VAULT & SUPPORT */}
          <div className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-wider">
              VAULT
            </h3>
            <nav className="flex flex-col space-y-3">
              <Link to="/shop?filter=vault" className="block text-[var(--color-gold)] hover:text-white transition-colors text-sm">
                Vault Exclusives
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors text-sm">
                About OG
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </Link>
              <a href="tel:+919876543210" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Support: +91 9876543210
              </a>
            </nav>
          </div>

          {/* TRIBE */}
          <div className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-wider">
              JOIN THE TRIBE
            </h3>
            <div className="space-y-4">
              <p className="text-[var(--color-text-muted)] text-sm">
                Get exclusive drops, early access, and tribal updates.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-[var(--color-bg)] border border-[var(--color-steel)] px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-red)]"
                />
                <button className="bg-[var(--color-red)] text-white px-4 py-2 text-sm font-bold uppercase tracking-wider hover:bg-opacity-90 transition-colors">
                  ARM UP
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--color-steel)] pt-8 mt-16">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-[var(--color-text-muted)] text-sm">
              © 2024 DVV Entertainment. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-[var(--color-text-muted)] hover:text-white transition-colors">
                Terms of Service
              </Link>
              <button
                onClick={() => {
                  // Open camera/upload for counterfeit reporting
                  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    navigator.mediaDevices.getUserMedia({ video: true })
                      .then(() => {
                        alert('Camera ready! Take a photo of the counterfeit item.');
                      })
                      .catch(() => {
                        // Fallback to file upload
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.click();
                      });
                  }
                }}
                className="text-red-400 hover:text-red-300 transition-colors font-bold"
              >
                COUNTERFEIT? REPORT IN 10 SEC
              </button>
              <span className="text-[var(--color-text-muted)]">
                Made for rebels, by rebels.
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;