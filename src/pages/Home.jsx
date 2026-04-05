import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { ArrowRight, Share2 } from 'lucide-react';

const mockFacebookPosts = [
  { id: 1, text: "Admission for Batch 10 is now open! Apply online...", date: "2 hrs ago", image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800" },
  { id: 2, text: "Python Programming workshop this weekend. Limited seats available.", date: "1 day ago", image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800" },
  { id: 3, text: "Congratulations to our Web Development graduates!", date: "3 days ago", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800" }
];

export default function Home() {
  return (
    <div className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-brand-50/50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Empowering Youth Through <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-green-500">IT Education</span>
            </h1>
            <p className="mt-4 text-xl text-gray-600 mb-10 leading-relaxed">
              Saylani Mass IT Training (SMIT) connect portal. Register for courses, track your leaves, and build your future.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/login?role=student">
                <Button size="lg" className="px-8 font-semibold text-lg hover:scale-105 transition-transform">
                  Student Login / Signup
                </Button>
              </Link>
              <Link to="/student/courses">
                <Button size="lg" variant="outline" className="px-8 font-semibold text-lg bg-white hover:scale-105 transition-transform border-gray-200">
                  View New Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News/Facebook Feed Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-center space-x-3 mb-10">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <Share2 className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Latest from SMIT</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockFacebookPosts.map(post => (
            <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
              <div className="h-48 overflow-hidden relative">
                <img src={post.image} alt="Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
                  {post.date}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-700 flex-1 leading-relaxed">{post.text}</p>
                <Button variant="ghost" className="mt-4 w-full text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50">View on Facebook</Button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
