import React from 'react';
import { useNavigate } from 'react-router-dom';

const MoodChips = () => {
  const navigate = useNavigate();
  
  const moods = [
    {
      id: 'STORM',
      name: 'STORM',
      description: 'Steel, Rain, Motion Blur',
      color: 'from-blue-900 to-gray-800',
      borderColor: 'border-blue-400',
      textColor: 'text-blue-300'
    },
    {
      id: 'EMBER',
      name: 'EMBER', 
      description: 'Sparks, Brass Glow',
      color: 'from-orange-900 to-yellow-800',
      borderColor: 'border-orange-400',
      textColor: 'text-orange-300'
    },
    {
      id: 'SHADOW',
      name: 'SHADOW',
      description: 'Noir, Silhouettes',
      color: 'from-gray-900 to-black',
      borderColor: 'border-gray-500',
      textColor: 'text-gray-300'
    },
    {
      id: 'MONOLITH',
      name: 'MONOLITH',
      description: 'Bold Typography',
      color: 'from-slate-900 to-stone-800',
      borderColor: 'border-slate-400',
      textColor: 'text-slate-300'
    },
    {
      id: 'GHOST',
      name: 'GHOST',
      description: 'Washed Greys, Fine Lines',
      color: 'from-gray-800 to-gray-700',
      borderColor: 'border-gray-400',
      textColor: 'text-gray-200'
    }
  ];

  const handleMoodClick = (moodId) => {
    navigate(`/shop?mood=${moodId}`);
  };

  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-wider font-headline mb-4">
            Choose Your Mood
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Every rebel has a signature. Pick your battlefield aesthetic.
          </p>
          <div className="w-20 h-1 bg-[var(--color-red)] mx-auto mt-6"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className={`
                group relative h-32 bg-gradient-to-br ${mood.color} border-2 ${mood.borderColor} 
                hover:border-[var(--color-red)] transition-all duration-300 overflow-hidden
                hover:shadow-[0_0_30px_rgba(193,18,31,0.4)] hover:scale-105
              `}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
                <div className="w-full h-full bg-gradient-to-r from-transparent to-white/10"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center items-center p-4 text-center">
                <h3 className={`text-xl font-black uppercase tracking-wider mb-2 ${mood.textColor} group-hover:text-white transition-colors`}>
                  {mood.name}
                </h3>
                <p className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">
                  {mood.description}
                </p>
              </div>
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-[var(--color-red)] opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MoodChips;