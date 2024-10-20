import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Connect, ConnectEventHandlers, ConnectOptions } from 'connect-web-sdk'; // Assuming this is the SDK import

const GetAccessToken = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [customerId, setCustomerId] = useState(localStorage.getItem("customerId"));
    const [link, setLink] = useState(null);
    const [accounts, setAccounts] = useState(localStorage.getItem("accounts"));

    const handleGetToken = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:8090/create-access-token');
            const parsedData = JSON.parse(response.data);
            const NewToken = parsedData.token;
            localStorage.setItem("token", NewToken);
            setToken(NewToken);
            alert('Token generated successfully!');
        } catch (error) {
            alert('Failed to generate token, please try again.');
            console.error('Error generating token:', error);
        }
        try {
            const response = await axios.post('http://localhost:8090/add-customer', {
                token: token
            });
            const customerId = response.data.id;
            localStorage.setItem("customerId", customerId);
            setCustomerId(customerId);
            alert('Customer ID fetched successfully!');
        } catch (error) {
            alert('Failed to fetch customer ID, please try again.');
            console.error('Error fetching customer ID:', error);
        }
        try {
            const response = await axios.post('http://localhost:8090/generate-link', {
                token: token,
                customerId: customerId
            });
            const link = response.data.link;
            localStorage.setItem("link", link);
            setLink(link);
            // Now launch the Mastercard Connect Web SDK with the generated link
            launchConnect(link);
        } catch (error) {
            alert('Failed to generate link, please try again.');
            console.error('Error generating link:', error);
        }
        try {
            const response = await axios.post('http://localhost:8090/get-accounts', {
                token: token,
                customerId: customerId,
                username: localStorage.getItem('username')
            });
            const data = response.data;
            localStorage.setItem("accountData", data);
        } catch (error) {
            alert('Failed to generate link, please try again.');
            console.error('Error generating link:', error);
        }
    };

    const handleGetCustomerId = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8090/add-customer', {
                token: token
            });
            const customerId = response.data.id;
            localStorage.setItem("customerId", customerId);
            setCustomerId(customerId);
            alert('Customer ID fetched successfully!');
        } catch (error) {
            alert('Failed to fetch customer ID, please try again.');
            console.error('Error fetching customer ID:', error);
        }
    };

    const handleGenerateLink = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8090/generate-link', {
                token: token,
                customerId: customerId
            });
            const link = response.data.link;
            localStorage.setItem("link", link);
            setLink(link);
            // Now launch the Mastercard Connect Web SDK with the generated link
            launchConnect(link);
        } catch (error) {
            alert('Failed to generate link, please try again.');
            console.error('Error generating link:', error);
        }
        try {
            const response = await axios.post('http://localhost:8090/get-accounts', {
                token: token,
                customerId: customerId
            });
            const data = response.data;
            localStorage.setItem("accountData", data);
        } catch (error) {
            alert('Failed to generate link, please try again.');
            console.error('Error generating link:', error);
        }
    };

    const launchConnect = (connectURL) => {
        const connectEventHandlers = {
            onDone: (event) => { console.log('Done:', event); },
            onCancel: (event) => { console.log('Cancelled:', event); },
            onError: (event) => { console.error('Error:', event); },
            onRoute: (event) => { console.log('Route change:', event); },
            onUser: (event) => { console.log('User info:', event); },
            onLoad: () => { console.log('Connect loaded'); }
        };

        const connectOptions = {
            popup: true,  // Use popup mode
            popupOptions: {
                width: 600,
                height: 600,
                top: window.top.outerHeight / 2 + window.top.screenY - (600 / 2),
                left: window.top.outerWidth / 2 + window.top.screenX - (600 / 2)
            },
            redirectUrl: 'http://localhost:3000',  // Set the redirect URL when the user is done
        };

        // Launch the Connect SDK with the generated link
        Connect.launch(connectURL, connectEventHandlers, connectOptions);
    };

    const handleAccountDetails = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8090/refresh-accounts', {
                token: token,
                customerId: customerId
            });
            const accounts = response.data.accounts;
            localStorage.setItem("accounts", accounts);
            setAccounts(accounts);
        } catch (error) {
            alert('Failed to fetch account details, please try again.');
            console.error('Error fetching account details:', error);
        }
    };
    const handleGetAccounts = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8090/get-accounts', {
                token: token,
                customerId: customerId
            });
            const data = response.data;
            localStorage.setItem("accountData", data);
        } catch (error) {
            alert('Failed to generate link, please try again.');
            console.error('Error generating link:', error);
        }
    };
    // Clean up the Connect SDK when the component unmounts
    useEffect(() => {
        return () => {
            Connect.destroy();
        };
    }, []);

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50'>
            <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">Get Access Token</h2>
                    <p>Token: {token || "No token yet"}</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleGetToken}
                    >
                        Click Here
                    </button>
                </div>
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">Get Customer ID</h2>
                    <p>Customer ID: {customerId || "No token yet"}</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleGetCustomerId}
                    >
                        Click Here
                    </button>
                </div>
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">Generate Link</h2>
                    <p>Generate Link to Connect Your Bank Account</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleGenerateLink}
                    >
                        Click Here
                    </button>
                </div>
                <div className="text-center mb-6">
                    <h2 className="text-4xl font-bold">Get Account Details</h2>
                    <p>Get Account Details</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={handleGetAccounts}
                    >
                        Click Here
                    </button>
                </div>
            </div>
        </div>
    );
}

export default GetAccessToken;
