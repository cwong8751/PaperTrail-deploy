import axios from "axios";
export async function RefreshAccounts(req, res) {
    const {token, customerId} = req.body
    let data = JSON.stringify({});

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.finicity.com/aggregation/v1/customers/${customerId}/accounts`,
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
            console.log(JSON.stringify(response.data));
        })
        .catch((error) => {
            console.log(error);
            return {error: "something is wrong"}
        });

}