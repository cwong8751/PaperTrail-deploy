import axios from "axios";

export async function GenerateLink(req, res) {
    const { token, customerId } = req.body
    console.log("generate link right now, ", token, customerId)
    let data = JSON.stringify({
        "partnerId": "2445584660661",
        "customerId": `${customerId}`,
        "consumerId": "0bf46322c167b562e6cbed9d40e19a4c",
        "redirectUri": "https://google.com/",
        "webhookData": {},
        "webhookHeaders": {},
        "optionalConsumerInfo": {
            "ssn": "999999999",
            "dob": 1607450357
        },
        "singleUseUrl": true,
        "institutionSettings": {},
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
            const data = JSON.stringify(response.data)
            console.log(JSON.stringify(response.data));
            res.send(data)
        })
        .catch((error) => {
            console.log(error);
            res.send({ error: "something is wrong" })
        });
}
