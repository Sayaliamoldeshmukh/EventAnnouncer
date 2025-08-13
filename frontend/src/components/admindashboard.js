// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// axios.defaults.withCredentials = true;

// export default function ClubAdminDashboard() {
//   const [stats, setStats] = useState({
//     totalMembers: 0,
//     pendingRequests: 0,
//     activeEvents: 0,
//     upcomingEvents: []
//   });

//   const fetchStats = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/admin/dashboard-stats`);
//       setStats(res.data);
//     } catch (err) {
//       toast.error("Failed to load dashboard stats");
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h1 className="text-3xl font-bold mb-6 text-purple-700">Club Dashboard</h1>
//       <p className="mb-6 text-gray-600">Overview of your club's performance</p>

//       {/* STAT CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-gray-600">Total Members</h3>
//           <p className="text-3xl font-bold text-purple-600">{stats.totalMembers}</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-gray-600">Pending Requests</h3>
//           <p className="text-3xl font-bold text-purple-600">{stats.pendingRequests}</p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-lg text-gray-600">Active Events</h3>
//           <p className="text-3xl font-bold text-purple-600">{stats.activeEvents}</p>
//         </div>
//       </div>

//       {/* UPCOMING EVENTS */}
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold text-purple-700 mb-4">Upcoming Events</h2>
//         {stats.upcomingEvents.length === 0 ? (
//           <p className="text-gray-500">No upcoming events found.</p>
//         ) : (
//           <ul className="divide-y">
//             {stats.upcomingEvents.map(event => (
//               <li key={event.id} className="py-3 flex justify-between items-center">
//                 <div>
//                   <p className="font-semibold text-gray-800">{event.title}</p>
//                   <p className="text-sm text-gray-500">
//                     {new Date(event.event_date).toLocaleDateString()} — {event.location}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => toast.info(`Show details for: ${event.title}`)}
//                   className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
//                 >
//                   View
//                 </button>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// }
// ClubDashboard.js
import React, { useState } from "react";
import { Users, Clock, Calendar, TrendingUp } from "lucide-react";
import PendingRequests from "./components/pendingrequest"; // import your pending requests component

export default function ClubDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 flex flex-col">
        <h1 className="text-xl font-bold text-purple-600 mb-6">
          Tech Club Admin
        </h1>
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`text-left px-3 py-2 rounded-lg font-medium ${
              activeTab === "dashboard"
                ? "bg-purple-100 text-purple-700"
                : "hover:bg-gray-100"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("pendingRequests")}
            className={`text-left px-3 py-2 rounded-lg font-medium ${
              activeTab === "pendingRequests"
                ? "bg-purple-100 text-purple-700"
                : "hover:bg-gray-100"
            }`}
          >
            Membership Requests
          </button>
          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
            Current Members
          </button>
          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
            Analytics
          </button>
          <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
            Club Settings
          </button>
        </nav>

        {/* Sidebar Stats */}
        <div className="mt-8 space-y-3">
          <SidebarStat title="Total Members" value="147" icon={<Users className="text-purple-500" size={20} />} />
          <SidebarStat title="Pending Requests" value="23" icon={<Clock className="text-purple-500" size={20} />} />
          <SidebarStat title="Active Events" value="8" icon={<Calendar className="text-purple-500" size={20} />} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "dashboard" && <DashboardContent />}
        {activeTab === "pendingRequests" && <PendingRequests />}
      </div>
    </div>
  );
}

/* ---------------------
   Sidebar Stat Component
---------------------- */
function SidebarStat({ title, value, icon }) {
  return (
    <div className="bg-purple-50 p-3 rounded-lg flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-lg font-bold">{value}</p>
      </div>
      {icon}
    </div>
  );
}

/* ---------------------
   Dashboard Page Content
---------------------- */
function DashboardContent() {
  return (
    <>
      <h2 className="text-2xl font-bold text-purple-600">Club Dashboard</h2>
      <p className="text-gray-500 mb-6">
        Overview of your club's performance and member activity
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Members" value="147" change="+12% from last month" icon={<Users className="text-purple-500" />} />
        <StatCard title="Pending Requests" value="23" change="+5 this week" icon={<Clock className="text-purple-500" />} />
        <StatCard title="Active Events" value="8" change="3 upcoming this month" icon={<Calendar className="text-purple-500" />} />
        <StatCard title="Engagement Rate" value="78%" change="+3% from last month" icon={<TrendingUp className="text-purple-500" />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Member Activity */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-bold mb-4">Recent Member Activity</h3>
          <ul className="space-y-4">
            <ActivityItem name="Alex Johnson" action="Joined the club" time="2 hours ago" tag="join" />
            <ActivityItem name="Sarah Chen" action="Attended Tech Workshop" time="1 day ago" tag="event" />
            <ActivityItem name="Michael Rodriguez" action="Submitted project proposal" time="2 days ago" tag="project" />
            <ActivityItem name="Emily Davis" action="Joined the club" time="3 days ago" tag="join" />
          </ul>
        </div>

        {/* Quick Stats */}
        <div className="bg-white p-4 rounded-xl shadow md:col-span-2">
          <h3 className="font-bold mb-4">Quick Stats</h3>
          <ProgressBar label="Event Attendance Rate" value={85} />
          <ProgressBar label="Member Retention" value={92} />
          <ProgressBar label="Project Completion" value={67} />
        </div>
      </div>
    </>
  );
}

/* ---------------------
   Reusable Components
---------------------- */
function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-sm">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-green-500">{change}</p>
    </div>
  );
}

function ActivityItem({ name, action, time, tag }) {
  const tagColors = {
    join: "bg-purple-100 text-purple-600",
    event: "bg-blue-100 text-blue-600",
    project: "bg-green-100 text-green-600",
  };

  return (
    <li className="flex items-center justify-between">
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{action}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[tag]}`}>
          {tag}
        </span>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </li>
  );
}

function ProgressBar({ label, value }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <p className="text-sm">{label}</p>
        <p className="text-sm font-medium">{value}%</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

