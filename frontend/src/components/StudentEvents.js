import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/navbar';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

const StudentEvents = function () {
  const [events, setEvents] = useState([]);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllEvents();
    fetchRegisteredEvents();
  }, []);

  const fetchAllEvents = async function () {
    try {
      const res = await axios.get('/api/student/events/all');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    }
  };

  const fetchRegisteredEvents = async function () {
    try {
      const res = await axios.get('/api/student/registered');
      setRegisteredEvents(res.data.map(e => e.id));
    } catch (err) {
      console.error('Failed to fetch registered events:', err);
    }
  };

  const handleRegister = async function (eventId) {
    setLoading(true);
    try {
      const res = await axios.post('/api/student/register/${eventId}');
      setRegisteredEvents(prev => [...prev, eventId]);
      alert(res.data.message);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(function (event) {
    const now = new Date();
    const eventDate = new Date(event.date);
    const isRegistered = registeredEvents.includes(event.id);

    if (selectedTab === 'upcoming') return eventDate > now;
    if (selectedTab === 'past') return eventDate < now;
    if (selectedTab === 'registered') return isRegistered;
    return true;
  });

  return React.createElement(
    'div',
    null,
    React.createElement(Navbar),
    React.createElement(
      'div',
      { className: 'tabs flex gap-4 justify-center mt-6' },
      ['all', 'upcoming', 'past', 'registered'].map(tab =>
        React.createElement(
          'button',
          {
            key: tab,
            className:
              'px-4 py-2 rounded ' +
              (selectedTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200'),
            onClick: () => setSelectedTab(tab),
          },
          tab.charAt(0).toUpperCase() + tab.slice(1)
        )
      )
    ),
    React.createElement(
      'div',
      { className: 'events grid grid-cols-1 md:grid-cols-2 gap-4 p-4' },
      filteredEvents.length === 0
        ? React.createElement(
            'p',
            { className: 'text-center col-span-2 text-gray-500' },
            'No events found.'
          )
        : filteredEvents.map(event => {
            const isRegistered = registeredEvents.includes(event.id);
            return React.createElement(
              'div',
              {
                key: event.id,
                className: 'border p-4 rounded shadow bg-white',
              },
              React.createElement(
                'h2',
                { className: 'text-xl font-semibold' },
                event.title
              ),
              React.createElement('p', null, event.description),
              React.createElement(
                'p',
                null,
                React.createElement('strong', null, 'Date:'),
                ' ',
                new Date(event.date).toLocaleDateString()
              ),
              React.createElement(
                'button',
                {
                  className:
                    'mt-2 px-4 py-2 rounded ' +
                    (isRegistered
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white'),
                  disabled: isRegistered || loading,
                  onClick: () => handleRegister(event.id),
                },
                isRegistered ? 'Registered' : loading ? 'Loading...' : 'Register'
              )
            );
          })
    )
  );
};

export default StudentEvents;