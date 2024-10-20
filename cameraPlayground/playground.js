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

  // get prompt from user
  var prompt = document.getElementById('prompt').value;

  if (prompt === "") {
      prompt = "look at the image, and return a json string with the following information: result, transaction_time and transaction_amount. If no receipt is found or you cannot analyze the image, result should have the value of fail. if receipt is found, result should have the value ok, transaction_date should be in epoch time, transaction_amount should be transaction amount with digits only, no dollar signs, and in a float format, not string. Only return a json string in all cases, and nothing else.";
  }

  testRequest(imageData, prompt); // send image data to API, image already in base64 format
});

document.addEventListener('DOMContentLoaded', () => {
    // display api key
    //document.getElementById('api-key').innerHTML = "API Key: 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";
});


async function testRequest(input, prompt) {
    const apiKey = "";
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
                        text: prompt,
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

    // check stupid
    if (input === "") {
        alert("I need image");
        return;
    }

    if(apiKey === "") {
        alert("I need API key");
        return;
    }

    if(prompt === "") {
        alert("I need prompt");
        return;
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

    document.getElementById('api-response').innerHTML = message;
    let oresult = document.getElementById('response-list').innerHTML;
    document.getElementById('response-list').innerHTML = oresult + "<li>" + "<b>" + prompt + "</b>" + message + "</li>";
}