import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './HomePage';
import Club from './components/club';
import Login from './components/Login';
import Signup from './components/Signup';
import Event from './components/event';
import StudentEvents from './components/StudentEvents';
import Header from './components/header';
import ForgetPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

function App() {
  const [user, setUser] = useState(null);

  // ✅ Restore session on page refresh
  useEffect(() => {
    axios.get('/api/auth/check', { withCredentials: true })
      .then(res => {
        setUser(res.data.user);
      })
      .catch(() => {
        setUser(null); // not logged in
      });
  }, []);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/club" element={<Club />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/event"
          element={
            user?.role === 'club_admin' ? (
              <Event user={user} />
            ) : (
              <StudentEvents user={user} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
