const axios = require('axios');

// Function to convert date to Unix timestamp
function convertToUnix(dateString) {
    return Math.floor(new Date(dateString).getTime() / 1000);
}

// Set API variables
const baseUrl = 'https://api.finicity.com';
const customerId = '7033714844'; // Replace with actual customerId
const accountId = '7059346278'; // Replace with actual accountId
const accessToken = 'YOUR_ACCESS_TOKEN'; // Replace with your access token

// Define fromDate and toDate (example: from January 1, 2022 to current date)
const fromDate = 1000000000
const toDate = Math.floor(Date.now() / 1000); // Current date

// Make the API call
async function getTransactions() {
    try {
        const response = await axios.get(
            `${baseUrl}/aggregation/v4/customers/${customerId}/accounts/${accountId}/transactions`,
            {
                headers: {
                    'Finicity-App-Key': 'c8d9b6238bb579c4305877e604b0180e',
                    'Content-Type': 'application/json',
                    'Finicity-App-Token': 'FV9xpSG60MRHCpa6XH4E'
                },
                params: {
                    fromDate: 1000000000,
                    toDate: 1665309262,
                    includePending: true, // Toggle to true or false as needed
                },
            }
        );

        const transactions = response.data.transactions;

        if (transactions.length === 0) {
            console.log('No transactions found for the given date range.');
        } else {
            console.log('Transactions:', transactions);
        }
    } catch (error) {
        console.error('Error fetching transactions:', error.response ? error.response.data : error.message);
    }
}




// Fetch Access Token
async function CreateAccessToken() {
    let data = JSON.stringify({
        "partnerId": "2445584660661",
        "partnerSecret": "c06ndfJ5RO1JZqEKBKVz"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.finicity.com/aggregation/v2/partners/authentication',
        headers: {
            'Content-Type': 'application/json',
            'Finicity-App-Key': "c8d9b6238bb579c4305877e604b0180e",
            'Accept': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log("hello access token")
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}


async function AddCustomer(token) {
    let data = JSON.stringify({
        "username": "customer_1729382472",
        "firstName": "John",
        "lastName": "Smith"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.finicity.com/aggregation/v2/customers/testing',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Finicity-App-Key': 'c8d9b6238bb579c4305877e604b0180e',
            'Finicity-App-Token': token
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log("hello add customer")
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}

async function GenerateLink(token, customerId) {
    let data = JSON.stringify({
        "partnerId": "2445584660661",
        "customerId": `${customerId}`,
        "language": "en",
        "consumerId": "0bf46322c167b562e6cbed9d40e19a4c",
        "redirectUri": "https://www.finicity.com/connect/",
        "webhookContentType": "application/json",
        "webhookData": {},
        "webhookHeaders": {},
        "optionalConsumerInfo": {
            "ssn": "999999999",
            "dob": 1607450357
        },
        "singleUseUrl": true,
        "institutionSettings": {},
        "fromDate": 1607450357,
        "reportCustomFields": [
            {
                "label": "loanID",
                "value": "123456",
                "shown": true
            },
            {
                "label": "loanID",
                "value": "123456",
                "shown": true
            }
        ]
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.finicity.com/connect/v2/generate',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Finicity-App-Token': token,
            'Finicity-App-Key': 'c8d9b6238bb579c4305877e604b0180e'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log("hello generate Link")
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });
}


async function RefreshAccounts(token) {
    let data = JSON.stringify({});

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.finicity.com/aggregation/v1/customers/{{customerId}}/accounts',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Finicity-App-Token': token,
            'Finicity-App-Key': 'c8d9b6238bb579c4305877e604b0180e'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
        });

}
async function main() {
    try {
        const token = await CreateAccessToken();  // Wait for token to be created
        
        // Step 2: Add customer using the access token
        if (token) {
            const finalData = await AddCustomer(token); 
            console.log(finalData)
        }
    } catch (error) {
        console.error('Error in main function:', error.message);
    }
}
// Call the main function to execute the flow
main();