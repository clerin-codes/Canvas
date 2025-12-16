import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { email, name, password, confirmPassword, otp } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendOTP = async e => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:5000/api/auth/send-otp', { email });
      setStep(2);
      setSuccess('OTP sent to your email');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async e => {
    e.preventDefault();
    
    if (!name || !password || !confirmPassword || !otp) {
      setError('Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
        otp
      });

      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Merge guest cart into server cart
      const guest = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      if (guest.length > 0) {
      try {
      await axios.post(
      'http://localhost:5000/api/cart/merge',
      { items: guest },
      { headers: { 'x-auth-token': token } }
      );
      localStorage.removeItem('guest_cart');
      } catch (mergeErr) {
      console.error('Cart merge failed:', mergeErr);
      }
      }
      
      navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join Canvas Clothing Store</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-8">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="text-sm mt-1">Email</span>
          </div>
          <div className="w-12 h-1 bg-gray-300 mx-2"></div>
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="text-sm mt-1">OTP</span>
          </div>
          <div className="w-12 h-1 bg-gray-300 mx2"></div>
          <div className={`flex flex-col items-center ${step === 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="text-sm mt-1">Complete</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Step 1: Enter email */}
        {step === 1 && (
          <form onSubmit={sendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP and complete registration */}
        {step === 2 && (
          <form onSubmit={registerUser} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={otp}
                onChange={onChange}
                required
                maxLength="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="text-sm text-gray-500 mt-2">OTP sent to: {email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Confirm your password"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;