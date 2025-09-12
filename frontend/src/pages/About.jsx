import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingNavigation from '../components/FloatingNavigation';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <FloatingNavigation />
      
      {/* FIXED: Exact header height spacing (80px) */}
      <div style={{ paddingTop: '80px' }} className="max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
            ABOUT OG
          </h1>
          
          <div className="prose prose-invert max-w-none">
            <div className="text-center mb-12">
              <p className="text-xl text-gray-300 leading-relaxed">
                Official merchandise store for Power Star Pawan Kalyan's OG. 
                Premium quality apparel and accessories for true fans.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  To provide premium quality merchandise that captures the essence 
                  of OG and allows fans to showcase their passion with pride.
                </p>
              </div>
              
              <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                <h2 className="text-2xl font-bold mb-4 text-red-400">Quality Promise</h2>
                <p className="text-gray-300 leading-relaxed">
                  Every product is carefully crafted using premium materials 
                  and designed to last, just like the legacy of Power Star.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/20 to-black p-8 rounded-lg border border-red-500/20 mb-12">
              <h2 className="text-3xl font-bold mb-4 text-center">Why Choose OG Store?</h2>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-red-400">Premium Quality</h3>
                  <p className="text-gray-300">High-grade materials and superior craftsmanship</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-red-400">Authentic Designs</h3>
                  <p className="text-gray-300">Official designs inspired by the OG universe</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-red-400">Fast Delivery</h3>
                  <p className="text-gray-300">Quick shipping across India with tracking</p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6">Join the Arsenal</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Be part of the OG community and wear your fandom with pride. 
                Every purchase supports the official merchandise program.
              </p>
              <a 
                href="/shop" 
                className="inline-block bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Shop Now
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;