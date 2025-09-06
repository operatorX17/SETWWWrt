import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl lg:text-8xl font-bold uppercase tracking-wider mb-8">
            About AXM
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We create garments that bridge the gap between technical performance and considered design, 
            crafting pieces that adapt to the rhythms of modern life.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold uppercase tracking-wider">Our Story</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Founded in the intersection of urban culture and technical innovation, AXM emerged from a simple belief: 
                  that clothing should enhance rather than restrict movement through modern life.
                </p>
                <p>
                  Our approach centers on understanding the body in motion, the demands of changing environments, 
                  and the need for garments that perform as beautifully as they appear.
                </p>
                <p>
                  Every piece in our collection represents months of development, testing, and refinement, 
                  ensuring that form and function exist in perfect harmony.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://framerusercontent.com/images/aHmupIkpNbiTWcrio0jHVxTg4OU.png"
                alt="About AXM"
                className="w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 px-6 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold uppercase tracking-wider text-center mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Performance</h3>
              <p className="text-gray-300 leading-relaxed">
                Every garment is tested in real-world conditions, ensuring durability and functionality 
                that matches our aesthetic standards.
              </p>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Innovation</h3>
              <p className="text-gray-300 leading-relaxed">
                We continuously explore new materials, construction techniques, and design approaches 
                to push the boundaries of what clothing can achieve.
              </p>
            </div>
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold">Sustainability</h3>
              <p className="text-gray-300 leading-relaxed">
                Our commitment extends beyond aesthetics to responsible production practices and 
                materials that minimize environmental impact.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold uppercase tracking-wider text-center mb-16">The Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-800 mx-auto mb-6 overflow-hidden">
                <img
                  src="https://framerusercontent.com/images/NDxBZFmSebczlFkVRMrK6Lov0.jpg"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Sarah Chen</h3>
              <p className="text-gray-400">Creative Director</p>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-800 mx-auto mb-6 overflow-hidden">
                <img
                  src="https://framerusercontent.com/images/8S1rOEsmTsaGaTyBNNA49FVxa0.jpg"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Marcus Johnson</h3>
              <p className="text-gray-400">Technical Designer</p>
            </div>
            <div className="text-center">
              <div className="w-48 h-48 bg-gray-800 mx-auto mb-6 overflow-hidden">
                <img
                  src="https://framerusercontent.com/images/EoPd16HE0a7g0agWBcu09WbDczo.jpg"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">Elena Rodriguez</h3>
              <p className="text-gray-400">Sustainability Lead</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;