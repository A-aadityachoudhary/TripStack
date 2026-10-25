import React from 'react';
import { Compass, LayoutDashboard, ShieldCheck } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser
} from '@clerk/clerk-react';

export default function Navbar({ activeView, setActiveView }) {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === 'admin' || user?.primaryEmailAddress?.emailAddress?.includes('admin');

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <button
          onClick={() => setActiveView('home')}
          className="flex items-center gap-2 text-sky-600 font-extrabold text-xl tracking-tight cursor-pointer"
        >
          <Compass className="w-7 h-7" />
          <span>AgenticTravels</span>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveView('home')}
            className={`hover:text-sky-600 transition cursor-pointer ${
              activeView === 'home' ? 'text-sky-600 font-semibold' : ''
            }`}
          >
            Explore
          </button>

          <SignedIn>
            <button
              onClick={() => setActiveView('dashboard')}
              className={`flex items-center gap-1.5 hover:text-sky-600 transition cursor-pointer ${
                activeView === 'dashboard' ? 'text-sky-600 font-semibold' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> My Bookings
            </button>

            {isAdmin && (
              <button
                onClick={() => setActiveView('admin')}
                className={`flex items-center gap-1.5 hover:text-emerald-600 transition cursor-pointer ${
                  activeView === 'admin' ? 'text-emerald-600 font-semibold' : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin Panel
              </button>
            )}
          </SignedIn>
        </nav>

        {/* Auth Buttons */}
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}