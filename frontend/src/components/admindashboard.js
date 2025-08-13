import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.withCredentials = true;

export default function ClubAdminDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    activeEvents: 0,
    upcomingEvents: []
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard-stats`);
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard stats");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Club Dashboard</h1>
      <p className="mb-6 text-gray-600">Overview of your club's performance</p>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-600">Total Members</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalMembers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-600">Pending Requests</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.pendingRequests}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg text-gray-600">Active Events</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.activeEvents}</p>
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-purple-700 mb-4">Upcoming Events</h2>
        {stats.upcomingEvents.length === 0 ? (
          <p className="text-gray-500">No upcoming events found.</p>
        ) : (
          <ul className="divide-y">
            {stats.upcomingEvents.map(event => (
              <li key={event.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.event_date).toLocaleDateString()} — {event.location}
                  </p>
                </div>
                <button
                  onClick={() => toast.info(`Show details for: ${event.title}`)}
                  className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
