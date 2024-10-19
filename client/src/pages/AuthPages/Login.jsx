import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const userid = localStorage.getItem("userid");
    const [error, setError] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isLoggedIn = userid !== null && userid !== undefined && userid !== "";
    console.log(userid)
    async function onSubmit(event) {
        event.preventDefault();
        setIsLoading(true);
        setError(null);
        const lastLogin = new Date().toISOString(); // Current timestamp
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    lastLogin: lastLogin // Include lastLogin timestamp
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.');
            }

            const data = await response.json();
            if (data.success) {
                alert("Welcome Back, " + data.username + "!");
                localStorage.setItem("userid", data.userid);
                localStorage.setItem("username", data.username);
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
                    <h1>Login with an existing account. We are excited to see you back!</h1>
                    <form className='space-y-5' onSubmit={onSubmit}>
                        <h2>What is your username?</h2>
                        <input className='border border-gray-200 shadow-md hover:shadow-2xl' type="text" name="username" placeholder='username here' onChange={(e) => setUsername(e.target.value)} />
                        <h2>What is your password?</h2>
                        <input className='border border-gray-200 shadow-md hover:shadow-2xl' type="password" name="password" placeholder='password here' onChange={(e) => setPassword(e.target.value)} />
                        <br />
                        <button className='border border-gray-200 shadow-md hover:shadow-2xl p-2.5' type="submit" disabled={isLoading}>
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                </div>
            )}
        </div>
    );
}
