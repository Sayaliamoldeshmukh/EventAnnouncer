import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    pendingRequests: 0,
  });
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  // Fetch pending join requests
  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      const res = await axios.get("/api/join/pending-requests", { withCredentials: true });
      setRequests(res.data || []);
    } catch (err) {
      if (err.response) {
        console.error("Error fetching requests:", err.response.data);
        toast.error(err.response.data.message || "Failed to load requests");
      } else if (err.request) {
        console.error("No response from server:", err.request);
        toast.error("Server not responding. Try again later.");
      } else {
        console.error("Axios error:", err.message);
        toast.error("An error occurred while fetching requests.");
      }
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch club stats
  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const res = await axios.get("/api/join/dashboard/stats", { withCredentials: true });
      setStats(res.data || { totalMembers: 0, pendingRequests: 0 });
    } catch (err) {
      if (err.response) {
        console.error("Error fetching stats:", err.response.data);
        toast.error(err.response.data.message || "Failed to load stats");
      } else if (err.request) {
        console.error("No response from server:", err.request);
        toast.error("Server not responding. Try again later.");
      } else {
        console.error("Axios error:", err.message);
        toast.error("An error occurred while fetching stats.");
      }
    } finally {
      setLoadingStats(false);
    }
  };

  // Approve / Reject request
  const handleAction = async (requestId, status) => {
    try {
      const res = await axios.post(
        "/api/join/update-request",
        { request_id: requestId, status },
        { withCredentials: true }
      );
      toast.success(res.data.message || `Request ${status}`);
      fetchRequests();
      fetchStats(); // update stats dynamically
    } catch (err) {
      if (err.response) {
        console.error(`Error ${status} request:`, err.response.data);
        toast.error(err.response.data.message || "Action failed");
      } else if (err.request) {
        console.error(`No response from server for ${status}:`, err.request);
        toast.error("Server not responding. Try again later.");
      } else {
        console.error(`Axios error for ${status}:`, err.message);
        toast.error("An error occurred. Action failed.");
      }
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-2xl font-bold mb-4 text-purple-600">
        Pending Join Requests
      </h2>

      {/* Dynamic Stats */}
      <div className="flex gap-4 mb-6">
        <div className="bg-purple-50 p-3 rounded-lg flex-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Members</p>
            <p className="text-lg font-bold">
              {loadingStats ? "..." : stats.totalMembers || 0}
            </p>
          </div>
        </div>
        <div className="bg-purple-50 p-3 rounded-lg flex-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Pending Requests</p>
            <p className="text-lg font-bold">
              {loadingStats ? "..." : stats.pendingRequests || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      {loadingRequests ? (
        <p>Loading requests...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500 bg-white p-4 rounded shadow">
          No pending requests.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-indigo-100">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.request_id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{req.name}</td>
                  <td className="p-3 border-b">{req.email}</td>
                  <td className="p-3 border-b text-center flex justify-center gap-2">
                    <button
                      onClick={() => handleAction(req.request_id, "approved")}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(req.request_id, "rejected")}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
