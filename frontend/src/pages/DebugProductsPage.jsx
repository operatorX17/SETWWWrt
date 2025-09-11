import React, { useState, useEffect } from 'react';
import { useProducts } from '../hooks/useProducts';

const DebugProductsPage = () => {
  const { products, loading, error } = useProducts();
  const [selectedCollection, setSelectedCollection] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Get unique categories
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  
  // Get unique collections
  const collections = [...new Set(products.map(p => p.collection).filter(Boolean))].map(name => ({
    id: name,
    name: name,
    products: products.filter(p => p.collection === name)
  }));
  
  // Get unique badges
  const allBadges = [...new Set(products.flatMap(p => p.badges || []).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCollection = selectedCollection === 'all' || product.collection === selectedCollection;
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.title?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCollection && matchesCategory && matchesSearch;
  });

  if (loading) return <div className="p-8">Loading products...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">🔍 Product Debug Dashboard</h1>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Collections</h3>
            <p className="text-3xl font-bold text-green-600">{collections.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
            <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700">Unique Badges</h3>
            <p className="text-3xl font-bold text-orange-600">{allBadges.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">🔧 Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or title..."
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Collection</label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Collections</option>
                {collections.map(collection => (
                  <option key={collection.id} value={collection.name}>
                    {collection.name} ({collection.products?.length || 0} products)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Collections Overview */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">📁 Collections Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(collection => (
              <div key={collection.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-bold text-lg">{collection.name}</h3>
                <p className="text-gray-600">ID: {collection.id}</p>
                <p className="text-gray-600">Products: {collection.products?.length || 0}</p>
                {collection.description && (
                  <p className="text-sm text-gray-500 mt-2">{collection.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Badges Overview */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">🏷️ All Badges</h2>
          <div className="flex flex-wrap gap-2">
            {allBadges.map(badge => {
              const count = products.filter(p => p.badges?.includes(badge)).length;
              return (
                <span
                  key={badge}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {badge} ({count})
                </span>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">
            🛍️ Products ({filteredProducts.length} of {products.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                {/* Product Image */}
                {product.image && (
                  <div className="mb-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                {/* Product Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-lg">{product.name || product.title}</h3>
                  
                  <div className="text-sm text-gray-600">
                    <p><strong>ID:</strong> {product.id}</p>
                    <p><strong>Category:</strong> {product.category || 'N/A'}</p>
                    <p><strong>Collection:</strong> {product.collection || 'N/A'}</p>
                    <p><strong>Price:</strong> ₹{product.price || 'N/A'}</p>
                  </div>

                  {/* Badges */}
                  {product.badges && product.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {product.badges.map((badge, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">Features:</p>
                      <ul className="text-xs text-gray-600 list-disc list-inside">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                        {product.features.length > 3 && (
                          <li>... and {product.features.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                  )}

                  {/* Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mt-2">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description
                      }
                    </p>
                  )}

                  {/* Debug Info */}
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs">
                    <p><strong>Has Image:</strong> {product.image ? '✅' : '❌'}</p>
                    <p><strong>Has Price:</strong> {product.price ? '✅' : '❌'}</p>
                    <p><strong>Has Badges:</strong> {product.badges?.length > 0 ? '✅' : '❌'}</p>
                    <p><strong>Has Features:</strong> {product.features?.length > 0 ? '✅' : '❌'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Issues Section */}
        <div className="bg-red-50 p-6 rounded-lg shadow mt-8">
          <h2 className="text-2xl font-bold mb-4 text-red-800">⚠️ Potential Issues</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-red-700">Products without images:</h3>
              <p className="text-red-600">{products.filter(p => !p.image).length} products</p>
            </div>
            <div>
              <h3 className="font-semibold text-red-700">Products without prices:</h3>
              <p className="text-red-600">{products.filter(p => !p.price).length} products</p>
            </div>
            <div>
              <h3 className="font-semibold text-red-700">Products without categories:</h3>
              <p className="text-red-600">{products.filter(p => !p.category).length} products</p>
            </div>
            <div>
              <h3 className="font-semibold text-red-700">Products without badges:</h3>
              <p className="text-red-600">{products.filter(p => !p.badges || p.badges.length === 0).length} products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugProductsPage;