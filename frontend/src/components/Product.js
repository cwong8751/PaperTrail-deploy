import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ProductPage = () => {
    const [messages, setMessages] = useState([{ text: 'Welcome! How can I assist you today?', sender: 'AI' }]);
    const [inputMessage, setInputMessage] = useState('');
    const [uploadedImage, setUploadedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    // confirmation dialog operations
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
    const openConfirmationPopup = () => setIsConfirmationOpen(true);
    const closeConfirmationPopup = () => setIsConfirmationOpen(false);

    // transaction date and amount
    const [transactionDate, setTransactionDate] = useState('');
    const [transactionAmount, setTransactionAmount] = useState(0);

    // no receipt found popup operations
    const [isOpen, setIsOpen] = useState(false);
    const openPopup = () => setIsOpen(true);
    const closePopup = () => setIsOpen(false);

    // set progress bar
    const [loading, setLoading] = useState(false);

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

    // chat request code
    const makeRequest = async (input) => {
        setLoading(true);

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
                            text: "look at the image, and return a json string with the following information: result, transaction_time and transaction_amount. If no receipt is found or you cannot analyze the image, result should have the value of fail. if receipt is found, result should have the value ok, transaction_date should be in epoch time, transaction_amount should be transaction amount with digits only, no dollar signs, and in a float format, not string. Only return a json string in all cases, and nothing else.",
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: input
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

        setLoading(false);

        return message;
    };

    // Capture image from video stream
    const captureImage = async () => {
        const videoElement = document.getElementById('video');
        const canvasElement = document.getElementById('canvas');
        const context = canvasElement.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const imageData = canvasElement.toDataURL('image/png');
        //setImagePreview(imageData);  // You can display this as an image or send it to a server

        var message = await makeRequest(imageData);

        // message format
        //console.log(message);

        // parse message 
        var parsedMessage = message.replace(/```json/g, '').replace(/```/g, '');
        console.log(parsedMessage);

        parsedMessage = JSON.parse(parsedMessage);
        if (parsedMessage.result === 'ok') {
            const transactionDate = parsedMessage.transaction_time;
            const transactionAmount = parsedMessage.transaction_amount;


            // cleanse transactiondate and transaction amount
            let tDate = new Date(transactionDate * 1000).toISOString().slice(0, 16)
            let tAmount = parseFloat(transactionAmount);

            //let tAmount = parseFloat(transactionAmount.replace(/[$,]/g, ''));

            // set state variables
            setTransactionDate(tDate);
            setTransactionAmount(tAmount);

            // popup confirmation dialog 
            openConfirmationPopup();

            //TODO: do whatever to the transaction date and amount
            console.log(`Transaction Date: ${transactionDate}, Transaction Amount: ${transactionAmount}`);
        } else {
            openPopup(); // open error popup 
            console.log('No valid receipt found.');
        }

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

    // Helper function to convert image file to Base64 string
    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    // Handle image submit
    const handleImageSubmit = async () => {
        if (!uploadedImage) {
            setErrorMessage('Please upload an image first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', uploadedImage);

        try {
            // Convert uploaded image to base64 string
            const base64Image = await toBase64(uploadedImage);

            // make request to chat gpt 
            var message = await makeRequest(base64Image);

            var parsedMessage = message.replace(/```json/g, '').replace(/```/g, '');
            console.log(parsedMessage);

            parsedMessage = JSON.parse(parsedMessage);
            if (parsedMessage.result === 'ok') {
                const transactionDate = parsedMessage.transaction_time;
                const transactionAmount = parsedMessage.transaction_amount;

                console.log(`Transaction Date: ${transactionDate}, Transaction Amount: ${transactionAmount}`);


                // cleanse transactiondate and transaction amount
                let tDate = new Date(transactionDate * 1000).toISOString().slice(0, 16)
                let tAmount = parseFloat(transactionAmount);

                // PROBLEM WITH tAmount
                // Some times chat gpt returns transaction_amount as a string with $ sign in front
                // Some times it is a number depending on the image inputted. Prompt has been changed, 
                // hence the line below is commented out.
                // let tAmount = parseFloat(transactionAmount.replace(/[$,]/g, ''));

                // set state variables
                setTransactionDate(tDate);
                setTransactionAmount(tAmount);

                // popup confirmation dialog 
                openConfirmationPopup();
            } else {
                openPopup(); // open error popup 
                console.log('No valid receipt found.');
            }
        } catch (error) {
            setErrorMessage('Failed to upload image, please try again.');
            console.error('Error uploading image:', error);
        }
    };


    // error popup 
    const ErrorPopup = ({ isOpen, onClose }) => {
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                    <h2 className="text-lg font-semibold mb-4">Error</h2>
                    <p className="mb-4">We did not find any receipts</p>
                    <div className="flex justify-end">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    // progress circle modal
    const ProgressModal = ({ show, children }) => {
        if (!show) return null;
        return (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg">
                    {children}
                </div>
            </div>
        );
    };

    // final confirmation popup, do something with the transaction date and amount 
    const handleConfirmationPopupSubmit = (date, amount) => {
        // convert date back to epoch time
        let transactionDate = new Date(date).getTime() / 1000;
        let transactionAmount = amount;

        console.log(`THIS IS FINAL\nSubmitted Date: ${transactionDate}, Submitted Amount: ${transactionAmount}`);
        alert(`Submitted Date: ${transactionDate}, Submitted Amount: ${transactionAmount}`);

        //TODO: do something with the transaction date and amount
    };

    // confirmation popup
    const ConfirmationPopup = ({ isOpen, onClose, onSubmit }) => {
        if (!isOpen) return null;

        const handleSubmit = async () => {
            const date = document.getElementById('transactionDate').value;
            const amount = document.getElementById('transactionAmount').value;

            // handle submit callback 
            if (onSubmit) {
                onSubmit(date, amount);
            }

            // close the dialog 
            onClose();
        };

        return (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                    <h2 className="text-lg font-semibold mb-4">Transaction Confirmation</h2>
                    <p className='text-sm mb-4'>Please confirm the information below, we might make mistakes</p>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transactionDate">
                            Transaction Date
                        </label>
                        <input
                            type="datetime-local"
                            id="transactionDate"
                            value={transactionDate}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transactionAmount">
                            Transaction Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            id="transactionAmount"
                            value={transactionAmount}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded"
                            onClick={onClose}
                        >
                            Close
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-500 text-white rounded"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
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
            <ErrorPopup isOpen={isOpen} onClose={closePopup} />
            <ConfirmationPopup isOpen={isConfirmationOpen} onClose={closeConfirmationPopup} onSubmit={handleConfirmationPopupSubmit} />
            <ProgressModal show={loading}>
                <label className="block text-gray-700 text-sm font-bold mb-2">Looking at your receipt</label>
            </ProgressModal>
        </div>
    );
};

export default ProductPage;
