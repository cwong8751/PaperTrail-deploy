import React, { useState } from 'react';
import NotAuthorizedPage from './NotAuthorizedPage';

const Home = ({ Darkmode }) => {
    const username = localStorage.getItem("username");
    const userid = localStorage.getItem("userid");

    const [isLoggedIn, setIsLoggedIn] = useState((userid !== null && userid !== undefined && userid !== ""));

    return (
        <div className="flex flex-col min-h-[80vh]">
            <p className='text-4xl font-bold text-center'>Welcome to the home page</p>
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
