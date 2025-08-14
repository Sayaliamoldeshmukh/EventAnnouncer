
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// axios.defaults.withCredentials = true;

// export default function PendingRequests() {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch pending join requests
//   const fetchRequests = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("/api/join/pending-requests");
//       setRequests(res.data || []);
//     } catch (err) {
//       console.error("Error fetching requests:", err);
//       toast.error("Failed to load requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Approve / Reject actions
//   const handleAction = async (requestId, status) => {
//     try {
//       const res = await axios.post("/api/join/update-request", {
//         request_id: requestId,
//         status,
//       });
//       toast.success(res.data.message || `Request ${status}`);
//       fetchRequests();
//     } catch (err) {
//       console.error("Error updating request:", err);
//       toast.error("Action failed");
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <ToastContainer position="top-right" autoClose={3000} />

//       <h2 className="text-3xl font-bold mb-6 text-indigo-700">
//         Pending Join Requests
//       </h2>

//       {loading ? (
//         <p className="text-gray-600">Loading requests...</p>
//       ) : requests.length === 0 ? (
//         <p className="text-gray-500 bg-white p-4 rounded shadow">
//           No pending requests.
//         </p>
//       ) : (
//         <div className="overflow-x-auto bg-white rounded-lg shadow">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-indigo-100">
//                 <th className="p-3 border-b">Student Name</th>
//                 <th className="p-3 border-b">Email</th>
//                 <th className="p-3 border-b text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req) => (
//                 <tr key={req.id} className="hover:bg-gray-50">
//                   <td className="p-3 border-b">{req.student_name}</td>
//                   <td className="p-3 border-b">{req.email}</td>
//                   <td className="p-3 border-b text-center">
//                     <button
//                       onClick={() => handleAction(req.id, "approved")}
//                       className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 mr-2"
//                     >
//                       Approve
//                     </button>
//                     <button
//                       onClick={() => handleAction(req.id, "rejected")}
//                       className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
//                     >
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pending join requests
  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Adjust API route to match backend: /pending-requests/:clubId
      // If clubId is stored in session/backend, you can use /pending-requests directly
      const res = await axios.get("/admin-dashboard/pending-requests");// Replace 1 with dynamic clubId if needed
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  // Approve / Reject actions
  const handleAction = async (requestId, action) => {
  try {
    const endpoint =
      action === "approved"
        ? `/admin-dashboard/approve-request/${requestId}`
        : `/admin-dashboard/reject-request/${requestId}`;

    const res = await axios.post(endpoint);
    toast.success(res.data.message || `Request ${action}`);
    fetchRequests();
  } catch (err) {
    console.error(`Error ${action} request:`, err);
    toast.error("Action failed");
  }
};


  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="text-3xl font-bold mb-6 text-indigo-700">
        Pending Join Requests
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading requests...</p>
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
                <th className="p-3 border-b">Department</th>
                <th className="p-3 border-b">Year</th>
                <th className="p-3 border-b">Reason</th>
                <th className="p-3 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.request_id} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{req.name}</td>
                  <td className="p-3 border-b">{req.email}</td>
                  <td className="p-3 border-b">{req.department}</td>
                  <td className="p-3 border-b">{req.year}</td>
                  <td className="p-3 border-b">{req.reason}</td>
                  <td className="p-3 border-b text-center">
                    <button
                      onClick={() => handleAction(req.request_id, "approved")}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 mr-2"
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

