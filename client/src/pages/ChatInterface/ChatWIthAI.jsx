import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ChatInterface = ({ Darkmode }) => {
    const { userid } = useParams();
    const [today, setToday] = useState("09/28/2024");
    const handleToday = (newToday) => { setToday(newToday) };
    const currentTime = new Date().toLocaleDateString();
    
    // Chat-related states
    const [messages, setMessages] = useState([{ text: "Welcome! Ask me anything.", sender: "AI" }]);
    const [inputMessage, setInputMessage] = useState("");
    const [file, setFile] = useState(null);
    const messagesEndRef = useRef(null);

    // Handle sending a message
    const sendMessage = async () => {
        if (!inputMessage && !file) return;
        setInputMessage("");
        
        let newMessages = [...messages, { text: inputMessage, sender: "User" }];

        if (file) {
            const fileURL = URL.createObjectURL(file);
            newMessages.push({ file: fileURL, sender: "User" });
            setFile(null); // Clear the file after sending
        }

        setMessages(newMessages);

        try {
            // Sending message and file to the backend (update this URL accordingly)
            const formData = new FormData();
            formData.append('prompt', inputMessage);
            if (file) {
                formData.append('file', file);
            }

            const response = await fetch('http://localhost:8090/ask-ai', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            // Update chat with AI's response
            setMessages([...newMessages, { text: data.response, sender: "AI" }]);
        } catch (error) {
            // Handle any errors
            setMessages([...newMessages, { text: "Sorry, something went wrong.", sender: "AI" }]);
        } finally {
            setInputMessage("");
            setFile(null); // Clear file input after submission
        }

        // Scroll to the bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle file upload
    const handleFileUpload = (e) => {
        setFile(e.target.files[0]);
    };

    // Auto scroll to the bottom when a new message is added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className={`h-screen flex flex-col ${Darkmode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            {/* Header section with the "Return to Home" button */}
            <div className="p-4 border-b border-gray-200 bg-gray-100 flex flex-row justify-between items-center">
                <Link className="border border-gray-200 shadow-md hover:shadow-2xl p-2 inline-block" to="/">
                    Return to Home
                </Link>
                <p className="text-center"><strong>Last Chatting:</strong> {currentTime}</p>
            </div>

            {/* Message history */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className={`text-xl ${message.sender === "AI" ? "text-blue-500" : "text-green-500"} break-words whitespace-normal`}>
                        <strong>{message.sender}:</strong> {message.text || ""}
                        {message.file && <img src={message.file} alt="Uploaded file" className="mt-2 max-w-xs"/>}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input field and file upload */}
            <div className="p-4 border-t border-gray-200 bg-gray-100 flex flex-col">
                <div className="flex">
                    <input
                        type="text"
                        className="flex-grow border rounded p-2 mr-2"
                        placeholder="Type your question..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' ? sendMessage() : null}
                    />
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={sendMessage}>
                        Send
                    </button>
                </div>
                <div className="mt-4">
                    <input
                        type="file"
                        className="border rounded p-2"
                        onChange={handleFileUpload}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
