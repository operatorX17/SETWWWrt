import React, { useState, useEffect } from 'react';

const TeaserVideo = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = document.querySelector('.teaser-video');
    if (video) {
      video.addEventListener('loadeddata', () => setVideoLoaded(true));
      video.addEventListener('error', () => setVideoError(true));
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Fallback Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
          filter: videoLoaded ? 'opacity(0)' : 'opacity(1)',
          transition: 'opacity 1s ease-in-out'
        }}
      />
      
      {/* YouTube Video Embed */}
      <iframe
        className={`teaser-video absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
        }`}
        src="https://www.youtube.com/embed/ePOglweqy7o?autoplay=1&mute=1&loop=1&playlist=ePOglweqy7o&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=16"
        title="OG Teaser Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        onLoad={() => setVideoLoaded(true)}
        onError={() => setVideoError(true)}
      />
      
      {/* Premium Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 flex items-center justify-center">
        <div className="text-center text-white z-10 max-w-4xl px-6">
          {/* Minimal Badge */}
          <div className="inline-flex items-center bg-black/20 backdrop-blur-md border border-white/10 rounded-full px-6 py-2 mb-8">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium tracking-[0.2em] uppercase text-white/90">LIVE COLLECTION</span>
          </div>
          
          {/* Premium Typography */}
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-6 leading-[0.85] tracking-tight">
            <span className="block text-white drop-shadow-[0_8px_32px_rgba(0,0,0,0.8)]">BEYOND</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-500 to-orange-500 drop-shadow-[0_8px_32px_rgba(255,0,0,0.3)]">LEGENDARY</span>
          </h1>
          
          {/* Minimal Subtext */}
          <p className="text-lg md:text-xl text-white/80 mb-12 font-light tracking-wide max-w-2xl mx-auto leading-relaxed">
            Where premium meets purpose. Every piece engineered for those who demand excellence.
          </p>
          
          {/* Modern CTA */}
          <button 
            onClick={() => {
              const nextSection = document.querySelector('.luxury-hero-section');
              if (nextSection) {
                const headerHeight = 120;
                const elementPosition = nextSection.offsetTop - headerHeight;
                window.scrollTo({
                  top: elementPosition,
                  behavior: 'smooth'
                });
              }
            }}
            className="group relative inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 font-medium tracking-[0.1em] uppercase transition-all duration-500 hover:bg-red-600/90 hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(255,0,0,0.3)]"
          >
            <span className="relative z-10">ENTER THE VAULT</span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/20 to-red-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeaserVideo;