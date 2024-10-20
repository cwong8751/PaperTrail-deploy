import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FinanceManager = () => {

    // onload 
    useEffect(() => {

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
                <h2 className="text-xl font-semibold text-gray-700 mt-6">Your Receipts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <ReceiptNoteCard transactionDate="2021-08-01" transactionAmount={100.00} />
                    <ReceiptNoteCard transactionDate="2021-08-02" transactionAmount={200.00} />
                    <ReceiptNoteCard transactionDate="2021-08-03" transactionAmount={300.00} />
                    <ReceiptNoteCard transactionDate="2021-08-04" transactionAmount={400.00} />
                    <ReceiptNoteCard transactionDate="2021-08-05" transactionAmount={500.00} />
                    <ReceiptNoteCard transactionDate="2021-08-06" transactionAmount={600.00} />
                </div>
            </div>
        </div>
    );
};

// note card component 
const ReceiptNoteCard = ({ transactionDate, transactionAmount }) => {
    return (
        <div className="w-full h-full bg-white shadow-lg rounded-lg overflow-hidden p-6">
            <div className="p-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">{transactionDate}</h2>
                <p className="text-gray-600">Total: ${transactionAmount.toFixed(2)}</p>
            </div>
        </div>
    );
}

export default FinanceManager;
