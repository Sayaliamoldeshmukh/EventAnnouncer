import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
    setMenuOpen(false);
  };

  return (
    <nav className="relative bg-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center py-4">
        
        {/* ✅ Logo */}
        <div className="text-xl font-bold text-purple-700">Campus Events</div>

        {/* ✅ Desktop Links */}
        <div className="hidden md:flex space-x-8 items-center font-medium">
          <Link to="/" className="text-gray-700 hover:text-purple-600">Home</Link>
          <Link to="/event" className="text-gray-700 hover:text-purple-600">Events</Link>
          <Link to="/club" className="text-gray-700 hover:text-purple-600">Clubs</Link>
          {/* <Link to="/admin" className="text-gray-700 hover:text-purple-600">Club Admin</Link> */}

          {/* ✅ Login / Logout */}
          {!user ? (
            <Link to="/login" className="border border-purple-500 text-purple-600 px-3 py-1 rounded-md hover:bg-purple-100 transition">Login</Link>
          ) : (
            <div className="relative group">
              <div className="flex items-center gap-1 text-gray-700 cursor-pointer">
                <FaUserCircle className="text-2xl text-purple-600" />
                <span>{user.name?.split(' ')[0]}</span>
              </div>
              <div className="absolute right-0 mt-2 w-32 bg-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-gray-100">Logout</button>
              </div>
            </div>
          )}
        </div>

        {/* ✅ Mobile Menu Button */}
        <button className="md:hidden text-gray-700 text-2xl" onClick={() => setMenuOpen(true)}>
          <FaBars />
        </button>
      </div>

      {/* ✅ Mobile Drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 z-50`}>
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)} className="text-gray-700 text-2xl">
            <FaTimes />
          </button>
        </div>

        <div className="flex flex-col items-center space-y-6 text-lg mt-6 font-medium">
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/event" onClick={() => setMenuOpen(false)}>Events</Link>
          <Link to="/club" onClick={() => setMenuOpen(false)}>Clubs</Link>
          {/* <Link to="/admin" onClick={() => setMenuOpen(false)}>Club Admin</Link> */}
          {!user ? (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="border border-purple-500 text-purple-600 px-3 py-1 rounded-md">Login</Link>
          ) : (
            <button onClick={handleLogout} className="text-purple-600">Logout</button>
          )}
        </div>
      </div>

      {menuOpen && <div className="fixed inset-0 bg-black/30" onClick={() => setMenuOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;
