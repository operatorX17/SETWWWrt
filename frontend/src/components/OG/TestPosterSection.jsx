import React from 'react';
import { useProducts } from '../../hooks/useProducts';

const TestPosterSection = () => {
  const { products, loading } = useProducts();
  
  if (loading) {
    return <div className="text-white p-8">Loading posters...</div>;
  }
  
  const posterProducts = products.filter(product => product.category === 'Posters');
  
  console.log('=== POSTER DEBUG ===');
  console.log('Total products loaded:', products.length);
  console.log('Poster products found:', posterProducts.length);
  console.log('First 3 posters:', posterProducts.slice(0, 3));
  
  return (
    <section className="bg-red-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-8">
          POSTER TEST SECTION ({posterProducts.length} posters found)
        </h2>
        
        {posterProducts.length === 0 ? (
          <div className="text-white text-center">
            <p>No poster products found!</p>
            <p>Total products: {products.length}</p>
            <p>Categories found: {[...new Set(products.map(p => p.category))].join(', ')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posterProducts.slice(0, 6).map(poster => (
              <div key={poster.id} className="bg-white/10 p-4 rounded-lg">
                <h3 className="text-white font-bold mb-2">{poster.name}</h3>
                <p className="text-gray-300 text-sm mb-2">Category: {poster.category}</p>
                <p className="text-gray-300 text-sm mb-2">Price: ₹{poster.price}</p>
                <div className="bg-gray-800 rounded-lg overflow-hidden" style={{ height: '300px' }}>
                  {poster.images && poster.images[0] ? (
                    <img 
                      src={poster.images[0]} 
                      alt={poster.name}
                      className="w-full h-full object-cover"
                      onLoad={() => console.log('Image loaded:', poster.name)}
                      onError={(e) => {
                        console.log('Image failed to load:', poster.name, e.target.src);
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-white">
                      No Image
                    </div>
                  )}
                  <div className="w-full h-full bg-red-600 flex items-center justify-center text-white" style={{ display: 'none' }}>
                    IMAGE FAILED TO LOAD
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestPosterSection;