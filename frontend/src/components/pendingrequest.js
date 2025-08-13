// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// export default function PendingRequests() {
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
//         '/api/join/update-request',
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
//     <div className="p-6">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h2 className="text-2xl font-bold mb-4">Pending Join Requests</h2>
//       {requests.length === 0 ? (
//         <p>No pending requests.</p>
//       ) : (
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="p-2">Student Name</th>
//               <th className="p-2">Email</th>
//               <th className="p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {requests.map(req => (
//               <tr key={req.id} className="border-b">
//                 <td className="p-2">{req.student_name}</td>
//                 <td className="p-2">{req.email}</td>
//                 <td className="p-2 flex gap-2">
//                   <button
//                     onClick={() => handleAction(req.id, 'approved')}
//                     className="bg-green-600 text-white px-3 py-1 rounded"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => handleAction(req.id, 'rejected')}
//                     className="bg-red-600 text-white px-3 py-1 rounded"
//                   >
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function PendingRequests() {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`/api/join/pending-requests`, { withCredentials: true });
      setRequests(res.data);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  const handleAction = async (requestId, status) => {
    try {
      const res = await axios.post(
        '/api/join/update-request',
        { request_id: requestId, status },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      fetchRequests();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-4">Pending Join Requests</h2>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Student Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req.id} className="border-b">
                <td className="p-2">{req.student_name}</td>
                <td className="p-2">{req.email}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleAction(req.id, 'approved')}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req.id, 'rejected')}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
