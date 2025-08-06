import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const openLink = (url) => (window.location.href = url);

  return (
    <footer className="bg-gradient-to-r from-purple-900 via-purple-800 to-purple-700 text-white py-10 px-6 rounded-t-3xl">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo & About */}
        <div>
          <h2 className="flex items-center text-2xl font-bold text-pink-300 mb-3">
            ✨ Campus Events
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Your ultimate destination for college events, club activities, and campus life. 
            Stay connected and never miss an opportunity to grow and have fun.
          </p>
          <div className="flex space-x-4 mt-4">
            {[{icon: <FaFacebookF />, url: "https://facebook.com"},
              {icon: <FaTwitter />, url: "https://twitter.com"},
              {icon: <FaInstagram />, url: "https://instagram.com"},
              {icon: <FaLinkedin />, url: "https://linkedin.com"}].map((item, idx) => (
              <button
                key={idx}
                onClick={() => openLink(item.url)}
                className="bg-white/20 hover:bg-white/40 p-3 rounded-full transition"
              >
                {item.icon}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            {["Upcoming Events", "Events Gallery", "Student Clubs", "Event Registration", "About Us"].map((link, i) => (
              <li key={i} className="hover:text-pink-300 cursor-pointer">{link}</li>
            ))}
          </ul>
        </div>

        {/* Event Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Event Categories</h3>
          <ul className="space-y-2 text-gray-300">
            {["Technology", "Cultural", "Academic", "Sports", "Workshops"].map((cat, i) => (
              <li key={i} className="hover:text-pink-300 cursor-pointer">{cat}</li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <p className="bg-white/10 p-3 rounded-lg">📍 123 University Ave, Campus City</p>
            <p className="bg-white/10 p-3 rounded-lg">📞 +1 (555) 123-4567</p>
            <p className="bg-white/10 p-3 rounded-lg">📧 events@college.edu</p>
          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Campus Events. All rights reserved.  
        <p className="text-pink-300 mt-1">Developed by Team Lavender</p>
      </div>
    </footer>
  );
};

export default Footer;
