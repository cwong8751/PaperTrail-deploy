import axios from "axios";
export async function AddCustomer(req, res) {
    const { token } = req.body
    const timestamp = new Date().getTime()
    console.log("add customer right now, ", token)
    let data = JSON.stringify({
        "username": timestamp,
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
            'Finicity-App-Key': '014c38b1a3bf877792ce1a12a3a9bca9',
            'Finicity-App-Token': token
        },
        data: data
    };

    axios.request(config)
        .then((response) => {
            console.log("hello add customer")
            const data = JSON.stringify(response.data)
            console.log(JSON.stringify(response.data));
            res.send(data)
        })
        .catch((error) => {
            console.log(error);
            res.send({ error: "something is wrong" })
        });
}
