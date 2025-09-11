import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Rail from '../components/Rail';

const HomeMinimal = () => {
  // Hard-coded test products
  const testProducts = [
    {
      id: 'test-1',
      title: 'Test Product 1',
      price: 999,
      images: ['/placeholder-product.jpg'],
      badges: ['TEST']
    },
    {
      id: 'test-2', 
      title: 'Test Product 2',
      price: 1299,
      images: ['/placeholder-product.jpg'],
      badges: ['TEST']
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="pt-20">
        <Rail 
          title="MINIMAL TEST RAIL" 
          subtitle="Testing if Rails work at all"
          products={testProducts}
          showViewAll={true}
          viewAllLink="/shop"
        />
      </div>

      <Footer />
    </div>
  );
};

export default HomeMinimal;