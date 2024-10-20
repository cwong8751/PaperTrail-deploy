import React, { useState } from 'react';
import axios from 'axios';

const GetAccessToken = () => {
    const [token, setToken] = useState("");

    const handleGetToken = async (e) => {
        e.preventDefault();
        try {
            // Fetch the token from the backend
            const response = await axios.get('http://localhost:8090/create-access-token');
            // Assuming the token is returned in the response body
            const parsedData = JSON.parse(response.data);

            // Assuming the token is returned as { "token": "your-token-here" }
            const NewToken = parsedData.token;

            // Store the token in localStorage
            localStorage.setItem("token", NewToken);
            setToken(NewToken);

            // Notify the user of success
            alert('Token generated successfully!');
        } catch (error) {
            // Handle any errors
            alert('Failed to generate token, please try again.');
            console.error('Error generating token:', error);
        }
    };

    return (
        <div>
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">Get Access Token</h2>
                    {/* Show the token if it exists */}
                    <p>Token: {token || "No token yet"}</p>
                    {/* Correctly calling the handleGetToken function on button click */}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleGetToken}
                    >
                        Click Here
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GetAccessToken;
