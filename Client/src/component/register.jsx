import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import userApi from '../api/userapi'; // Make sure to import your API correctly

const Register = ({toggleForm}) => {
  const { loading, authState } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [status, setStatus] = useState(null); // 'processing', 'success', 'failed'

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill out all fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Reset previous error messages
    setError('');
    setStatus('processing'); // Set status to "processing" when submitting

    try {
      // Call the API to register the user
      const response = await userApi.post('/auth/register', formData);
      
      // Check for a successful response
      if (response.data.success) {
        setStatus('success');
        // Handle any logic needed after successful registration, e.g., redirect or show success message
        setFormData({
          name: '',
          email: '',
          password: '',
        });
      } else {
        setStatus('failed');
        setError(response.data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setStatus('failed');
      setError(error.response?.data?.message || 'An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        {status === 'processing' && (
          <div className="text-center text-gray-600 mb-4">
            <p>Your registration is in process...</p>
            <div className="animate-spin h-8 w-8 border-t-4 border-blue-500 border-solid rounded-full mx-auto"></div>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center text-green-500 mb-4">
            <p className="text-lg font-semibold">Your account has been created successfully! Verify Email using verification link send on email</p>
          </div>
        )}

        {/* {status === 'failed' && error && (
          <div className="text-center text-red-500 mb-4">
            <p className="text-lg font-semibold">{error}</p>
          </div>
        )} */}

        <form onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'processing'}
            className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors cursor-pointer"
          >
            {status === 'processing' ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
          <button
            onClick={toggleForm}
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
