import React, { useState } from 'react';
import NotAuthorizedPage from './NotAuthorizedPage';

const Home = ({ Darkmode }) => {
    const username = localStorage.getItem("username");
    const userid = localStorage.getItem("userid");

    const [isLoggedIn, setIsLoggedIn] = useState((userid !== null && userid !== undefined && userid !== ""));
    const onLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("userid");
        alert('Successfully logged out');
        navigate("/login");
    };

    return (
        <div className="flex flex-col min-h-[80vh]">
            <p className='text-4xl font-bold text-center pt-5'>Welcome to the home page</p>
            <div className='flex flex-col items-center justify-center'>
                <form className="pt-5" onSubmit={onLogout}>
                    <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                        Log Out testing purpose
                    </button>
                </form>
            </div>
            {/* Main Content */}
            {isLoggedIn ? (
                <div className="flex-grow flex justify-center items-center overflow-x-auto">
                    <NotAuthorizedPage />
                </div>
            ) : (
                <div className="flex-grow flex flex-col items-center justify-center">
                    <NotAuthorizedPage />
                </div>
            )}
        </div>
    );
}

export default Home;
