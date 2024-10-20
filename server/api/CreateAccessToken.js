import axios from "axios";
export async function CreateAccessToken(req, res) {
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
            const result = JSON.stringify(response.data)
            console.log(result);
            res.json(result)
        })
        .catch((error) => {
            console.log(error);
            res.json({ error: "something is wrong" })
        });
}
