import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      setMessage(res.data.message);
      setStep(2); // Move to OTP step
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send OTP.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/reset-password-with-otp', {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-center mb-4">Forgot Password</h2>

      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-purple-700 text-white py-2 rounded">
            Send OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-3">
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border px-3 py-2 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border px-3 py-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
            Reset Password
          </button>
        </form>
      )}

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
