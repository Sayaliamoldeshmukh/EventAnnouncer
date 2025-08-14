// import React, { useState, useEffect } from "react";
// import { Users, Clock, Calendar } from "lucide-react";
// import PendingRequests from "./pendingrequest";
// import MembersList from "./MembersList";
// import axios from "axios";

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
//       const res = await axios.get("/api/join/dashboard/stats", {
//         withCredentials: true,
//       });
//       setStats({
//         totalMembers: res.data.totalMembers || 0,
//         pendingRequests: res.data.pendingRequests || 0,
//         activeEvents: res.data.activeEvents || 0,
//       });
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
//           <button
//             onClick={() => setActiveTab("membersList")}
//             className={`text-left px-3 py-2 rounded-lg font-medium ${
//               activeTab === "membersList"
//                 ? "bg-purple-100 text-purple-700"
//                 : "hover:bg-gray-100"
//             }`}
//           >
//             Current Members
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
//         {activeTab === "pendingRequests" && (
//           <PendingRequests refreshStats={fetchStats} />
//         )}
//         {activeTab === "membersList" && <MembersList />}
//       </div>
//     </div>
//   );
// }

// /* ----------------------
//    Reusable Components
// ----------------------- */
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

// function DashboardContent({ stats }) {
//   return (
//     <>
//       <h2 className="text-2xl font-bold text-purple-600">Club Dashboard</h2>
//       <p className="text-gray-500 mb-6">
//         Overview of your club's performance and member activity
//       </p>

//       {/* Big Stat Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <StatCard
//           title="Total Members"
//           value={stats.totalMembers}
//           icon={<Users className="text-purple-500" />}
//         />
//         <StatCard
//           title="Pending Requests"
//           value={stats.pendingRequests}
//           icon={<Clock className="text-purple-500" />}
//         />
//         <StatCard
//           title="Active Events"
//           value={stats.activeEvents}
//           icon={<Calendar className="text-purple-500" />}
//         />
//       </div>
//     </>
//   );
// }

// function StatCard({ title, value, icon }) {
//   return (
//     <div className="bg-white p-4 rounded-xl shadow flex flex-col">
//       <div className="flex items-center justify-between mb-2">
//         <p className="text-gray-500 text-sm">{title}</p>
//         {icon}
//       </div>
//       <p className="text-2xl font-bold">{value}</p>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { Users, Clock, Calendar } from "lucide-react";
import PendingRequests from "./pendingrequest";
import MembersList from "./MembersList";
import axios from "axios";

export default function ClubDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
    activeEvents: 0,
  });

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/join/dashboard/stats", {
        withCredentials: true,
      });
      setStats({
        totalMembers: res.data.totalMembers || 0,
        pendingRequests: res.data.pendingRequests || 0,
        activeEvents: res.data.activeEvents || 0,
      });
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
          <button
            onClick={() => setActiveTab("members")}
            className={`text-left px-3 py-2 rounded-lg font-medium ${
              activeTab === "members"
                ? "bg-purple-100 text-purple-700"
                : "hover:bg-gray-100"
            }`}
          >
            Members List
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
          <PendingRequests refreshStats={fetchStats} />
        )}
        {activeTab === "members" && <MembersList />}
      </div>
    </div>
  );
}

/* ----------------------
   Reusable Components
----------------------- */
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

      {/* Big Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={<Users className="text-purple-500" />}
        />
        <StatCard
          title="Pending Requests"
          value={stats.pendingRequests}
          icon={<Clock className="text-purple-500" />}
        />
        <StatCard
          title="Active Events"
          value={stats.activeEvents}
          icon={<Calendar className="text-purple-500" />}
        />
      </div>
    </>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-500 text-sm">{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
