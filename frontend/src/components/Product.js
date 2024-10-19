import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const ProductPage = () => {
    const [messages, setMessages] = useState([{ text: 'Welcome! How can I assist you today?', sender: 'AI' }]);
    const [inputMessage, setInputMessage] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Function to handle sending a message
    const handleSendMessage = async () => {
        if (!inputMessage) return;

        setMessages((prev) => [...prev, { text: inputMessage, sender: 'User' }]);
        setInputMessage('');

        try {
            const response = await axios.post('http://localhost:8090/chat', { prompt: inputMessage });
            setMessages((prev) => [...prev, { text: response.data.response, sender: 'AI' }]);
        } catch (error) {
            setMessages((prev) => [...prev, { text: 'Something went wrong, please try again.', sender: 'AI' }]);
        }
    };

    // Function to handle file upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setErrorMessage('');
        }
    };

    // Function to handle image submit
    const handleImageSubmit = async () => {
        if (!uploadedImage) {
            setErrorMessage('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedImage);

        try {
            const response = await axios.post('http://localhost:8090/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Image uploaded successfully!');
        } catch (error) {
            setErrorMessage('Failed to upload image, please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="fixed top-0 z-50 w-full p-4 border-b  bg-white flex justify-start items-center space-x-4 shadow-md">
                <Link className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all" to="/">
                    Return to Home
                </Link>
            </div>
            <div className="max-w-7xl mx-auto">
                {/* Page Title */}
                <h1 className="text-5xl font-bold text-center mb-10">Explore Our Product's Functionality</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Chat Interface */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-6">Chat with our AI</h2>
                        <div className="h-96 overflow-y-auto bg-gray-100 p-4 rounded-md mb-4">
                            {messages.map((message, index) => (
                                <div key={index} className={`mb-4 ${message.sender === 'AI' ? 'text-blue-500' : 'text-green-500'}`}>
                                    <strong>{message.sender}:</strong> {message.text}
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                placeholder="Type your message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                className="flex-grow px-4 py-2 border rounded-md"
                            />
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            >
                                Send
                            </button>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-6">Upload Images</h2>
                        <div className="mb-4">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-56 object-contain rounded-md shadow-md" />
                            ) : (
                                <div className="w-full h-56 bg-gray-100 flex items-center justify-center text-gray-500 rounded-md">
                                    Image preview will appear here.
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            className="w-full px-4 py-2 border rounded-md mb-4"
                            accept="image/*"
                        />
                        <button
                            onClick={handleImageSubmit}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                        >
                            Upload Image
                        </button>
                        {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
