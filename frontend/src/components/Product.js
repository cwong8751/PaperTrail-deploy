import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductPage = () => {
    const [messages, setMessages] = useState([{ text: 'Welcome! How can I assist you today?', sender: 'AI' }]);
    const [inputMessage, setInputMessage] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // Start webcam stream
    useEffect(() => {
        const videoElement = document.getElementById('video');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then((stream) => {
                    videoElement.srcObject = stream;
                })
                .catch((error) => {
                    console.error("Error accessing webcam:", error);
                });
        }
    }, []);

    // Capture image from video stream
    const captureImage = async () => {
        const videoElement = document.getElementById('video');
        const canvasElement = document.getElementById('canvas');
        const context = canvasElement.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvasElement.toDataURL('image/png');
        setImagePreview(imageData);  // You can display this as an image or send it to a server

        const apiKey = "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";
        const url = "https://api.openai.com/v1/chat/completions";

        // request for image input
        const imgData = {
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: "text",
                            text: "Extract all information in receipt, if there is no receipt in the image, please let me know.",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: imageData
                            }
                        }
                    ]
                },
            ]
        }

        // request general 
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(imgData) // change to imgData for image input
        });


        if (!response.ok) {
            throw new Error('Error: ' + response.statusText);
        }

        const result = await response.json();
        const message = result.choices[0].message.content;


        // whatever to do with the message 
        alert(message);
    };

    // Handle sending a message
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

    // Handle file upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setUploadedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setErrorMessage('');
        }
    };

    // Handle image submit
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
            <div className="fixed top-0 z-50 w-full p-4 border-b bg-white flex justify-start items-center space-x-4 shadow-md">
                <Link className="bg-blue-500 text-white rounded-md px-4 py-2 shadow-md hover:bg-blue-600 transition-all" to="/">
                    Return to Home
                </Link>
            </div>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-5xl font-bold text-center mb-10">Explore Our Product's Functionality</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Camera Interface */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-3xl font-bold mb-6">Camera</h2>
                        <video id="video" width="640" height="480" autoPlay></video>
                        <canvas id="canvas" width="640" height="480" style={{ display: 'none' }}></canvas>
                        <button onClick={captureImage} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4">
                            Capture
                        </button>
                        {/* {imagePreview && <img src={imagePreview} alt="Captured" className="w-full h-56 object-contain rounded-md shadow-md mt-4" />} */}
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
