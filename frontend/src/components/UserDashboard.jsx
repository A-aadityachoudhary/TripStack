import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Calendar, Users, MapPin, CheckCircle, Clock, PackageCheck, AlertCircle } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/bookings')
      .then((res) => res.json())
      .then((data) => {
        // Filter bookings matching the signed-in user's email or name
        const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
        const filtered = data.filter(
          (b) => b.customerEmail?.toLowerCase() === userEmail || !userEmail
        );
        setBookings(filtered);
      })
      .catch((err) => console.error('Failed to load user bookings:', err))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header Profile Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 mb-10 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-sky-400 font-semibold text-xs tracking-wider uppercase mb-1 block">
            Traveler Account
          </span>
          <h1 className="text-3xl font-extrabold">Welcome back, {user?.firstName || 'Explorer'}!</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage your AI Agent reservations and view detailed itineraries.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-800 px-6 py-4 rounded-2xl border border-slate-700">
          <PackageCheck className="w-8 h-8 text-sky-400" />
          <div>
            <div className="text-2xl font-bold text-white">{bookings.length}</div>
            <div className="text-xs text-slate-400">Total Bookings</div>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-sky-600" /> Your Reserved Trips
      </h2>

      {loading ? (
        <div className="text-center py-12 text-slate-500 text-sm">Loading your reservations...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800 mb-1">No Bookings Found</h3>
          <p className="text-slate-500 text-sm mb-6">
            You haven't booked any trips yet. Chat with our AI Agent on the bottom right to make a reservation!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-emerald-50 text-emerald-700 font-semibold text-xs px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> {item.status || 'Confirmed'}
                </span>
                <span className="text-xs text-slate-400 font-mono">Ref: {item.id}</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">{item.packageTitle}</h3>
              <div className="flex items-center gap-1 text-xs text-sky-600 font-medium mb-4">
                <MapPin className="w-3.5 h-3.5" /> {item.destination}
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl text-xs text-slate-600 border border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Start Date</span>
                    <span className="font-semibold text-slate-800">{item.startDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <div>
                    <span className="text-slate-400 block text-[10px]">Travelers</span>
                    <span className="font-semibold text-slate-800">{item.guests} Guest(s)</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 text-right">
                Booked on: {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}