import axios from "axios"
export async function GetAccounts(req, res) {
    const { token, customerId, username} = req.body
    console.log("get accounts", token, customerId)
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.finicity.com/aggregation/v1/customers/${customerId}/accounts`,
        headers: {
            'Finicity-App-Key': process.env.APPKEY,
            'Accept': 'application/json',
            'Finicity-App-Token': token
        }
    };

    axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            res.send(JSON.stringify(response.data))
        })
        .catch((error) => {
            console.log(error);
            res.send({error: "something is wrong"})
        });

}