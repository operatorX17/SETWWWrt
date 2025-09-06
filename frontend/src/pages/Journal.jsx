import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { mockJournalPosts } from '../data/mock';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Journal = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // If ID is provided, show single post
  if (id) {
    const post = mockJournalPosts.find(p => p.id === parseInt(id));
    
    if (!post) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Post not found</h2>
            <button 
              onClick={() => navigate('/journal')} 
              className="text-white hover:text-gray-300 underline"
            >
              Back to Journal
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/journal')}
            className="flex items-center space-x-2 text-white hover:text-gray-300 transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span className="text-sm uppercase tracking-wider">Back to Journal</span>
          </button>

          {/* Post Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-2 text-gray-400 text-sm mb-4">
              <Calendar size={16} />
              <span>{post.date}</span>
            </div>
            <h1 className="text-5xl font-bold leading-tight mb-8">{post.title}</h1>
          </div>

          {/* Featured Image */}
          <div className="aspect-[16/9] bg-gray-900 overflow-hidden mb-12">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              {post.excerpt}
            </p>
            
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                The landscape of technical apparel has shifted dramatically over the past decade. What began as purely functional design—born from military and outdoor applications—has transformed into something more considered, more intentional. This evolution mirrors our own journey in creating garments that serve both purpose and form.
              </p>
              
              <p>
                We've moved beyond the binary of "technical" versus "aesthetic." Today's wearer demands both: the performance characteristics that enable movement through varied environments and the visual language that speaks to personal identity and cultural context.
              </p>
              
              <h2 className="text-3xl font-bold text-white mt-12 mb-6">The New Standard</h2>
              
              <p>
                This shift represents more than trend—it's a fundamental reimagining of what clothing can achieve. Where traditional technical wear prioritized function at the expense of form, and fashion often sacrificed utility for appearance, we see an opportunity to transcend these limitations.
              </p>
              
              <p>
                Our approach centers on understanding the body in motion, the demands of changing environments, and the psychological impact of what we wear. Each piece must perform across multiple dimensions: physical comfort, thermal regulation, durability, and visual coherence.
              </p>
              
              <h2 className="text-3xl font-bold text-white mt-12 mb-6">Material Innovation</h2>
              
              <p>
                The foundation of this evolution lies in material science. Advanced synthetic fibers now offer breathability that rivals natural materials while providing superior moisture management and recovery. These innovations enable construction techniques previously impossible, opening new possibilities for fit, movement, and aesthetic expression.
              </p>
              
              <p>
                But innovation extends beyond the technical. We're equally interested in how these materials age, how they respond to repeated wear, and how they contribute to the overall lifecycle of the garment. Durability becomes not just functional but philosophical—a statement about consumption, value, and respect for craft.
              </p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Show all journal posts
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-16">
          <h1 className="text-6xl lg:text-8xl font-bold uppercase tracking-wider mb-8">Journal</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Exploring the principles of design and how we approach everyday pieces. 
            A collection of thoughts on materials, construction, and the intersection of form and function.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] bg-gray-900 overflow-hidden">
              <img
                src={mockJournalPosts[0].image}
                alt={mockJournalPosts[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Calendar size={16} />
                <span>{mockJournalPosts[0].date}</span>
                <span>•</span>
                <span>Featured</span>
              </div>
              <h2 className="text-4xl font-bold leading-tight">
                {mockJournalPosts[0].title}
              </h2>
              <p className="text-gray-300 leading-relaxed">
                {mockJournalPosts[0].excerpt}
              </p>
              <button
                onClick={() => navigate(`/journal/${mockJournalPosts[0].id}`)}
                className="text-white hover:text-gray-300 transition-colors underline"
              >
                Read Full Article
              </button>
            </div>
          </div>
        </div>

        {/* All Posts Grid */}
        <div className="space-y-12">
          <h2 className="text-3xl font-bold uppercase tracking-wider">All Entries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {mockJournalPosts.map((post) => (
              <div 
                key={post.id} 
                className="group cursor-pointer"
                onClick={() => navigate(`/journal/${post.id}`)}
              >
                <div className="aspect-[4/5] bg-gray-900 overflow-hidden mb-6">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-400 text-sm">
                    <Calendar size={14} />
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-gray-300 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Journal;