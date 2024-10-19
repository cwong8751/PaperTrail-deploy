import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  const authenticated = localStorage.getItem("authToken") !== null
  console.log(authenticated)
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header with Login and Sign Up Buttons */}
      <div className="fixed top-0 z-50 w-full p-4 border-b  bg-white flex justify-end items-center space-x-4 shadow-md">
        {authenticated ? (
          <Link
            className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all"
            to="/product"
          >
            Product
          </Link>
        ) : (
          <>
            <Link
              className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all"
              to="/login"
            >
              Login
            </Link>
            <Link
              className="bg-green-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-green-600 transition-all"
              to="/signup"
            >
              Sign Up
            </Link>
          </>
        )}

      </div>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 text-white h-screen">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Platform</h1>
        <p className="text-lg mb-8 max-w-xl">
          Discover the power of connecting with people and managing your financial plans effortlessly. Join us to get access to features that will help you grow and achieve your goals.
        </p>
        <div className="space-x-4">
          <Link
            className="bg-blue-500 text-white rounded-full px-6 py-3 text-lg font-semibold hover:bg-blue-600 transition-all"
            to="/signup"
          >
            Get Started
          </Link>
          <Link
            className="bg-white text-blue-500 rounded-full px-6 py-3 text-lg font-semibold hover:bg-gray-100 transition-all"
            to="/learn-more"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-4xl font-semibold mb-8">Our Features</h2>
        <div className="flex justify-center space-x-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">Plan Your Finance</h3>
            <p className="text-gray-600">
              Organize your tasks and personal plans with ease. Stay on top of your schedule and never miss a deadline.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">Connect with Friends</h3>
            <p className="text-gray-600">
              Join a community of like-minded individuals. Share your achievements and grow together.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-2xl font-bold mb-4">Track Your Progress</h3>
            <p className="text-gray-600">
              Keep track of your goals and monitor your progress over time to achieve personal growth.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-blue-500 text-white text-center">
        <h2 className="text-4xl font-semibold mb-6">Join Us Today</h2>
        <p className="text-lg mb-8">
          Ready to take the next step? Sign up today and start exploring all the features we offer to help you succeed.
        </p>
        <Link
          className="bg-green-500 text-white rounded-full px-8 py-4 text-lg font-semibold hover:bg-green-600 transition-all"
          to="/signup"
        >
          Sign Up Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p className="text-sm">&copy; 2024 HackWashU2024. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
