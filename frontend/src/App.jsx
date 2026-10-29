import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import FAQSection from './components/FAQSection';
import AgentChatWidget from './components/AgentChatWidget';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Calendar, Star } from 'lucide-react';
import { Mail} from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [plans, setPlans] = useState([]);
  
  const { user, isSignedIn } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = isSignedIn && userEmail === import.meta.env.VITE_ADMIN_EMAIL;

  useEffect(() => {
    fetch('http://localhost:5000/api/plans')
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) => console.error("Failed to load plans:", err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      <main className="flex-1">
        {activeView === 'home' && (
          <>
            <HeroCarousel onExploreClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })} />
            <section id="destinations" className="py-20 max-w-7xl mx-auto px-6 w-full">
              <div className="text-center max-w-2xl mx-auto mb-14">
                <h2 className="text-3xl font-bold text-slate-900 mb-3">Popular Travel Packages</h2>
                <p className="text-slate-600">
                  Handcrafted experiences designed for memorable adventures. Ask our AI Travel Agent on the bottom right to reserve any package!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => (
                  <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-semibold uppercase text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                          {plan.destination}
                        </span>
                        <div className="flex items-center text-amber-400 text-xs font-bold gap-1">
                          <Star className="w-4 h-4 fill-amber-400" /> 4.9
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {plan.duration}</span>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-2 mb-6 flex-1">
                        {plan.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-sky-500 rounded-full" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">Starting from</span>
                          <span className="text-2xl font-black text-slate-900">${plan.price_per_person}</span>
                          <span className="text-xs text-slate-500"> / person</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <FAQSection />
          </>
        )}

        {activeView === 'dashboard' && <UserDashboard />}
        
        {/* Guarded Admin Dashboard */}
        {activeView === 'admin' && (
          isAdmin ? (
            <AdminDashboard />
          ) : (
            <div className="p-12 text-center text-red-600 font-semibold text-lg">
              Access Denied: Admin privileges required for this section.
            </div>
          )
        )}
      </main>

      <AgentChatWidget />

      <footer className="mt-auto bg-slate-900 text-slate-400 py-6 sm:py-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-center sm:text-left">
        
        {/* Copyright & Brand */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-slate-300 font-medium">
          <span>© 2026</span>
          <span className="text-sky-400 font-semibold">TripStack</span>
          <span className="hidden sm:inline">•</span>
          <span className="block sm:inline w-full sm:w-auto text-slate-400 sm:text-slate-300">
            By Aaditya Choudhary
          </span>
        </div>

        {/* Contact Link */}
        <div className="flex items-center justify-center">
          <a
            href="mailto:aadityach812@gmail.com"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 sm:bg-transparent text-slate-300 hover:text-sky-400 hover:bg-slate-800 transition cursor-pointer"
            title="Send an Email"
          >
            <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            <span className="break-all sm:break-normal">aadityach812@gmail.com</span>
          </a>
        </div>

      </div>
    </footer>
    </div>
  );
}