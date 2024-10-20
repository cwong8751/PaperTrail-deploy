import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Histogram from './Histogram';
import dummyData from './dummyData.json';

const FinanceManager = () => {
    const [receipts, setReceipts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch receipts data for the logged-in user
    useEffect(() => {
        const fetchReceipts = async () => {
            const username = localStorage.getItem('username'); // Assuming username is stored in localStorage after login
            if (!username) {
                setErrorMessage('Please log in to view your receipts.');
                return;
            }

            try {
                const response = await axios.post('http://localhost:8090/getallreceipts', { username });
                setReceipts(response.data.receipts || []); // Set receipts data or an empty array
            } catch (error) {
                console.error('Error fetching receipts:', error);
                setErrorMessage('Failed to fetch receipts. Please try again later.');
            }
        };
        fetchReceipts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="fixed top-0 z-50 w-full p-4 border-b bg-white flex justify-start items-center space-x-4 shadow-md">
                <Link className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all" to="/">
                    Return to Home
                </Link>
                <Link className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all" to="/financemanager">
                    Finance Manager
                </Link>
            </div>

            <div className="container mx-auto p-4 pt-24">
                <h1 className="text-2xl font-semibold text-gray-800">Finance Manager</h1>

                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    
                <Histogram data={dummyData} />

                <h2 className="text-xl font-semibold text-gray-700 mt-6">Your Receipts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {receipts.length > 0 ? (
                        receipts.map((receipt, index) => (
                            <ReceiptNoteCard
                                key={index}
                                transactionDate={new Date(receipt.transactionDate).toLocaleDateString()} // Format the date
                                transactionAmount={receipt.transactionAmount}
                            />
                        ))
                    ) : (
                        <p>No receipts found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Note card component to display each receipt
const ReceiptNoteCard = ({ transactionDate, transactionAmount }) => {
    return (
        <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{transactionDate}</h2>
                <p className="text-gray-600">Total: ${transactionAmount.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default FinanceManager;