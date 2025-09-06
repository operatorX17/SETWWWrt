import React from 'react';
import { Check, Package, RotateCcw } from 'lucide-react';

const TrustChips = () => {
  const trustPoints = [
    {
      icon: Check,
      text: "Official"
    },
    {
      icon: Package,
      text: "Posters ship in tubes"
    },
    {
      icon: RotateCcw,
      text: "7-day size swap"
    }
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {trustPoints.map((point, index) => {
        const IconComponent = point.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-2 px-3 py-2 bg-green-900/20 border border-green-700/50 rounded-sm text-green-300"
          >
            <IconComponent size={14} />
            <span className="text-sm font-medium">{point.text}</span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustChips;