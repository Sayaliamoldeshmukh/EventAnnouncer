import React, { useState, useEffect } from 'react';
import './club.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const Clubs = ({ user }) => {
  const [clubs, setClubs] = useState([]);
  const [selectedClub, setSelectedClub] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await axios.get('/api/clubs');
        const processed = response.data.map(club => ({
          ...club,
          achievements: Array.isArray(club.achievements)
            ? club.achievements
            : typeof club.achievements === 'string'
              ? club.achievements.split(',').map(item => item.trim())
              : []
        }));
        setClubs(processed);
      } catch (error) {
        console.error("Error fetching clubs:", error);
        toast.error("Failed to load clubs");
      }
    };
    fetchClubs();
  }, []);

  const handleJoinClub = async (clubId) => {
  if (!user || user.role !== 'student') {
    toast.error("Please log in as a student to join a club");
    return;
  }
  try {
    const res = await axios.post('/api/join/join-request', {
      student_id: user.id,
      club_id: clubId
    });
    toast.success(res.data.message);
    setSelectedClub(null);
  } catch (err) {
    if (err.response?.status === 400) {
      toast.warning(err.response.data.message);
    } else {
      toast.error("Something went wrong");
    }
  }
};

  const filteredClubs = clubs
    .filter(club => club.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className={`min-h-screen bg-gray-50 ${selectedClub ? 'backdrop-blur-sm' : ''}`}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* HEADER */}
      <header className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 overflow-hidden">
        {Array.from({ length: 25 }).map((_, index) => (
          <img
            key={index}
            src="/assets/star.png"
            alt="Sparkle"
            className="absolute w-3 h-3 sparkle pointer-events-none"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

        <div className="max-w-6xl mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between relative z-10">
          <div className="md:w-1/2 text-center md:text-left mt-10 md:mt-0">
            <h1 className="text-5xl font-bold text-white mb-4">CLUBS</h1>
            <p className="text-xl text-yellow-300 max-w-md">
              "Discover, Create, Connect – Join a club and explore your passion at MITAOE."
            </p>
          </div>

          <div className="md:w-1/2 flex justify-center md:justify-end gap-6 flex-wrap">
            {['/images/club1.jpg', '/images/club2.jpg', '/images/club3.jpg'].map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Club ${index + 1}`}
                className="w-36 h-36 object-cover rounded-md shadow-lg"
              />
            ))}
          </div>
        </div>
      </header>

      {/* CLUB LIST */}
      <section className="px-6 pt-6 pb-10">
        {!selectedClub ? (
          <>
            <div className="mb-6 max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Search clubs by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredClubs.map(club => (
                <div key={club.id} className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl">
                  <img
                    src={club.logo}
                    alt={club.name}
                    className="w-32 h-32 mx-auto mb-4 object-cover rounded-full border shadow"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{club.name}</h3>
                  <button
                    onClick={() => setSelectedClub(club)}
                    className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
              <button
                onClick={() => setSelectedClub(null)}
                className="absolute top-3 right-4 text-gray-600 hover:text-red-600 text-5xl"
              >
                &times;
              </button>

              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-lg flex flex-col md:flex-row items-center gap-6">
                <img src={selectedClub.logo} alt={selectedClub.name} className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg" />
                <div>
                  <h2 className="text-3xl font-bold">{selectedClub.name}</h2>
                </div>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50 mt-4">
                <h3 className="text-2xl font-semibold text-indigo-700 mb-2">About Us</h3>
                <p className="text-gray-700">{selectedClub.about}</p>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
                  <h4 className="text-lg font-semibold text-indigo-700 mb-2">Faculty Coordinator</h4>
                  <p className="text-gray-800">{selectedClub.facultyCoordinator}</p>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
                  <h4 className="text-lg font-semibold text-indigo-700 mb-2">Contact Information</h4>
                  <p className="text-gray-800">Email: <a href={`mailto:${selectedClub.email}`} className="text-blue-600 underline">{selectedClub.email}</a></p>
                  <p>Instagram: <a href={selectedClub.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Visit</a></p>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
                  <h4 className="text-lg font-semibold text-indigo-700 mb-2">Student Head</h4>
                  <p className="text-gray-800">{selectedClub.studentHead}</p>
                </div>

                <div className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50 md:col-span-3">
                  <h4 className="text-lg font-semibold text-indigo-700 mb-2">🏆 Achievements</h4>
                  {selectedClub.achievements?.length > 0 ? (
                    <ul className="list-disc list-inside text-gray-800 space-y-1">
                      {selectedClub.achievements.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No achievements listed yet.</p>
                  )}
                </div>
              </div>

              {/* JOIN BUTTON */}
              <div className="mt-6 flex justify-center">
                {user?.role === 'student' && (
                  <button
                    onClick={() => handleJoinClub(selectedClub.id)}
                    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
                  >
                    Join Club
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <footer className="bg-purple-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Campus Events. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Clubs;
