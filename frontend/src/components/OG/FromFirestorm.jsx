import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

const FromFirestorm = () => {
  const { t } = useI18n();

  // Journal articles - from content pack
  const articles = [
    {
      title: "Hungry Cheetah Unleashed",
      deck: "The roar behind the drop.",
      href: "#",
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxjaGVldGFofGVufDB8fHx8MTc1Njc5MTgxM3ww&ixlib=rb-4.1.0&q=85",
      date: "2 days ago",
      readTime: "3 min read"
    },
    {
      title: "Firestorm Is Coming",
      deck: "Why this wave can't be stopped.",
      href: "#",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxmaXJlc3Rvcm18ZW58MHx8fHwxNzU2NzkxODIwfDA&ixlib=rb-4.1.0&q=85",
      date: "1 week ago", 
      readTime: "5 min read"
    },
    {
      title: "They Call Him OG",
      deck: "Iconography of a revolution.",
      href: "#",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxyZXZvbHV0aW9ufGVufDB8fHx8MTc1Njc5MTgyN3ww&ixlib=rb-4.1.0&q=85",
      date: "2 weeks ago",
      readTime: "4 min read"
    }
  ];

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Same layout as AXM Journal */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold font-headline uppercase tracking-wider mb-2">
              From the Firestorm
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg">
              Stories from the frontlines. Intel from the inside.
            </p>
          </div>
          
          <Link 
            to="/journal"
            className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors group"
          >
            <span className="text-sm uppercase tracking-wider font-medium">Read All</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Articles Grid - Same layout as AXM */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <Link 
              key={index}
              to={article.href}
              className="group relative bg-[var(--color-steel)] overflow-hidden border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-all duration-300"
            >
              {/* Article Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>
                
                {/* Red accent on hover */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--color-red)] transition-colors duration-300 pointer-events-none"></div>
                
                {/* Read time badge */}
                <div className="absolute top-4 right-4">
                  <div className="bg-black/70 text-white px-2 py-1 text-xs font-medium flex items-center space-x-1">
                    <Clock size={12} />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6">
                {/* Date */}
                <div className="flex items-center space-x-1 text-[var(--color-text-muted)] text-sm mb-3">
                  <Calendar size={14} />
                  <span>{article.date}</span>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold font-headline uppercase tracking-wider mb-3 group-hover:text-[var(--color-red)] transition-colors">
                  {article.title}
                </h3>
                
                {/* Deck/Subtitle */}
                <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4">
                  {article.deck}
                </p>
                
                {/* Read More CTA */}
                <div className="flex items-center space-x-2 text-[var(--color-text)] group-hover:text-[var(--color-gold)] transition-colors">
                  <span className="text-sm uppercase tracking-wider font-medium">Read Story</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-[var(--color-red)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA - OG themed */}
        <div className="text-center mt-16">
          <p className="text-[var(--color-text-muted)] text-lg mb-4">
            Stay connected to the storm. Get the latest intel.
          </p>
          <p className="text-[var(--color-red)] font-bold tracking-wide">
            The revolution is documented. The tribe stays informed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FromFirestorm;