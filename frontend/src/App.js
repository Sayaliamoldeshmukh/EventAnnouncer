import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Components
import Navbar from './components/navbar';
import Home from './HomePage';
import Club from './components/club';
import Login from './components/Login';
import Signup from './components/Signup';
import Event from './components/event';
import StudentEvents from './components/StudentEvents';
import ForgetPassword from './components/ForgotPassword';
import AdminDashboard from './components/admindashboard'; // default export of ClubDashboard
import MembersList from './components/MembersList';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check user login status
  useEffect(() => {
    axios
      .get('/api/auth/check', { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* Club Dashboard */}
        <Route
          path="/club"
          element={
            user?.role === 'club_admin'
              ? <AdminDashboard user={user} />
              : <Club user={user} />
          }
        />

        {/* Events */}
        <Route
          path="/event"
          element={
            user?.role === 'club_admin'
              ? <Event user={user} />
              : <StudentEvents user={user} />
          }
        />

        {/* Members List (Admin only) */}
        <Route
          path="/members"
          element={
            user?.role === 'club_admin'
              ? <MembersList />
              : <div className="p-6 text-red-500">Unauthorized</div>
          }
        />

        {/* Admin Dashboard (optional separate route) */}
        <Route
          path="/admin-dashboard"
          element={
            user?.role === 'club_admin'
              ? <AdminDashboard user={user} />
              : <div className="p-6 text-red-500">Unauthorized</div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
