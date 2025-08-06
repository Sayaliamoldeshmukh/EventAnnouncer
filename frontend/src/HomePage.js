import React from 'react';
// import Navbar from './components/navbar';
import Footer from './components/Footer';

const gatheringPhotos = [
  "/images/event1.jpg",
  "/images/event2.jpg",
  "/images/event3.jpg",
  "/images/event4.jpg",
  "/images/event5.jpg",
  "/images/event6.jpg",
  "/images/event7.jpg",
  "/images/event8.jpg",
  "/images/event9.jpg",
];

const HomePage = () => {
  return (
    <>
      {/* ✅ Gradient Section */}
      <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        {/* ✅ Navbar */}
        {/* <Navbar /> */}

        {/* ✅ Hero Section with Floating Stars */}
        <section className="relative py-24 px-6 overflow-hidden">
          {Array.from({ length: 25 }).map((_, index) => (
            <img
              key={index}
              src="/assets/sparkling.png"
              alt="Sparkle"
              className="absolute w-8 h-8 opacity-100 pointer-events-none animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
          <div className="relative z-10 text-center">
            <h1 className="text-5xl font-extrabold">
              Campus <span className="text-pink-300">Events</span>
            </h1>
            <p className="mt-4 text-lg max-w-2xl mx-auto">
              Discover amazing events, connect with clubs, and make unforgettable memories.
              <br /> Your gateway to an incredible college experience starts here.
            </p>

            {/* ✅ Buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <a href="/event" className="bg-white text-purple-600 px-5 py-2 rounded-lg shadow-md hover:bg-purple-100 flex items-center gap-2">
                📅 View Events →
              </a>
              <a href="/club" className="border border-white px-5 py-2 rounded-lg hover:bg-white hover:text-purple-700 transition">
                👥 Join Clubs →
              </a>
            </div>

            {/* ✅ Stats Cards */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { number: "50+", label: "Active Events" },
                { number: "25+", label: "Student Clubs" },
                { number: "1000+", label: "Students Engaged" }
              ].map((card, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20 shadow-lg hover:scale-105 hover:shadow-xl transition">
                  <h3 className="text-3xl font-bold">{card.number}</h3>
                  <p className="mt-2">{card.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ How It Works */}
        <section className="py-16 text-center bg-white text-gray-800">
          <div className="max-w-6xl mx-auto px-4">
            <img src="/assets/calender.png" alt="Calendar Icon" className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-purple-700 mb-4">How It Works</h2>
            <p className="text-gray-600 mb-10 text-lg max-w-3xl mx-auto">
              Getting involved in campus life is easy. Follow these simple steps to start your journey.
            </p>

            <div className="grid md:grid-cols-3 gap-8 justify-items-center">
              {[
                { icon: "📅", title: "Discover Events", desc: "Browse through a variety of events happening across campus. Filter by your interests and find what excites you." },
                { icon: "👥", title: "Register for Events", desc: "Sign up for events that interest you and get reminders. Track your registrations and never miss an important event." },
                { icon: "⭐", title: "Explore Clubs", desc: "Learn about different clubs and organizations on campus. Discover what each club offers and their upcoming activities." }
              ].map((item, i) => (
                <div key={i} className="bg-white border rounded-lg shadow-lg p-8 w-full max-w-xs transform transition duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-400">
                  <div className="text-purple-600 text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ✅ Event Gallery */}
        <section className="pt-8 pb-16 bg-gray-100 text-gray-900 px-8 sm:px-16 md:px-24">
          <div className="text-center mb-10">
            <img src="/assets/camera.jpg" alt="Gallery Icon" className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-purple-700">Event Gallery</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { src: "/images/firodiya.jpg", caption: "Firodiya" },
              { src: "/images/annual-sports.jpg", caption: "Annual Sports" },
              { src: "/images/club-event.jpg", caption: "Club Event" }
            ].map((img, i) => (
              <div key={i} className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                <img src={img.src} alt={img.caption} className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <h3 className="text-white text-xl font-semibold">{img.caption}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ✅ Nakshatra Section (White background) */}
      <section className="relative text-center px-8 sm:px-16 md:px-24 pt-10 pb-6 bg-white text-gray-900">
        <img src="/assets/mandola.png" alt="Mandala Art" className="absolute left-4 top-4 w-40 sm:w-56 md:w-64 opacity-60" />
        <h2 className="text-4xl font-bold text-purple-800 relative z-10">Nakshatra</h2>
        <p className="mt-2 text-lg text-gray-700 relative z-10">
          Some glimpse of the MITAOE's annual function
        </p>

        <div className="max-w-7xl mx-auto mt-6 rounded-2xl p-6 bg-yellow-200 shadow-inner shadow-yellow-300/50 border border-yellow-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {gatheringPhotos.map((src, idx) => (
              <div key={idx} className="overflow-hidden rounded-xl shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-yellow-500/60">
                <img src={src} alt={`College Event ${idx + 1}`} className="w-full h-40 object-cover transition-transform duration-300 hover:scale-110" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✅ Footer */}
      <Footer />
    </>
  );
};

export default HomePage;
