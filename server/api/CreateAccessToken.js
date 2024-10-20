import axios from "axios";
export async function CreateAccessToken(req, res) {
    let data = JSON.stringify({
        "partnerId": "2445584660427",
        "partnerSecret": "fhnzOlv9cOcQT2yQYLYz"
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.finicity.com/aggregation/v2/partners/authentication',
        headers: {
            'Content-Type': 'application/json',
            'Finicity-App-Key': "014c38b1a3bf877792ce1a12a3a9bca9",
            'Accept': 'application/json'
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log("hello access token")
            const result = JSON.stringify(response.data)
            console.log(result);
            res.json(result)
        })
        .catch((error) => {
            console.log(error);
            res.json({ error: "something is wrong" })
        });
}
