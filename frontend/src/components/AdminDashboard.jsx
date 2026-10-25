import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Users, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Mail, 
  Bot,
  Filter
} from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState('All');

  const fetchBookings = () => {
    setLoading(true);
    fetch('http://localhost:5000/api/bookings')
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error('Failed to load admin bookings:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on search & destination filter
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = 
      b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.packageTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDestination = 
      selectedDestination === 'All' || b.destination === selectedDestination;

    return matchesSearch && matchesDestination;
  });

  // Calculate metrics
  const totalTravelers = bookings.reduce((sum, b) => sum + (Number(b.guests) || 0), 0);
  const destinationsList = [...new Set(bookings.map((b) => b.destination))];

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Admin Title Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4" /> Management Portal
          </div>
          <h1 className="text-3xl font-extrabold">Admin Booking Console</h1>
          <p className="text-slate-400 text-sm mt-1">
            Overview of AI Agent reservations, customer details, and trip metrics.
          </p>
        </div>

        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Bookings</span>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <Bot className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{bookings.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Created by AI Agent</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Total Travelers</span>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalTravelers}</div>
          <span className="text-xs text-slate-400 mt-1 block">Confirmed guests</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Destinations</span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <MapPin className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{destinationsList.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Active regions</span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">Agent Status</span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="text-lg font-bold text-emerald-600 flex items-center gap-1.5 mt-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" /> Active & Online
          </div>
          <span className="text-xs text-slate-400 mt-1 block">LangGraph + Groq API</span>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by customer name, email, or package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-sky-500 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Destinations</option>
            {destinationsList.map((dest, idx) => (
              <option key={idx} value={dest}>
                {dest}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bookings Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-sm">Loading admin records...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No bookings match your filter query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase font-semibold">
                  <th className="p-4">Ref ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Destination & Package</th>
                  <th className="p-4">Travel Date</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 font-mono text-xs font-bold text-slate-900">{b.id}</td>
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{b.customerName}</div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" /> {b.customerEmail}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{b.packageTitle}</div>
                      <div className="text-xs text-sky-600 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" /> {b.destination}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {b.startDate}
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-900">{b.guests}</td>
                    <td className="p-4">
                      <span className="bg-emerald-50 text-emerald-700 font-semibold text-xs px-2.5 py-1 rounded-full border border-emerald-200">
                        {b.status || 'Confirmed'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-slate-400">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}