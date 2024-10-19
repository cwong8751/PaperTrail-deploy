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
  //console.log("Captured image data:", imageData);

  //testRequest("Decipher this image: "); // send test request 
  testRequest(imageData); // send image data to API
});


async function testRequest(input) {
    const apiKey = "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";
    const url = "https://api.openai.com/v1/chat/completions";
    

    // request for image input
    const imgData =  {
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
                            url: input
                        }
                    }
                ]
            },
        ]
    }

    // request for text input 
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

    //console.log('ChatGPT Response:', message);

    document.getElementById('api-response').innerHTML = message;
}