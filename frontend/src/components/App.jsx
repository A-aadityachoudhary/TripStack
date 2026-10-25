import React, { useState, useEffect } from 'react';
import HeroCarousel from './components/HeroCarousel';
import FAQSection from './components/FAQSection';
import { Compass, Calendar, Users, Star, ArrowRight } from 'lucide-react';

export default function App() {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/plans')
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .catch((err) => console.error("Failed to load plans:", err));
  }, []);

  const scrollToDestinations = () => {
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-600 font-extrabold text-xl tracking-tight">
            <Compass className="w-7 h-7" />
            <span>AgenticTravels</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#destinations" className="hover:text-sky-600 transition">Destinations</a>
            <a href="#faq" className="hover:text-sky-600 transition">FAQs</a>
          </nav>
          <button className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition cursor-pointer">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <HeroCarousel onExploreClick={scrollToDestinations} />

      {/* Featured Travel Packages */}
      <section id="destinations" className="py-20 max-w-7xl mx-auto px-6 w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">Popular Travel Packages</h2>
          <p className="text-slate-600">
            Handcrafted experiences designed for memorable adventures. Ask our AI Travel Agent on the bottom right to reserve any package!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
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

      {/* FAQ Accordion Section */}
      <FAQSection />

      <AgentChatWidget />

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-center text-sm">
        <p>© 2026 AgenticTravels. All rights reserved. Powered by LangGraph & Groq API.</p>
      </footer>
    </div>
  );
}