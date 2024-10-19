import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const ReadyToGo = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:8090/login', {
                username,
                password,
            });

            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
                setSuccessMessage('Login successful!');
                alert("Login successfully");

                navigate('/');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('An error occurred during login.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="fixed top-0 z-50 w-full p-4 border-b  bg-white flex justify-start items-center space-x-4 shadow-md">
                <Link className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all" to="/">
                    Return to Home
                </Link>
            </div>
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md text-center">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">You are ready to explore our product!</h2>
                </div>
                <Link
                    className=" bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all"
                    to="/product"
                >
                    Explore Product
                </Link>
            </div>

        </div>
    );
};

export default ReadyToGo;
