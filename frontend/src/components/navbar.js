import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { FaUserCircle } from 'react-icons/fa';

import axios from 'axios';

const Navbar = ({ user, setUser }) => {

  const navigate = useNavigate();



  // const handleLogout = () => {

  //   localStorage.removeItem('user');

  //   setUser(null);

  //   navigate('/login');

  // };

  const handleLogout = async () => {
  try {
    await axios.post('/api/auth/logout', {}, { withCredentials: true }); // 🧼 Clear session
  } catch (error) {
    console.error('Logout failed:', error);
  }

  setUser(null); // 🔄 Clear user from frontend
  navigate('/login'); // 🔁 Redirect to login
};



  return (

    <nav className="relative bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-50">

      <div className="max-w-6xl mx-auto px-4">

        <div className="flex justify-between items-center py-4">

          {/* Logo */}

          <div className="text-2xl font-bold text-white">Campus Events</div>



          {/* Nav Links */}

          <div className="hidden md:flex space-x-8 items-center">

            <Link to="/" className="text-white hover:text-indigo-200 font-medium">Home</Link>

            <Link to="/event" className="text-white hover:text-indigo-200 font-medium">Events</Link>

            <Link to="/club" className="text-white hover:text-indigo-200 font-medium">Clubs</Link>



            {/* Login/Profile */}

            {!user ? (

              <Link to="/login" className="text-white hover:text-indigo-200 font-medium">Login</Link>

            ) : (

              <div className="relative group">

                <div className="flex items-center gap-2 text-white cursor-pointer">

                  <FaUserCircle className="text-2xl" />

                  <span className="capitalize">{user.name?.split(' ')[0]}</span>

                </div>



                {/* Dropdown */}

                <div className="absolute right-0 mt-2 w-32 bg-white text-gray-800 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">

                  <button

                    onClick={handleLogout}

                    className="w-full text-left px-4 py-2 hover:bg-gray-100"

                  >

                    Logout

                  </button>

                </div>

              </div>

            )}

          </div>



          {/* Mobile Icon (Optional) */}

          <button className="md:hidden text-white">

            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">

              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />

            </svg>

          </button>

        </div>

      </div>

    </nav>

  );

};



export default Navbar;