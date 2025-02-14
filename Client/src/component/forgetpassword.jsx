import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendPasswordResetLink } from '../services/auth'; // Adjust this to your actual service
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { loading } = useSelector((state) => state.user);

  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError('Please enter your email');
      return;
    }

    try {
      setError(null); // Reset any previous error
      await dispatch(sendPasswordResetLink({ email }));
      setIsSuccess(true); // Show success message after successful API response
    } catch (error) {
      setError('Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
        
        {/* Success message */}
        {isSuccess ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-green-500 mb-4">
              Password reset link has been sent to your email.
            </p>
            <p className="text-sm text-gray-600">
              Please check your inbox (and spam folder) for the reset instructions.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-left text-sm font-semibold text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
              />
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 cursor-pointer"
            >
              {loading ? 'Sending link...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        {/* Link to login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Remembered your password?{' '}
          <p onClick={()=>navigate("/")} className="text-blue-500 hover:text-blue-600">Login</p>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
