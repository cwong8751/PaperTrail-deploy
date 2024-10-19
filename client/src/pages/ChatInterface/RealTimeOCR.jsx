import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';
import Tesseract from 'tesseract.js';
import { Link } from 'react-router-dom';

const RealTimeOCR = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAutomatic, setIsAutomatic] = useState(false); // Mode state (manual or automatic)
  const [intervalTime, setIntervalTime] = useState(5); // Default interval time in seconds
  const [intervalId, setIntervalId] = useState(null); // To manage auto capture interval
  const currentTime = new Date().toLocaleDateString();

  // Capture an image from the webcam
  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  // Perform OCR using Tesseract.js
  const performOCR = async (image) => {
    setLoading(true);
    try {
      const { data: { text } } = await Tesseract.recognize(image, 'eng', {
        logger: (m) => console.log(m), // Log OCR progress
      });
      setOcrText(text);
    } catch (error) {
      console.error('Error during OCR: ', error);
      setOcrText('Failed to read the text. Please try again.');
    }
    setLoading(false);
  };

  // When the image is captured, run OCR
  useEffect(() => {
    if (capturedImage) {
      performOCR(capturedImage);
    }
  }, [capturedImage]);

  // Toggle between manual and automatic mode
  const handleModeChange = () => {
    setIsAutomatic(!isAutomatic); // Toggle the mode
    if (isAutomatic) {
      // Stop automatic capture
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  };

  // Set the interval time for automatic mode
  const handleIntervalChange = (e) => {
    setIntervalTime(e.target.value);
  };

  // Start automatic capturing with a set interval
  useEffect(() => {
    if (isAutomatic && !intervalId) {
      const id = setInterval(() => {
        captureImage();
      }, intervalTime * 1000); // Convert seconds to milliseconds
      setIntervalId(id);
    }

    return () => {
      // Clear interval on component unmount or when mode changes
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    };
  }, [isAutomatic, intervalTime]);

  return (
    <div className="h-screen flex flex-col items-center">
      {/* Header section */}
      <div className="p-4 border-b border-gray-200 bg-gray-100 flex flex-row justify-between items-center w-full">
        <Link className="border border-gray-200 shadow-md hover:shadow-2xl p-2 inline-block" to="/">
          Return to Home
        </Link>
        <h2 className="text-xl">Real-Time Receipt OCR</h2>
        <p className="text-center"><strong>Last Capture:</strong> {currentTime}</p>
      </div>

      {/* Webcam feed */}
      <div className="relative mt-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="border rounded shadow-lg"
          width={640}
          height={480}
        />
      </div>

      {/* Mode selection and Interval input */}
      <div className="mt-4 flex flex-col items-center">
        <div className="flex items-center">
          <label className="mr-4">
            <input
              type="radio"
              name="mode"
              checked={!isAutomatic}
              onChange={handleModeChange}
            />
            Manual Mode
          </label>
          <label>
            <input
              type="radio"
              name="mode"
              checked={isAutomatic}
              onChange={handleModeChange}
            />
            Automatic Mode
          </label>
        </div>

        {isAutomatic && (
          <div className="mt-4">
            <label>
              Capture Interval (seconds):
              <input
                type="number"
                value={intervalTime}
                onChange={handleIntervalChange}
                className="border p-2 ml-2"
                min="1"
              />
            </label>
          </div>
        )}

        {!isAutomatic && (
          <button
            onClick={captureImage}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Capture and Extract Text
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && <p className="mt-4">Processing image, please wait...</p>}

      {/* Display recognized text */}
      {ocrText && (
        <div className="mt-4 p-4 border rounded bg-gray-100 max-w-2xl">
          <h3 className="text-lg font-semibold">Recognized Text:</h3>
          <p>{ocrText}</p>
        </div>
      )}
    </div>
  );
};

export default RealTimeOCR;
