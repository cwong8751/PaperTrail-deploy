import axios from "axios";

export async function GenerateLink(req, res) {
    const { token, customerId } = req.body
    let data = JSON.stringify({
        "partnerId": "2445584660427",
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
            'Finicity-App-Key': '014c38b1a3bf877792ce1a12a3a9bca9'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log("hello generate Link")
            const data = JSON.stringify(response.data)
            console.log(JSON.stringify(response.data));
            res.send(data)
        })
        .catch((error) => {
            console.log(error);
            res.send({ error: "something is wrong" })
        });
}
