import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Histogram from './Histogram';
import dummyData from './dummyData.json'
const FinanceManager = () => {


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
            <div className='fixed bottom-5 left-1/2 transform -translate-x-1/2 items-center justify-center flex flex-col'>
                <Histogram data={dummyData} />
            </div>
        </div>
    );
};

export default FinanceManager;
