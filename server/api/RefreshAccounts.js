import axios from "axios";
export async function RefreshAccounts(req, res) {
    const { token, customerId } = req.body
    let data = JSON.stringify({});

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://api.finicity.com/aggregation/v1/customers/${customerId}/accounts`,
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
            return { error: "something is wrong" }
        });

}