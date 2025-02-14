import React, { useState } from 'react';
import Login from '../component/login';
import Register from '../component/register';

const AuthToggle = () => {
    // State to toggle between Login and Register components
    const [isLogin, setIsLogin] = useState(true);

    // Handle toggle button click
    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full bg-white rounded-lg shadow-lg">
                {isLogin ? <Login toggleForm={toggleForm} /> : <Register toggleForm={toggleForm} />}
            </div>
        </div>
    );
};

export default AuthToggle;
