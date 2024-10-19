import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaEnvelope, FaMapMarkerAlt, FaTwitter, FaGithub } from 'react-icons/fa';
import NotAuthorizedPage from './NotAuthorizedPage';

const Profile = () => {
    const { userid } = useParams();
    const loggedInuserid = localStorage.getItem("userid");
    const username = localStorage.getItem("username");
    const navigate = useNavigate();
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userProfile, setUserProfile] = useState(null); // Store the profile data here
    const [error, setError] = useState('');

    useEffect(() => {
        if (loggedInuserid && loggedInuserid === userid) {
            setIsLoggedIn(true);
            fetchProfileData();
        } else {
            setIsLoggedIn(false);
        }
    }, [userid, loggedInuserid]);

    const fetchProfileData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/get-profile/${userid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile. Please try again.');
            }

            const data = await response.json();
            console.log(data.data)
            setUserProfile(data.data[0]); // Set the fetched data
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const onLogout = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("userid");
        alert('Successfully logged out');
        navigate("/login");
    };
    async function getLocationInfo(latitude, longitude) {
        try {
            const response = await fetch(`http://localhost:8080/api/location?latitude=${latitude}&longitude=${longitude}`);
            const data = await response.json();

            if (response.ok) {
                setLocation(data.location);
            } else {
                seterrorLocationMessage(data.error || "Failed to get location info.");
            }
        } catch (error) {
            seterrorLocationMessage("An error occurred while fetching location data.");
        }
    }
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    function success(pos) {
        const crd = pos.coords;
        getLocationInfo(crd.latitude, crd.longitude);
    }

    function errors(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        seterrorLocationMessage("Failed to get your location.");
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result) => {
                    if (result.state === "granted" || result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(success, errors, options);
                    } else if (result.state === "denied") {
                        seterrorLocationMessage("Location access denied. Please enable location.");
                    }
                });
        } else {
            seterrorLocationMessage("Geolocation is not supported by your browser.");
        }
    }, []);
    if (isLoading) {
        return <p className='text-2xl font-bold text-center'>Loading...</p>;
    }

    if (error) {
        return <p className='text-2xl font-bold text-center'>{error}</p>;
    }

    // If userProfile exists, render the profile page
    return (
        <div>
            {isLoggedIn ? (
                <div className="flex justify-center items-top pt-10 min-h-screen bg-gray-100">
                    <div className="text-lg p-6 rounded-lg min-h-1/2 w-1/2 text-center">
                        <div className="mb-4">
                            <FaUserCircle className="text-gray-300 mx-auto text-[150px]" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800">{userProfile.username}</h2>

                        <div className="flex items-center justify-center mt-4 text-gray-500">
                            <FaMapMarkerAlt className="mr-2" />
                            <span>{location}</span>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-center text-gray-500">
                                <FaEnvelope className="mr-2" />
                                <a href={`mailto:${userProfile.email}`} className="hover:text-blue-500">
                                    {userProfile.email}
                                </a>
                            </div>
                        </div>

                    
                        <form className="pt-5" onSubmit={onLogout}>
                            <button type="submit" className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700">
                                Log Out
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <NotAuthorizedPage />
            )}
        </div>
    );
};

export default Profile;
