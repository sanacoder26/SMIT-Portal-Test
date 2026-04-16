import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/UI/Button';
import { ArrowRight, Share2 } from 'lucide-react';
import Footer from '../components/Layout/Footer';

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
        {/* New Hero Section */}
        <section className="relative overflow-hidden bg-white min-h-[70vh] flex items-center justify-center py-20">
          {/* Decorative Elements (Planes and Lines) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             {/* Laptop Icon Top Left */}
             <div className="absolute top-10 left-[10%] opacity-80 md:opacity-100 animate-bounce duration-3000">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <path d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4a2 2 0 00-2 2h20a2 2 0 00-2-2z" stroke="#8DC63F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M8 20h8" stroke="#8DC63F" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
             </div>
             
             {/* Globe Icon Bottom Right */}
             <div className="absolute bottom-10 right-[10%] opacity-80 md:opacity-100 animate-pulse">
                <svg width="130" height="130" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                   <circle cx="12" cy="12" r="10" stroke="#8DC63F" strokeWidth="1.5"/>
                   <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="#8DC63F" strokeWidth="1.5"/>
                </svg>
             </div>

             {/* Plane 1 path */}
             <svg className="absolute top-20 right-[20%] w-32 h-32" viewBox="0 0 100 100">
                <path d="M10 90 Q 50 10 90 40" stroke="#4B9CD3" strokeDasharray="4 4" fill="none" />
                <path d="M90 40 l-8 2 l4 -8 z" fill="#4B9CD3" />
             </svg>

             {/* Plane 2 path */}
             <svg className="absolute bottom-20 left-[15%] w-48 h-32" viewBox="0 0 150 100">
                <path d="M140 10 Q 70 90 10 70" stroke="#8DC63F" strokeDasharray="4 4" fill="none" />
                <path d="M10 70 l8 -2 l-4 8 z" fill="#8DC63F" />
             </svg>
          </div>

          <div className="w-full px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="text-center max-w-5xl mx-auto space-y-8">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 leading-[1.05]">
                Building Pakistan's <br />
                <span className="text-[#4B9CD3]">Tech Future</span>
              </h1>
              
              <p className="mt-6 text-lg md:text-2xl text-gray-500 font-medium max-w-3xl mx-auto">
                Changing Lives. Building Careers. Shaping the Future.
              </p>

              <div className="flex justify-center py-4">
                 <img 
                    src="/saylani_logo.webp" 
                    alt="Saylani Logo" 
                    className="h-16 md:h-20 object-contain"
                 />
              </div>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-5 pt-4">
                <Link to="/registration">
                  <Button size="lg" className="bg-[#1273b0] hover:bg-[#0e5c8e] text-white px-10 py-7 rounded-full text-xl font-bold transition-all shadow-xl hover:scale-105">
                    ENROLL NOW
                  </Button>
                </Link>
                <Link to="/courses">
                  <Button size="lg" variant="outline" className="border-2 border-gray-300 hover:border-brand-500 hover:bg-brand-50 text-gray-700 px-10 py-7 rounded-full text-xl font-bold transition-all hover:scale-105">
                    EXPLORE COURSES
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* News Section */}
        <section id="about" className="py-16 md:py-20 lg:py-24">
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
      <Footer />
    </div>
  );
}
