// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from '../components/navbar';

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// const StudentEvents = () => {
//   const [events, setEvents] = useState([]);
//   const [registeredEvents, setRegisteredEvents] = useState([]);
//   const [selectedTab, setSelectedTab] = useState('upcoming');
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         await fetchRegisteredEvents();
//         await fetchEvents();

//         const postLoginEventId = sessionStorage.getItem("registerAfterLogin");
//         if (postLoginEventId) {
//           handleRegister(Number(postLoginEventId));
//           sessionStorage.removeItem("registerAfterLogin");
//         }
//       } catch (err) {
//         console.error("User not logged in, redirecting to login.");
//         window.location.href = "/login";
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = selectedEvent ? 'hidden' : 'auto';
//   }, [selectedEvent]);

//   const fetchEvents = async () => {
//     try {
//       const res = await axios.get('/api/student/events/all');

//       setEvents(res.data || []);
//     } catch (error) {
//       console.error('Failed to fetch events:', error);
//     }
//   };

//   const fetchRegisteredEvents = async () => {
//     try {
//       const res = await axios.get('/api/student/registered');
//       const registeredIds = res.data.map((e) => e.event_id || e.id);
//       setRegisteredEvents(registeredIds);
//     } catch (error) {
//       console.error('Failed to fetch registered events:', error);
//     }
//   };

//   const handleRegister = async (eventId) => {
//     try {
//       await axios.post(`/api/student/register/${eventId}`);
//       alert("✅ Registration successful!");
//       setRegisteredEvents((prev) => [...prev, eventId]);
//       setTimeout(fetchRegisteredEvents, 1000);
//     } catch (error) {
//       if (error.response?.status === 401 || error.response?.status === 403) {
//         sessionStorage.setItem("registerAfterLogin", eventId.toString());
//         window.location.href = "/login";
//       } else if (error.response?.status === 400) {
//         alert("ℹ You are already registered for this event.");
//         setRegisteredEvents((prev) => [...prev, eventId]);
//       } else {
//         console.error("❌ Registration failed:", error);
//         alert("❌ Something went wrong. Please try again.");
//       }
//     }
//   };

//   const today = new Date();
//   const isPast = (date) => new Date(date) < today;

//   const filteredEvents = {
//     all: events,
//     upcoming: events.filter(e => !isPast(e.date)),
//     past: events.filter(e => isPast(e.date)),
//     registered: events.filter(e => registeredEvents.includes(e.id)),
//   };

//   const getSectionTitle = () => {
//     switch (selectedTab) {
//       case 'upcoming': return 'Upcoming Events';
//       case 'past': return 'Past Events';
//       case 'registered': return 'Your Registered Events';
//       default: return 'All Events';
//     }
//   };

//   const renderEventCard = (event) => {
//     const isPastEvent = isPast(event.date);
//     const isRegistered = registeredEvents.includes(event.id);

//     return (
//       <div
//         key={event.id}
//         className="bg-white border rounded-lg shadow-md p-4 max-w-sm mx-auto hover:shadow-xl transition cursor-pointer"
//         onClick={() => setSelectedEvent(event)}
//       >
//         {event.poster && (
//           <img src={event.poster} alt="Poster" className="rounded mb-2 w-full max-h-48 object-contain" />
//         )}
//         <h3 className="text-lg font-bold">{event.title}</h3>
//         <p className="text-sm text-gray-600">
//           📅 {new Date(event.date).toLocaleDateString()} | 🕒{' '}
//           {event.time
//             ? new Date(`1970-01-01T${event.time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//             : 'N/A'}
//         </p>
//         <p>📍 {event.location}</p>
//         <p>🎓 {event.club_name}</p>
//         <p className="mt-2 text-gray-700 line-clamp-3">{event.description}</p>

//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             if (!isPastEvent && !isRegistered) handleRegister(event.id);
//           }}
//           disabled={isPastEvent || isRegistered}
//           className={`mt-4 w-full py-2 rounded text-white ${
//             isPastEvent || isRegistered
//               ? 'bg-gray-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {isPastEvent ? 'Registration Closed' : isRegistered ? 'Registered' : 'Register'}
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div>
//       <Navbar />

//       {/* Header */}
//       <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 text-center">
//         <h1 className="text-4xl font-bold mb-2">{getSectionTitle()}</h1>
//         <p className="italic text-yellow-300">Find & Register for Campus Events</p>
//       </div>

//       {/* Tabs */}
//       <div className="flex justify-center my-6 gap-2 flex-wrap">
//         {['all', 'upcoming', 'past', 'registered'].map(tab => (
//           <button
//             key={tab}
//             onClick={() => setSelectedTab(tab)}
//             className={`px-4 py-2 rounded-full border ${
//               selectedTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'
//             }`}
//           >
//             {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
//           </button>
//         ))}
//       </div>

//       {/* Events Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 mb-16">
//         {filteredEvents[selectedTab]?.length > 0 ? (
//           filteredEvents[selectedTab].map(event => renderEventCard(event))
//         ) : (
//           <p className="text-center col-span-full text-gray-500">No events to display.</p>
//         )}
//       </div>

//       {/* Modal */}
//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-xl w-full relative overflow-y-auto max-h-[90vh]">
//             <button
//               className="absolute top-2 right-2 text-xl text-gray-600 hover:text-black"
//               onClick={() => setSelectedEvent(null)}
//             >
//               ✕
//             </button>
//             {selectedEvent.poster && (
//               <img src={selectedEvent.poster} alt="Poster" className="rounded mb-4 max-h-60 object-contain mx-auto" />
//             )}
//             <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
//             <p>
//               📅 {new Date(selectedEvent.date).toLocaleDateString()} | 🕒{' '}
//               {selectedEvent.time
//                 ? new Date(`1970-01-01T${selectedEvent.time}`).toLocaleTimeString([], {
//                     hour: '2-digit',
//                     minute: '2-digit',
//                   })
//                 : 'N/A'}
//             </p>
//             <p>📍 {selectedEvent.location}</p>
//             <p>🎓 {selectedEvent.club_name}</p>
//             <div className="mt-3 text-gray-700 whitespace-pre-line">{selectedEvent.description}</div>
//           </div>
//         </div>
//       )}

//       {/* Footer */}
//       <footer className="bg-purple-800 text-white py-8 text-center">
//         <p>&copy; {new Date().getFullYear()} Student Events Portal. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default StudentEvents;
// StudentEvents.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const StudentEvents = () => {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchRegisteredEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('/api/events/all');
      setEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const fetchRegisteredEvents = async () => {
    try {
      const res = await axios.get('/api/student/registered');
      setRegisteredEvents(res.data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    }
  };

  const handleRegister = async (eventId, eventTitle, isPastEvent) => {
    if (isPastEvent) {
      alert("⏳ You cannot register, the deadline has passed.");
      return;
    }

    try {
      await axios.post(`/api/student/register/${eventId}`);
      alert(`✅ Registered successfully for "${eventTitle}"`);
      fetchRegisteredEvents();
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        sessionStorage.setItem("registerAfterLogin", eventId);
        window.location.href = "/login";
      } else if (error.response?.status === 400) {
        alert("ℹ️ You are already registered for this event.");
      } else {
        alert("❌ Registration failed.");
      }
    }
  };

  const today = new Date();
  const upcomingEvents = events.filter(e => new Date(e.date) >= today);
  const pastEvents = events.filter(e => new Date(e.date) < today);

  const renderEventCard = (event, isPastEvent = false) => (
    <div
      key={event.id}
      className="bg-white border rounded-lg shadow-lg shadow-purple-300 p-4 w-full max-w-sm mx-auto flex flex-col justify-between cursor-pointer hover:shadow-xl transition"
      onClick={() => setSelectedEvent(event)}
    >
      <div>
        {event.poster && (
          <img
            src={event.poster}
            alt="Poster"
            className="rounded mt-2 max-h-60 object-contain w-full mx-auto"
          />
        )}
        <h3 className="text-lg font-bold mt-2">{event.title}</h3>
        <p>
          📅 {new Date(event.date).toLocaleDateString()} | 🕒{' '}
          {new Date('1970-01-01T' + event.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <p>📍 Location: {event.location}</p>
        <p>🎓 Organized By: {event.club_name}</p>
        <p className="mt-2 text-gray-700 line-clamp-3 overflow-hidden h-[4.5em]">
          {event.description}
        </p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleRegister(event.id, event.title, isPastEvent);
        }}
        className={`mt-4 px-4 py-2 rounded transition text-white ${
          isPastEvent || registeredEvents.includes(event.id)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-red-700'
        }`}
        disabled={isPastEvent || registeredEvents.includes(event.id)}
      >
        {isPastEvent
          ? 'Registration Closed'
          : registeredEvents.includes(event.id)
          ? 'Registered'
          : 'Register'}
      </button>
    </div>
  );

  return (
    <div>
      <Navbar />

      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 text-center overflow-hidden">
        {Array.from({ length: 25 }).map((_, index) => (
          <img
            key={index}
            src="/assets/starss.png"
            alt="Sparkle"
            className="absolute w-4 h-4 sparkle pointer-events-none"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        <h1 className="relative z-10 text-4xl font-extrabold mb-2">College Events Hub</h1>
        <p className="relative z-10 text-lg italic mb-6 text-yellow-400">
          "Discover, participate, and cherish every campus moment."
        </p>
        <div className="relative z-10 flex justify-center gap-4 flex-wrap">
          <img src="/images/event-left.png" alt="img1" className="h-32 w-48 object-cover rounded-xl shadow-lg" />
          <img src="/images/event-right.jpg" alt="img2" className="h-32 w-48 object-cover rounded-xl shadow-lg" />
          <img src="/images/event-mid.jpg" alt="img3" className="h-32 w-48 object-cover rounded-xl shadow-lg" />
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="text-center my-12">
        <img src="/assets/calender.png" alt="Calendar Icon" className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-purple-700">Upcoming Events</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map(event => renderEventCard(event, false))
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>

      {/* Past Events */}
      <div className="text-center my-12">
        <img src="/assets/clock.png" alt="Clock Icon" className="w-12 h-12 mx-auto mb-4" />
        <h2 className="text-4xl font-bold text-purple-700">Past Events</h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastEvents.length > 0 ? (
          pastEvents.map(event => renderEventCard(event, true))
        ) : (
          <p>No past events.</p>
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-black"
              onClick={() => setSelectedEvent(null)}
            >
              ✕
            </button>
            {selectedEvent.poster && (
              <img
                src={selectedEvent.poster}
                alt="Poster"
                className="rounded mb-4 max-h-60 object-contain mx-auto"
              />
            )}
            <h2 className="text-xl font-bold mb-2">{selectedEvent.title}</h2>
            <p>
              📅 {new Date(selectedEvent.date).toLocaleDateString()} | 🕒{' '}
              {new Date('1970-01-01T' + selectedEvent.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p>📍 Location: {selectedEvent.location}</p>
            <p>🎓 Organized By: {selectedEvent.club_name}</p>
            <div className="mt-3 text-gray-700 whitespace-pre-wrap">
              {selectedEvent.description}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-purple-800 text-white py-8 mt-6 mb-4">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Campus Events. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StudentEvents;
