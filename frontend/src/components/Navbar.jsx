import React, { useState } from 'react';
import { LayoutDashboard, ShieldCheck, Menu, X } from 'lucide-react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser
} from '@clerk/clerk-react';

export default function Navbar({ activeView, setActiveView }) {
  const { user } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extract user's primary email address
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  // Grant admin access if role is set to 'admin' OR logged in with aadityach812@gmail.com
  const isAdmin =
    user?.publicMetadata?.role === 'admin' ||
    userEmail === 'aadityach812@gmail.com';

  const handleNavigation = (view) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => handleNavigation('home')}
          className="flex items-center gap-1 font-extrabold text-2xl tracking-tight cursor-pointer"
        >
          <span className="text-sky-600">Trip</span>
          <span className="text-slate-900">Stack</span>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <SignedIn>
            <button
              onClick={() => handleNavigation('dashboard')}
              className={`flex items-center gap-1.5 hover:text-sky-600 transition cursor-pointer ${
                activeView === 'dashboard' ? 'text-sky-600 font-semibold' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> My Bookings
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavigation('admin')}
                className={`flex items-center gap-1.5 hover:text-emerald-600 transition cursor-pointer ${
                  activeView === 'admin' ? 'text-emerald-600 font-semibold' : ''
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin Panel
              </button>
            )}
          </SignedIn>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
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

        {/* Mobile Hamburger & User Actions */}
        <div className="flex md:hidden items-center gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <SignedIn>
            <button
              onClick={() => handleNavigation('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-sky-50 text-sky-600 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> My Bookings
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNavigation('admin')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
                  activeView === 'admin'
                    ? 'bg-emerald-50 text-emerald-600 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Admin Panel
              </button>
            )}
          </SignedIn>

          <SignedOut>
            <div className="pt-2">
              <SignInButton mode="modal">
                <button className="w-full bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-slate-800 transition cursor-pointer">
                  Sign In
                </button>
              </SignInButton>
            </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
}