import React from 'react';
import { Link } from 'react-router-dom';

const LearnMore = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="fixed top-0 z-50 w-full p-4 border-b  bg-white flex justify-start items-center space-x-4 shadow-md">
                <Link className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all" to="/">
                    Return to Home
                </Link>
            </div>
            {/* Header Section */}
            <div className="bg-blue-500 text-white text-center py-16">
                <h1 className="text-5xl font-bold mb-4">Discover the Power of Digitalized Receipts</h1>
                <p className="text-lg max-w-2xl mx-auto">
                    Digital receipts provide a seamless, eco-friendly way to track and manage your purchases. Embrace the future of paperless transactions today.
                </p>
                <Link
                    to="/product"
                    className="mt-6 inline-block bg-green-500 text-white rounded-full px-8 py-4 text-lg font-semibold hover:bg-green-600 transition-all"
                >
                    Get Started Now
                </Link>
            </div>

            {/* Benefits Section */}
            <section className="py-20 bg-white text-center">
                <h2 className="text-4xl font-semibold mb-8">Why Go Digital?</h2>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Eco-Friendly</h3>
                        <p className="text-gray-600">
                            Say goodbye to paper clutter and help reduce waste. Digital receipts contribute to a more sustainable and greener environment.
                        </p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Easy Organization</h3>
                        <p className="text-gray-600">
                            Organize all your receipts in one place. No more digging through emails or paper stacks—everything is easily accessible in your digital wallet.
                        </p>
                    </div>
                    <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Track Spending</h3>
                        <p className="text-gray-600">
                            Monitor your spending habits and keep a clear overview of your expenses with detailed reports and analytics, generated automatically.
                        </p>
                    </div>
                </div>
            </section>

            {/* Use Cases Section */}
            <section className="py-20 bg-gray-100 text-center">
                <h2 className="text-4xl font-semibold mb-8">Real-Life Applications</h2>
                <div className="max-w-5xl mx-auto space-y-8">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2">

                        </div>
                        <div className="md:w-1/2 md:pl-8">
                            <h3 className="text-2xl font-bold mb-4">Expense Management</h3>
                            <p className="text-gray-600">
                                Digital receipts allow you to manage your expenses with ease. Sync your purchases, categorize them, and generate reports for personal finance or business use.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row-reverse items-center">
                        <div className="md:w-1/2">

                        </div>
                        <div className="md:w-1/2 md:pr-8">
                            <h3 className="text-2xl font-bold mb-4">Tax Preparation</h3>
                            <p className="text-gray-600">
                                Come tax season, digital receipts help you stay organized and ensure you don’t miss any deductible expenses. Export your receipts and simplify your tax filing.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-1/2">

                        </div>
                        <div className="md:w-1/2 md:pl-8">
                            <h3 className="text-2xl font-bold mb-4">Warranty Tracking</h3>
                            <p className="text-gray-600">
                                Never lose a warranty again. Digital receipts make it easy to keep track of purchases and warranties, so you know exactly when your products are covered.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-blue-500 text-white text-center">
                <h2 className="text-4xl font-semibold mb-6">Transform the Way You Manage Receipts</h2>
                <p className="text-lg mb-8 max-w-2xl mx-auto">
                    Whether for personal use or business management, digital receipts are the next step in organizing and automating your finances.
                </p>
                <Link
                    to="/signup"
                    className="bg-green-500 text-white rounded-full px-8 py-4 text-lg font-semibold hover:bg-green-600 transition-all"
                >
                    Start Your Finance Management Today
                </Link>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-6 text-center">
                <p className="text-sm">&copy; 2024 Your Company. All rights reserved.</p>
                <div className="flex justify-center space-x-4 mt-4">
                    <Link to="/about" className="hover:underline">About Us</Link>
                    <Link to="/support" className="hover:underline">Support</Link>
                    <Link to="/terms" className="hover:underline">Terms of Service</Link>
                </div>
            </footer>
        </div>
    );
};

export default LearnMore;
