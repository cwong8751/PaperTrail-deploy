// Get elements from the DOM
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const context = canvas.getContext('2d');

// Request access to the camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    // Set the video source to the camera stream
    video.srcObject = stream;
  })
  .catch((err) => {
    console.error("Error accessing camera: ", err);
  });

// Capture the image when the button is clicked
captureButton.addEventListener('click', () => {
  // Draw the current frame from the video onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get the image data from the canvas as a data URL
  const imageData = canvas.toDataURL('image/png');
  
  // Now you can use the imageData variable (it's a base64 encoded image)
  console.log("Captured image data:", imageData);

  testRequest("Decipher an image"); // send test request 
});


async function testRequest(input) {
    const apiKey = "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";
    const url = "https://api.openai.com/v1/chat/completions";
    
    const data = {
        model: 'gpt-4o',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful assistant.'
            },
            {
                role: 'user',
                content: input
            }
        ]
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(data) 
    });

    if (!response.ok) {
        throw new Error('Error communicating with OpenAI: ' + response.statusText);
    }

    const result = await response.json();
    console.log('ChatGPT Response:', result.choices[0].message.content);
}