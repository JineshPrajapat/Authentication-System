import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../services/auth'; // Adjust this import path to your actual service
import { useNavigate, useLocation } from 'react-router-dom';

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const { loading } = useSelector((state) => state.user);

  const [token, setToken] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const resetToken = queryParams.get('token');
    setToken(resetToken);
  }, [location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'password') {
      setPassword(value);
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setError('Please fill in both fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setError(null); 
      await dispatch(resetPassword({ password, confirmPassword, token }));
      setIsSuccess(true);
    } catch (error) {
      setError('Failed to reset password. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
        
        {/* Success message */}
        {isSuccess ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-green-500 mb-4">
              Password updated successfully!
            </p>
            <p className="text-sm text-gray-600 mb-4">
              You can now log in with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-left text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your new password"
                required
              />
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-left text-sm font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm your new password"
                required
              />
            </div>

            {/* Error message */}
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
