import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Instagram, Heart } from 'lucide-react';
import { useI18n } from '../../hooks/useI18n';

const FanArmyWall = () => {
  const { t } = useI18n();

  // Curated fan photos/reviews - read-only UGC grid
  const fanPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxfHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@og_rebel_47",
      caption: "First day first show energy 🔥",
      likes: 284
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1618886614638-80e3c103d31a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@dvv_army_girl",
      caption: "Arsenal complete 💪",
      likes: 192
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwzfHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@captain_og",
      caption: "Ready for battle",
      likes: 456
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw0fHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@vault_collector",
      caption: "Limited edition acquired ⚡",
      likes: 721
    },
    {
      id: 5,
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw1fHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@rebel_squad",
      caption: "Squad goals achieved",
      likes: 333
    },
    {
      id: 6,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw2fHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@og_tribe_1",
      caption: "This is the way",
      likes: 198
    },
    {
      id: 7,
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw3fHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@firestorm_fan",
      caption: "Can't stop the storm 🌪️",
      likes: 512
    },
    {
      id: 8,
      image: "https://images.unsplash.com/photo-1474176857210-7287d38d27c6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw4fHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@warrior_princess",
      caption: "Born ready",
      likes: 687
    },
    {
      id: 9,
      image: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHw5fHxmYW4lMjB3ZWFyaW5nJTIwaG9vZGllfGVufDB8fHx8MTc1Njc5MTc2Nnww&ixlib=rb-4.1.0&q=85",
      username: "@gambheera_gang",
      caption: "Gambheera vibes only",
      likes: 429
    },
    {
      id: 10,
      image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwxMHx8ZmFuJTIwd2VhcmluZyUyMGhvb2RpZXxlbnwwfHx8fDE3NTY3OTE3NjZ8MA&ixlib=rb-4.1.0&q=85",
      username: "@og_legend",
      caption: "Legend status achieved 👑",
      likes: 1024
    }
  ];

  // Only show if we have 6+ posts (feature flag as per specs)
  if (fanPosts.length < 6) {
    return null;
  }

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Same layout as AXM Instagram Feed */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-bold font-headline uppercase tracking-wider mb-2">
              Fan Army Wall
            </h2>
            <p className="text-[var(--color-text-muted)] text-lg">
              The tribe speaks. Their arsenal tells stories.
            </p>
          </div>
          
          <Link 
            to="/fan-wall"
            className="flex items-center space-x-2 text-[var(--color-text)] hover:text-[var(--color-red)] transition-colors group"
          >
            <span className="text-sm uppercase tracking-wider font-medium">Get Featured</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Fan Posts Grid - Masonry-style layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {fanPosts.slice(0, 10).map((post) => (
            <div 
              key={post.id}
              className="group relative aspect-square bg-[var(--color-steel)] overflow-hidden border border-[var(--color-steel)] hover:border-[var(--color-red)] transition-all duration-300"
            >
              {/* Fan Photo */}
              <img
                src={post.image}
                alt={`Fan post by ${post.username}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Hover Overlay with Post Info */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                {/* Top: Username */}
                <div className="flex items-center space-x-2">
                  <Instagram size={16} className="text-[var(--color-red)]" />
                  <span className="text-sm font-bold text-white">
                    {post.username}
                  </span>
                </div>
                
                {/* Bottom: Caption and Likes */}
                <div>
                  <p className="text-sm text-white mb-2 line-clamp-2">
                    {post.caption}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Heart size={14} className="text-[var(--color-red)] fill-current" />
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {post.likes}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Red glow on hover */}
              <div className="absolute inset-0 bg-[var(--color-red)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-[var(--color-text-muted)] mb-6">
            Got OG gear? Show the tribe your arsenal.
          </p>
          <Link
            to="/fan-wall"
            className="inline-flex items-center space-x-2 bg-[var(--color-red)] text-white px-8 py-3 font-semibold uppercase tracking-wider hover:bg-opacity-90 transition-colors"
          >
            <span>Join the Wall</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FanArmyWall;