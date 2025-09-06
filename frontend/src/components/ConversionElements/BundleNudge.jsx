import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const BundleNudge = ({ product, onAddBundle, className = "" }) => {
  const [selectedBundles, setSelectedBundles] = useState({
    wristband: false,
    poster: false
  });

  const bundles = [
    {
      id: 'wristband',
      name: 'Add OG Wristband',
      price: 99,
      image: '/placeholder-wristband.jpg'
    },
    {
      id: 'poster',
      name: 'Add Rebellion Poster',
      price: 199,
      image: '/placeholder-poster.jpg'
    }
  ];

  const handleBundleChange = (bundleId, checked) => {
    setSelectedBundles(prev => ({
      ...prev,
      [bundleId]: checked
    }));

    // Auto-add to cart if onAddBundle is provided
    if (onAddBundle) {
      const bundle = bundles.find(b => b.id === bundleId);
      onAddBundle(bundle, checked);
    }
  };

  const getTotalSavings = () => {
    let total = 0;
    if (selectedBundles.wristband) total += bundles[0].price;
    if (selectedBundles.poster) total += bundles[1].price;
    return Math.floor(total * 0.15); // 15% bundle discount
  };

  return (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <Plus className="text-green-400" size={18} />
        <h3 className="text-white font-bold">Complete Your Arsenal</h3>
      </div>

      <div className="space-y-3">
        {bundles.map((bundle) => (
          <label key={bundle.id} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedBundles[bundle.id]}
              onChange={(e) => handleBundleChange(bundle.id, e.target.checked)}
              className="rounded border-gray-600 text-green-600 focus:ring-green-500"
            />
            <div className="flex-1 flex items-center justify-between">
              <div>
                <span className="text-white font-medium group-hover:text-green-400 transition-colors">
                  {bundle.name}
                </span>
                <div className="text-sm text-gray-400">Perfect companion</div>
              </div>
              <div className="text-green-400 font-bold">
                ₹{bundle.price}
              </div>
            </div>
          </label>
        ))}
      </div>

      {getTotalSavings() > 0 && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="text-center">
            <div className="text-green-400 font-bold">Bundle Savings: ₹{getTotalSavings()}</div>
            <div className="text-xs text-gray-400">15% discount when bundled</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundleNudge;