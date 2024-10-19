import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token"); // Retrieve the token from localStorage
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    const isLoggedIn = token !== null && token !== undefined && token !== "";

    async function onSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8090/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    email: email,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to register. Please try again.');
            }

            const data = await response.json();
            if (data.token) {
                // Store the token and user info in localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("userid", data.userid);
                localStorage.setItem("username", data.username);
                alert("Registration successful, welcome " + data.username + "!");
                navigate("/");
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.message);
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="mspace-y-10 p-3 mt-[5vh] flex flex-col items-center justify-center overflow-hidden">
            {isLoggedIn ? (
                <div>
                    <Link className='border border-gray-200 shadow-md hover:shadow-2xl p-2.5' to="/">Return to Home</Link>
                    <h1 style={{ fontWeight: "bold", fontSize: "20px", marginTop: "20px", marginBottom: "20px" }}>You are already logged in!</h1>
                </div>
            ) : (
                <div className='pt-5 space-y-10 text-3xl font-bold p-20'>
                    <Link className='border border-gray-200 shadow-md hover:shadow-2xl p-2.5' to="/">Return to Home</Link>
                    <h1>Register an account below. We are excited to see you!</h1>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <form className='space-y-5' onSubmit={onSubmit}>
                        <h2>What is your username?</h2>
                        <input className='border border-gray-200 shadow-md hover:shadow-2xl' type="text" name="username" placeholder='username here' onChange={(e) => setUsername(e.target.value)} required />
                        <h2>What is your password?</h2>
                        <input className='border border-gray-200 shadow-md hover:shadow-2xl' type="password" name="password" placeholder='password here' onChange={(e) => setPassword(e.target.value)} required />
                        <h2>What is your email?</h2>
                        <input className='border border-gray-200 shadow-md hover:shadow-2xl' type="email" name="email" placeholder='email here' onChange={(e) => setEmail(e.target.value)} required />
                        <br />
                        <button className='border border-gray-200 shadow-md hover:shadow-2xl p-2.5' type="submit" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
