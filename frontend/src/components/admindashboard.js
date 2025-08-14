// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import { Users, Clock, Calendar, TrendingUp } from "lucide-react";
// import "react-toastify/dist/ReactToastify.css";

// export default function ClubDashboard() {
//   const [requests, setRequests] = useState([]);

//   const fetchRequests = async () => {
//     try {
//       const res = await axios.get(`/api/join/pending-requests`, { withCredentials: true });
//       setRequests(res.data);
//     } catch (err) {
//       toast.error("Failed to load requests");
//     }
//   };

//   const handleAction = async (requestId, status) => {
//     try {
//       const res = await axios.post(
//         "/api/join/update-request",
//         { request_id: requestId, status },
//         { withCredentials: true }
//       );
//       toast.success(res.data.message);
//       fetchRequests();
//     } catch (err) {
//       toast.error("Action failed");
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-white border-r p-4 flex flex-col">
//         <h1 className="text-xl font-bold text-purple-600 mb-6">Tech Club Admin</h1>
//         <nav className="flex flex-col gap-2">
//           <button className="text-left px-3 py-2 rounded-lg bg-purple-100 text-purple-700 font-medium">
//             Dashboard
//           </button>
//           <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
//             Membership Requests
//           </button>
//           <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
//             Current Members
//           </button>
//           <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
//             Analytics
//           </button>
//           <button className="text-left px-3 py-2 rounded-lg hover:bg-gray-100">
//             Club Settings
//           </button>
//         </nav>

//         {/* Stat Cards */}
//         <div className="mt-8 space-y-3">
//           <SidebarStat label="Total Members" value="147" icon={<Users className="text-purple-500" size={20} />} />
//           <SidebarStat label="Pending Requests" value="23" icon={<Clock className="text-purple-500" size={20} />} />
//           <SidebarStat label="Active Events" value="8" icon={<Calendar className="text-purple-500" size={20} />} />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         <ToastContainer position="top-right" autoClose={3000} />

//         {/* Header */}
//         <h2 className="text-2xl font-bold text-purple-600">Club Dashboard</h2>
//         <p className="text-gray-500 mb-6">Overview of your club's performance and member activity</p>

//         {/* Stat Cards Row */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <StatCard title="Total Members" value="147" change="+12% from last month" icon={<Users className="text-purple-500" />} />
//           <StatCard title="Pending Requests" value={requests.length} change="+5 this week" icon={<Clock className="text-purple-500" />} />
//           <StatCard title="Active Events" value="8" change="3 upcoming this month" icon={<Calendar className="text-purple-500" />} />
//           <StatCard title="Engagement Rate" value="78%" change="+3% from last month" icon={<TrendingUp className="text-purple-500" />} />
//         </div>

//         {/* Activity + Pending Requests */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Pending Requests Table */}
//           <div className="bg-white p-4 rounded-xl shadow md:col-span-2">
//             <h3 className="font-bold mb-4">Pending Join Requests</h3>
//             {requests.length === 0 ? (
//               <p>No pending requests.</p>
//             ) : (
//               <table className="w-full border text-sm">
//                 <thead>
//                   <tr className="bg-gray-200">
//                     <th className="p-2 text-left">Student Name</th>
//                     <th className="p-2 text-left">Email</th>
//                     <th className="p-2 text-left">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {requests.map((req) => (
//                     <tr key={req.id} className="border-b">
//                       <td className="p-2">{req.student_name}</td>
//                       <td className="p-2">{req.email}</td>
//                       <td className="p-2 flex gap-2">
//                         <button
//                           onClick={() => handleAction(req.id, "approved")}
//                           className="bg-green-600 text-white px-3 py-1 rounded"
//                         >
//                           Approve
//                         </button>
//                         <button
//                           onClick={() => handleAction(req.id, "rejected")}
//                           className="bg-red-600 text-white px-3 py-1 rounded"
//                         >
//                           Reject
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             )}
//           </div>

//           {/* Quick Stats */}
//           <div className="bg-white p-4 rounded-xl shadow">
//             <h3 className="font-bold mb-4">Quick Stats</h3>
//             <ProgressBar label="Event Attendance Rate" value={85} />
//             <ProgressBar label="Member Retention" value={92} />
//             <ProgressBar label="Project Completion" value={67} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ----------------------
//    Reusable Components
// ----------------------- */
// function SidebarStat({ label, value, icon }) {
//   return (
//     <div className="bg-purple-50 p-3 rounded-lg flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-500">{label}</p>
//         <p className="text-lg font-bold">{value}</p>
//       </div>
//       {icon}
//     </div>
//   );
// }

// function StatCard({ title, value, change, icon }) {
//   return (
//     <div className="bg-white p-4 rounded-xl shadow flex flex-col">
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-gray-500 text-sm">{title}</p>
//         {icon}
//       </div>
//       <p className="text-2xl font-bold">{value}</p>
//       <p className="text-sm text-green-500">{change}</p>
//     </div>
//   );
// }

// function ProgressBar({ label, value }) {
//   return (
//     <div className="mb-4">
//       <div className="flex justify-between mb-1">
//         <p className="text-sm">{label}</p>
//         <p className="text-sm font-medium">{value}%</p>
//       </div>
//       <div className="w-full bg-gray-200 rounded-full h-3">
//         <div className="bg-purple-500 h-3 rounded-full" style={{ width: `${value}%` }}></div>
//       </div>
//     </div>
//   );
// }
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Users, Clock, Calendar, TrendingUp } from "lucide-react";
// import PendingRequests from "./pendingrequest"; // ✅ Correct relative import

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// axios.defaults.withCredentials = true;

// export default function ClubDashboard() {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [stats, setStats] = useState({
//     totalMembers: 0,
//     pendingRequests: 0,
//     activeEvents: 0,
//   });

//   // Fetch dashboard stats from backend
//   const fetchStats = async () => {
//     try {
//       const res = await axios.get("/api/dashboard/stats"); 
//       // Expected API response example:
//       // { totalMembers: 147, pendingRequests: 23, activeEvents: 8 }
//       setStats(res.data || {});
//     } catch (err) {
//       console.error("Error fetching stats:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Sidebar */}
//       <div className="w-64 bg-white border-r p-4 flex flex-col">
//         <h1 className="text-xl font-bold text-purple-600 mb-6">
//           Tech Club Admin
//         </h1>
//         <nav className="flex flex-col gap-2">
//           <button
//             onClick={() => setActiveTab("dashboard")}
//             className={`text-left px-3 py-2 rounded-lg font-medium ${
//               activeTab === "dashboard"
//                 ? "bg-purple-100 text-purple-700"
//                 : "hover:bg-gray-100"
//             }`}
//           >
//             Dashboard
//           </button>
//           <button
//             onClick={() => setActiveTab("pendingRequests")}
//             className={`text-left px-3 py-2 rounded-lg font-medium ${
//               activeTab === "pendingRequests"
//                 ? "bg-purple-100 text-purple-700"
//                 : "hover:bg-gray-100"
//             }`}
//           >
//             Membership Requests
//           </button>
//         </nav>

//         {/* Sidebar Stats */}
//         <div className="mt-8 space-y-3">
//           <SidebarStat
//             title="Total Members"
//             value={stats.totalMembers}
//             icon={<Users className="text-purple-500" size={20} />}
//           />
//           <SidebarStat
//             title="Pending Requests"
//             value={stats.pendingRequests}
//             icon={<Clock className="text-purple-500" size={20} />}
//           />
//           <SidebarStat
//             title="Active Events"
//             value={stats.activeEvents}
//             icon={<Calendar className="text-purple-500" size={20} />}
//           />
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 p-6 overflow-y-auto">
//         {activeTab === "dashboard" && <DashboardContent stats={stats} />}
//         {activeTab === "pendingRequests" && <PendingRequests />}
//       </div>
//     </div>
//   );
// }

// /* ---------------------
//    Sidebar Stat Component
// ---------------------- */
// function SidebarStat({ title, value, icon }) {
//   return (
//     <div className="bg-purple-50 p-3 rounded-lg flex items-center justify-between">
//       <div>
//         <p className="text-sm text-gray-500">{title}</p>
//         <p className="text-lg font-bold">{value}</p>
//       </div>
//       {icon}
//     </div>
//   );
// }

// /* ---------------------
//    Dashboard Page Content
// ---------------------- */
// function DashboardContent({ stats }) {
//   return (
//     <>
//       <h2 className="text-2xl font-bold text-purple-600">Club Dashboard</h2>
//       <p className="text-gray-500 mb-6">
//         Overview of your club's performance and member activity
//       </p>

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//         <StatCard
//           title="Total Members"
//           value={stats.totalMembers}
//           change="+12% from last month"
//           icon={<Users className="text-purple-500" />}
//         />
//         <StatCard
//           title="Pending Requests"
//           value={stats.pendingRequests}
//           change="+5 this week"
//           icon={<Clock className="text-purple-500" />}
//         />
//         <StatCard
//           title="Active Events"
//           value={stats.activeEvents}
//           change="3 upcoming this month"
//           icon={<Calendar className="text-purple-500" />}
//         />
//         <StatCard
//           title="Engagement Rate"
//           value="78%"
//           change="+3% from last month"
//           icon={<TrendingUp className="text-purple-500" />}
//         />
//       </div>
//     </>
//   );
// }

// /* ---------------------
//    Reusable Components
// ---------------------- */
// function StatCard({ title, value, change, icon }) {
//   return (
//     <div className="bg-white p-4 rounded-xl shadow flex flex-col">
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-gray-500 text-sm">{title}</p>
//         {icon}
//       </div>
//       <p className="text-2xl font-bold">{value}</p>
//       <p className="text-sm text-green-500">{change}</p>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Users, Clock, Calendar, TrendingUp } from "lucide-react";
import PendingRequests from "./pendingrequest";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

export default function ClubDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    activeEvents: 0,
    upcomingEvents: []
  });

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/dashboard/stats");
      setStats(res.data || {});
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

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
        </nav>

        {/* Sidebar Stats */}
        <div className="mt-8 space-y-3">
          <SidebarStat
            title="Total Members"
            value={stats.totalMembers}
            icon={<Users className="text-purple-500" size={20} />}
          />
          <SidebarStat
            title="Pending Requests"
            value={stats.pendingRequests}
            icon={<Clock className="text-purple-500" size={20} />}
          />
          <SidebarStat
            title="Active Events"
            value={stats.activeEvents}
            icon={<Calendar className="text-purple-500" size={20} />}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === "dashboard" && <DashboardContent stats={stats} />}
        {activeTab === "pendingRequests" && (
          <PendingRequests onActionComplete={fetchStats} />
        )}
      </div>
    </div>
  );
}

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

function DashboardContent({ stats }) {
  return (
    <>
      <h2 className="text-2xl font-bold text-purple-600">Club Dashboard</h2>
      <p className="text-gray-500 mb-6">
        Overview of your club's performance and member activity
      </p>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          change="+12% from last month"
          icon={<Users className="text-purple-500" />}
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          change="+5 this week"
          icon={<Clock className="text-purple-500" />}
        />
        <StatCard
          title="Active Events"
          value={stats.activeEvents}
          change={`${stats.activeEvents} upcoming this month`}
          icon={<Calendar className="text-purple-500" />}
        />
        <StatCard
          title="Engagement Rate"
          value="78%"
          change="+3% from last month"
          icon={<TrendingUp className="text-purple-500" />}
        />
      </div>

      {/* Upcoming Events List */}
      <div className="bg-white rounded-xl shadow p-4">
        <h3 className="text-lg font-bold text-purple-600 mb-3">
          Upcoming Events
        </h3>
        {stats.upcomingEvents && stats.upcomingEvents.length > 0 ? (
          <ul className="space-y-2">
            {stats.upcomingEvents.map((event) => (
              <li
                key={event.id}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()} —{" "}
                    {event.location}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No upcoming events.</p>
        )}
      </div>
    </>
  );
}

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
