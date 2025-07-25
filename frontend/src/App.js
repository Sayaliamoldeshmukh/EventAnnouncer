// // App.js
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// import Home from './HomePage';
// import Club from './components/club';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Event from './components/event'; // For club_admin
// import StudentEvents from './components/StudentEvents'; // For student
// import Header from './components/header';

// function App() {
//   const [user, setUser] = useState(null); // user = { name, role }

//   return (
//     <Router>
//       <Header user={user} setUser={setUser} />
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/signup" element={<Signup />} />
//         <Route path="/login" element={<Login setUser={setUser} />} />
//         <Route path="/club" element={<Club />} />

//         {/* 👇 Conditionally render Event page based on role */}
//         <Route
//   path="/event"
//   element={
//     user?.role === 'club_admin' ? (
//       <Event user={user} />
//     ) : (
//       <StudentEvents user={user} />
//     )
//   }
// />

//       </Routes>
//     </Router>
//   );
// }

// export default App;
// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './HomePage';
import Club from './components/club';
import Login from './components/Login';
import Signup from './components/Signup';
import Event from './components/event';
import StudentEvents from './components/StudentEvents';
import Header from './components/header';
import ForgetPassword from './components/ForgotPassword'; // ✅ New
import ResetPassword from './components/ResetPassword';   // ✅ New

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Header user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/club" element={<Club />} />

        {/* 🔐 Forgot/Reset Password */}
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* 🎯 Role-based Event Rendering */}
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
