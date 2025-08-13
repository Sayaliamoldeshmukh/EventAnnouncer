import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/navbar';
import Home from './HomePage';
import Club from './components/club';
import Login from './components/Login';
import Signup from './components/Signup';
import Event from './components/event';
import StudentEvents from './components/StudentEvents';
import ForgetPassword from './components/ForgotPassword';

// ✅ Import main club dashboard instead of pending only
import ClubDashboard from './components/ClubDashboard';
import AdminDashboard from './components/admindashboard'; 

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />

        {/* ✅ Club route now loads full dashboard for admins */}
        <Route
          path="/club"
          element={
            user?.role === 'club_admin'
              ? <ClubDashboard user={user} />
              : <Club user={user} />
          }
        />

        {/* ✅ Event route */}
        <Route
          path="/event"
          element={
            user?.role === 'club_admin'
              ? <Event user={user} />
              : <StudentEvents user={user} />
          }
        />

        {/* ✅ Admin Dashboard */}
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
