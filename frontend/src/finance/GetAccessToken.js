import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom'
const GetAccessToken = () => {
    const navigate = useNavigate()
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [customerId, setCustomerId] = useState(localStorage.getItem("customerId"))
    const [link, setLink] = useState(null)
    const [accounts, setAccounts] = useState(localStorage.getItem("accounts"))
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
    const handleGetCustomerId = async (e) => {
        e.preventDefault();
        console.log(token)
        try {
            // Fetch the token from the backend
            const response = await axios.post('http://localhost:8090/add-customer', {
                token: token
            });
            // Assuming the token is returned in the response body
            // {"id":"7033720937","username":"customer_1729382472","createdDate":"1729389906"}
            console.log(response)
            const customerId = response.data.id
            const username = response.data.username
            const createdDate = response.data.createdDate
            // Assuming the token is returned as { "token": "your-token-here" }
            // Store the token in localStorage
            localStorage.setItem("customerId", customerId);
            localStorage.setItem("username", username);
            localStorage.setItem("createdDate", createdDate);
            setCustomerId(customerId);
            // Notify the user of success
            alert('Customer ID fetched successfully!');
        } catch (error) {
            // Handle any errors
            alert('Failed to fetch customer ID, please try again.');
            console.error('Error generating token:', error);
        }
    };
    const handleGenerateLink = async (e) => {
        e.preventDefault();
        try {
            // Fetch the token from the backend
            const response = await axios.post('http://localhost:8090/generate-link', {
                token: token,
                customerId: customerId
            });
            // Assuming the token is returned in the response body
            // Assuming the token is returned as { "token": "your-token-here" }
            const link = response.data.link;
            console.log(response)
            // Store the token in localStorage
            localStorage.setItem("link", link);
            setLink(link);
            console.log(link)
            // Notify the user of success
            window.location.href = link;
        } catch (error) {
            // Handle any errors
            alert('Failed to fetch customer ID, please try again.');
            console.error('Error generating token:', error);
        }
    };

    const handleAccountDetails = async (e) => {
        e.preventDefault();
        try {
            // Fetch the token from the backend
            const response = await axios.post('http://localhost:8090/refresh-accounts', {
                token: token,
                customerId: customerId
            });
            // Assuming the token is returned in the response body
            // Assuming the token is returned as { "token": "your-token-here" }
            const accounts = response.data.accounts;
            console.log(accounts)
            // Store the token in localStorage
            localStorage.setItem("accounts", accounts);
            setAccounts(accounts)
            // Notify the user of success
        } catch (error) {
            // Handle any errors
            alert('Failed to fetch customer ID, please try again.');
            console.error('Error generating token:', error);
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
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
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">Get Customer ID</h2>
                    {/* Show the token if it exists */}
                    <p>Customer ID: {customerId || "No token yet"}</p>
                    {/* Correctly calling the handleGetToken function on button click */}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleGetCustomerId}
                    >
                        Click Here
                    </button>
                </div>
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">Generate Link</h2>
                    {/* Show the token if it exists */}
                    <p>Generate Link to Connect Your Bank Account</p>
                    {/* Correctly calling the handleGetToken function on button click */}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleGenerateLink}
                    >
                        Click Here
                    </button>
                    
                </div>
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">Get Account Details</h2>
                    {/* Show the token if it exists */}
                    <p>Get Account Details</p>
                    {/* Correctly calling the handleGetToken function on button click */}
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleAccountDetails}
                    >
                        Click Here
                    </button>
                    
                </div>
            </div>
        </div>
    );
}

export default GetAccessToken;
