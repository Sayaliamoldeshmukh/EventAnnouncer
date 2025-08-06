import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.withCredentials = true;

const Signup = () => {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: full form
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [form, setForm] = useState({
    name: '',
    password: '',
    phone: '',
    department: '',
    role: '',
    club_name: ''
  });

  const navigate = useNavigate();

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/send-otp', { email });
      toast.success("OTP Send successfully ");
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/verify-otp', { email, otp });
      toast.success("Verification Successfull");
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'OTP verification failed');
    }
  };

  // STEP 3: Submit final signup
  const handleSignup = async (e) => {
    e.preventDefault();
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error('📱 Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const res = await axios.post('/api/auth/signup', {
        ...form,
        email, // include verified email
      });
      toast.success("Signup Successfull");
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-600 to-purple-600">
      <ToastContainer position="top-right" autoClose={3000} />
      <form
        onSubmit={
          step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleSignup
        }
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-1">
          Welcome to Campus Events
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Join your campus community and discover amazing events
        </p>

        <div className="flex justify-center mb-6">
          <Link
            to="/login"
            className="px-6 py-2 bg-gray-100 border border-gray-300 rounded-l-lg text-gray-500 hover:text-purple-600"
          >
            Login
          </Link>
          <button
            disabled
            className="px-6 py-2 bg-white border border-l-0 border-gray-300 rounded-r-lg font-semibold text-black"
          >
            Sign Up
          </button>
        </div>

        {/* Step 1: Email Input */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: OTP Input */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP sent to your email"
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3: Final Form */}
        {step === 3 && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              maxLength={10}
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select Role</option>
              <option value="student">Student</option>
              <option value="club_admin">Club Admin</option>
            </select>

            {form.role === 'club_admin' && (
              <input
                type="text"
                name="club_name"
                placeholder="Club Name"
                value={form.club_name}
                onChange={handleChange}
                required
                className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            )}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            >
              Complete Sign Up
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default Signup;
