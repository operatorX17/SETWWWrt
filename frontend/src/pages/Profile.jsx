import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingNavigation from '../components/FloatingNavigation';

const Profile = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <FloatingNavigation />
      
      <div className="pt-20 max-w-7xl mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Profile</h1>
          
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <p className="text-gray-300 text-center py-8">
              Profile functionality coming soon...
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Profile;