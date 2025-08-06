// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Navbar from '../components/navbar';

// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// const Event = () => {
//   const [events, setEvents] = useState([]);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     date: '',
//     time: '',
//     location: '',
//     club_name: '',
//     event_type: '',
//     poster: null,
//   });
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [eventToEdit, setEventToEdit] = useState(null);
//   const [successMessage, setSuccessMessage] = useState('');
//   const [registrations, setRegistrations] = useState({});
//   const [expandedEventId, setExpandedEventId] = useState(null);

//   const fetchMyEvents = async () => {
//     try {
//       const res = await axios.get('/api/clubAdmin/my-events');
//       setEvents(res.data);
//     } catch (err) {
//       console.error('❌ Error fetching events:', err);
//     }
//   };

//   useEffect(() => {
//     fetchMyEvents();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     if (name === 'poster') {
//       setFormData((prev) => ({ ...prev, poster: files[0] }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       title: '',
//       description: '',
//       date: '',
//       time: '',
//       location: '',
//       club_name: '',
//       event_type: '',
//       poster: null,
//     });
//     setIsEditMode(false);
//     setEventToEdit(null);
//   };

//   const validateForm = () => {
//     const requiredFields = ['title', 'description', 'date', 'time', 'location', 'club_name', 'event_type'];
//     for (const field of requiredFields) {
//       if (!formData[field] || formData[field].trim() === '') {
//         alert(`Please fill in the "${field}" field.`);
//         return false;
//       }
//     }

//     const selectedDate = new Date(`${formData.date}T${formData.time}`);
//     const now = new Date();
//     if (selectedDate < now) {
//       alert('Please select a valid future date and time.');
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
//   if (!validateForm()) return;

//   const data = new FormData();
//   Object.entries(formData).forEach(([key, value]) => {
//     if (value !== null && value !== '') {
//       data.append(key, value);
//     }
//   });

//   try {
//     if (isEditMode && eventToEdit) {
//       await axios.put(`/api/clubAdmin/event/${eventToEdit.id}`, data, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setSuccessMessage('✅ Event updated successfully!');
//     } else {
//       await axios.post('/api/clubAdmin/events', data);
//       setSuccessMessage('✅ Event created successfully!');
//     }
//     fetchMyEvents();
//     resetForm();
//     setTimeout(() => setSuccessMessage(''), 3000);
//   } catch (err) {
//     console.error('❌ Error saving event:', err);
//     alert('❌ Failed to save event');
//   }
// };

//   const handleEdit = (event) => {
//     setIsEditMode(true);
//     setEventToEdit(event);
//     setFormData({
//   title: event.title || '',
//   description: event.description || '',
//   date: new Date(event.date).toISOString().slice(0, 10),
//   time: event.time.slice(0, 5),
//   location: event.location || '',
//   club_name: event.club_name || '',
//   event_type: event.event_type || '',
//   poster: null,
// });

//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   const handleDelete = async (eventId) => {
//     if (!window.confirm('Are you sure you want to delete this event?')) return;
//     try {
//       await axios.delete(`/api/clubAdmin/event/${eventId}`);
//       alert('🗑️ Event deleted');
//       fetchMyEvents();
//     } catch (err) {
//       console.error(err);
//       alert('❌ Failed to delete event');
//     }
//   };

//   const toggleRegistrations = async (eventId) => {
//     if (expandedEventId === eventId) {
//       setExpandedEventId(null);
//       return;
//     }

//     try {
//       const res = await axios.get(`/api/clubAdmin/event/${eventId}/registrations`);
//       setRegistrations((prev) => ({ ...prev, [eventId]: res.data }));
//       setExpandedEventId(eventId);
//     } catch (error) {
//       console.error('❌ Failed to fetch registrations:', error);
//       alert('❌ Failed to fetch registrations');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 font-sans">
//       <Navbar />
//       <header className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 overflow-hidden text-center">
//         {Array.from({ length: 25 }).map((_, index) => (
//           <img
//             key={index}
//             src="/assets/starss.png"
//             alt="Sparkle"
//             className="absolute w-4 h-4 sparkle pointer-events-none"
//             style={{
//               top: `${Math.random() * 100}%`,
//               left: `${Math.random() * 100}%`,
//               animationDelay: `${Math.random() * 5}s`,
//             }}
//           />
//         ))}
//         <h1 className="text-3xl text-yellow-300 font-bold">Event Dashboard</h1>
//         <button
//           className="mt-4 bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
//           onClick={() => {
//             resetForm();
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//           }}
//         >
//           {isEditMode ? 'Cancel Edit' : 'Add New Event'}
//         </button>
//       </header>

//       <div className="p-6 max-w-6xl mx-auto">
//         <div className="bg-white shadow-md rounded-lg p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4 text-purple-700">
//             {isEditMode ? '✏️ Edit Event' : '📌 Create New Event'}
//           </h2>
//           <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="p-2 border rounded" />
//             <input name="date" type="date" value={formData.date} onChange={handleChange} className="p-2 border rounded" />
//             <input name="time" type="time" value={formData.time} onChange={handleChange} className="p-2 border rounded" />
//             <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="p-2 border rounded" />
//             <input name="club_name" placeholder="Club Name" value={formData.club_name} onChange={handleChange} className="p-2 border rounded" />
//             <select name="event_type" value={formData.event_type} onChange={handleChange} className="p-2 border rounded">
//               <option value="">Select Event Type</option>
//               <option value="Cultural Events">Cultural Events</option>
//               <option value="Technical Events">Technical Events</option>
//               <option value="Career & Innovation">Career & Innovation</option>
//               <option value="Sports Events">Sports Events</option>
//               <option value="Academic Events">Academic Events</option>
//             </select>
//             <input name="poster" type="file" onChange={handleChange} className="p-2 border rounded" />
//             <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="p-2 border rounded col-span-full" />
//             <button type="submit" className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 col-span-full">
//               {isEditMode ? 'Update Event' : 'Create Event'}
//             </button>
//           </form>
//           {successMessage && <p className="text-green-600 mt-4 font-medium">{successMessage}</p>}
//         </div>

//         <div className="text-center mt-6 mb-4">
//           <img src="/assets/calender.png" alt="Calendar Icon" className="w-12 h-12 mx-auto mb-4" />
//           <h2 className="text-3xl font-bold text-purple-700">Managed Events</h2>
//         </div>

//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {events.map((event) => (
//             <div key={event.id} className="bg-white shadow-md rounded-lg p-4 transition transform hover:scale-[1.02]">
//               <h3 className="text-xl font-bold mb-2">{event.title}</h3>
//               <p className="text-gray-600 mb-2">{event.description?.slice(0, 100)}...</p>
//               <p>
//                 📅 {new Date(event.date).toLocaleDateString()} | 🕒{' '}
//                 {new Date('1970-01-01T' + event.time).toLocaleTimeString([], {
//                   hour: '2-digit',
//                   minute: '2-digit',
//                 })}
//               </p>
//               <p className="text-sm text-gray-500">📍 {event.location}</p>
//               <p className="text-sm">🎓 {event.club_name} | 📂 {event.event_type}</p>
//               {event.poster && (
//                 <img src={event.poster} alt="Poster" className="rounded mt-2 max-h-40 object-contain w-full" />
//               )}
//               <div className="mt-4 flex gap-2 flex-wrap">
//                 <button onClick={() => handleEdit(event)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
//                 <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
//                 <button onClick={() => toggleRegistrations(event.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
//                   {expandedEventId === event.id ? 'Hide Registrations' : 'View Registrations'}
//                 </button>
//               </div>
//               {expandedEventId === event.id && (
//                 <div className="mt-4 bg-gray-50 p-3 rounded shadow-inner">
//                   <h4 className="font-semibold">Registered Students:</h4>
//                   {registrations[event.id]?.length > 0 ? (
//                     <ul className="list-disc list-inside text-sm">
//                       {registrations[event.id].map((student) => (
//                         <li key={student.id}>{student.name} ({student.email})</li>
//                       ))}
//                     </ul>
//                   ) : (
//                     <p className="text-gray-500 text-sm">No registrations yet.</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       <footer className="bg-purple-800 text-white py-8 mt-10">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="text-center">
//             <p>&copy; {new Date().getFullYear()} Campus Events. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Event;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import Navbar from '../components/navbar';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const Event = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    club_name: '',
    event_type: '',
    poster: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [registrations, setRegistrations] = useState({});
  const [expandedEventId, setExpandedEventId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW

  const fetchMyEvents = async () => {
    try {
      const res = await axios.get('/api/clubAdmin/my-events');
      setEvents(res.data);
    } catch (err) {
      console.error('❌ Error fetching events:', err);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'poster') {
      setFormData((prev) => ({ ...prev, poster: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      club_name: '',
      event_type: '',
      poster: null,
    });
    setIsEditMode(false);
    setEventToEdit(null);
  };

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'club_name', 'event_type'];
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        alert(`Please fill in the "${field}" field.`);
        return false;
      }
    }

    const selectedDate = new Date(`${formData.date}T${formData.time}`);
    const now = new Date();
    if (selectedDate < now) {
      alert('Please select a valid future date and time.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true); // NEW

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== '') {
        data.append(key, value);
      }
    });

    try {
      if (isEditMode && eventToEdit) {
        await axios.put(`/api/clubAdmin/event/${eventToEdit.id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setSuccessMessage('✅ Event updated successfully!');
      } else {
         await axios.post('/api/clubAdmin/events', data);
        // const emailsSent = res.data?.emailsSent || 0;
        // setSuccessMessage(`✅ Event created and invitations sent to ${emailsSent} students!`);
        setSuccessMessage('✅ Event created and invitations sent to students!');
      }
      fetchMyEvents();
      resetForm();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('❌ Error saving event:', err);
      alert('❌ Failed to save event');
    } finally {
      setIsSubmitting(false); // NEW
    }
  };

  const handleEdit = (event) => {
    setIsEditMode(true);
    setEventToEdit(event);
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: new Date(event.date).toISOString().slice(0, 10),
      time: event.time.slice(0, 5),
      location: event.location || '',
      club_name: event.club_name || '',
      event_type: event.event_type || '',
      poster: null,
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/api/clubAdmin/event/${eventId}`);
      alert('🗑️ Event deleted');
      fetchMyEvents();
    } catch (err) {
      console.error(err);
      alert('❌ Failed to delete event');
    }
  };

  const toggleRegistrations = async (eventId) => {
    if (expandedEventId === eventId) {
      setExpandedEventId(null);
      return;
    }

    try {
      const res = await axios.get(`/api/clubAdmin/event/${eventId}/registrations`);
      setRegistrations((prev) => ({ ...prev, [eventId]: res.data }));
      setExpandedEventId(eventId);
    } catch (error) {
      console.error('❌ Failed to fetch registrations:', error);
      alert('❌ Failed to fetch registrations');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* <Navbar /> */}
      <header className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 overflow-hidden text-center">
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
        <h1 className="text-3xl text-yellow-300 font-bold">Event Dashboard</h1>
        <button
          className="mt-4 bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100 transition"
          onClick={() => {
            resetForm();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          {isEditMode ? 'Cancel Edit' : 'Add New Event'}
        </button>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">
            {isEditMode ? '✏️ Edit Event' : '📌 Create New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="p-2 border rounded" />
            <input name="date" type="date" value={formData.date} onChange={handleChange} className="p-2 border rounded" />
            <input name="time" type="time" value={formData.time} onChange={handleChange} className="p-2 border rounded" />
            <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="p-2 border rounded" />
            <input name="club_name" placeholder="Club Name" value={formData.club_name} onChange={handleChange} className="p-2 border rounded" />
            <select name="event_type" value={formData.event_type} onChange={handleChange} className="p-2 border rounded">
              <option value="">Select Event Type</option>
              <option value="Cultural Events">Cultural Events</option>
              <option value="Technical Events">Technical Events</option>
              <option value="Career & Innovation">Career & Innovation</option>
              <option value="Sports Events">Sports Events</option>
              <option value="Academic Events">Academic Events</option>
            </select>
            <input name="poster" type="file" onChange={handleChange} className="p-2 border rounded" />
            <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="p-2 border rounded col-span-full" />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`mt-4 px-6 py-2 rounded text-white col-span-full ${
                isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Processing...' : isEditMode ? 'Update Event' : 'Create Event'}
            </button>
          </form>
          {successMessage && <p className="text-green-600 mt-4 font-medium">{successMessage}</p>}
        </div>

        <div className="text-center mt-6 mb-4">
          <img src="/assets/calender.png" alt="Calendar Icon" className="w-12 h-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-purple-700">Managed Events</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow-md rounded-lg p-4 transition transform hover:scale-[1.02]">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              <p className="text-gray-600 mb-2">{event.description?.slice(0, 100)}...</p>
              <p>
                📅 {new Date(event.date).toLocaleDateString()} | 🕒{' '}
                {new Date('1970-01-01T' + event.time).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p className="text-sm text-gray-500">📍 {event.location}</p>
              <p className="text-sm">🎓 {event.club_name} | 📂 {event.event_type}</p>
              {event.poster && (
                <img src={event.poster} alt="Poster" className="rounded mt-2 max-h-40 object-contain w-full" />
              )}
              <div className="mt-4 flex gap-2 flex-wrap">
                <button onClick={() => handleEdit(event)} className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500">Edit</button>
                <button onClick={() => handleDelete(event.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                <button onClick={() => toggleRegistrations(event.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  {expandedEventId === event.id ? 'Hide Registrations' : 'View Registrations'}
                </button>
              </div>
              {expandedEventId === event.id && (
                <div className="mt-4 bg-gray-50 p-3 rounded shadow-inner">
                  <h4 className="font-semibold">Registered Students:</h4>
                  {registrations[event.id]?.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {registrations[event.id].map((student) => (
                        <li key={student.id}>{student.name} ({student.email})</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm">No registrations yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-purple-800 text-white py-8 mt-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <p>&copy; {new Date().getFullYear()} Campus Events. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Event;
