import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { ArrowRight, Share2 } from 'lucide-react';

const mockFacebookPosts = [
  { id: 1, text: "Admission for Batch 10 is now open! Apply online to secure your seat in our upcoming IT programs.", date: "2 hrs ago", image: "post1.jpeg" },
  { id: 2, text: "New Python Programming workshop started! Students are learning advanced web technologies.", date: "1 day ago", image: "post2.jpeg" },
  { id: 3, text: "Congratulations to all the graduates of our Web Development course. Proud moment for SMIT!", date: "3 days ago", image: "post3.jpeg" },
  { id: 4, text: "SMIT Career Fair 2024: Connecting our talented students with top tech companies.", date: "4 days ago", image: "post4.jpeg" },
  { id: 5, text: "Join our Mobile App Development course and build the next big thing on Android and iOS.", date: "5 days ago", image: "post5.jpeg" },
  { id: 6, text: "Free seminars on AI and Data Science. Register now at SMIT main campus.", date: "1 week ago", image: "post1.jpeg" } // Fallback to post1 as post6 was a shortcut (.lnk)
];

export default function Home() {
  return (
    <div className="flex-1 bg-gray-50 flex flex-col">
      <div className="max-w-7xl mx-auto w-full px-3 py-4 md:p-6 lg:p-8 xl:p-10 flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 min-h-[50vh] flex items-center">
          <div className="absolute inset-0 bg-brand-50/50" />
          <div className="w-full px-4 sm:px-6 lg:px-12 py-12 md:py-24 relative">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-6 leading-[1.1]">
                Empowering Youth Through <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-green-500">IT Education</span>
              </h1>
              <p className="mt-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-2xl mx-auto px-4">
                Saylani Mass IT Training (SMIT) connect portal. Register for courses, track your leaves, and build your future.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 lg:gap-6 px-4">
                <Link to="/login?role=student" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full px-8 font-semibold text-base sm:text-lg hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-brand-100">
                    Student Portal
                  </Button>
                </Link>
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full px-8 font-semibold text-base sm:text-lg bg-white hover:scale-105 transition-transform active:scale-95 border-gray-200">
                    View Courses
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section className="py-16 md:py-20 lg:py-24">
          <div className="flex items-center space-x-3 mb-10 lg:mb-12">
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
              <Share2 className="h-6 w-6" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Latest from SMIT</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {mockFacebookPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                <div className="h-48 md:h-56 lg:h-64 overflow-hidden relative">
                  <img 
                    src={`/${post.image}`} 
                    alt="Post" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'; // Generic IT fallback
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded-md shadow-sm">
                    {post.date}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex-1 flex flex-col">
                  <p className="text-gray-700 flex-1 leading-relaxed text-sm md:text-base lg:text-lg">{post.text}</p>
                  <a href="https://www.facebook.com/saylani.smit" target="_blank" rel="noopener noreferrer" className="mt-6 block">
                    <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-50">View on Facebook</Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
