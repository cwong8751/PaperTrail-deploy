import axios from "axios";
export async function GetTransactions(req, res) {
    const {token, customerId, accountId, fromDate, toDate} = req.body
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.finicity.com/aggregation/v4/customers/${customerId}/accounts/${accountId}/transactions?fromDate=${fromDate}&includePending=true&toDate=${toDate}`,
        headers: { 
          'Finicity-App-Key': '014c38b1a3bf877792ce1a12a3a9bca9', 
          'Accept': 'application/json', 
          'Finicity-App-Token': token
        }
      };
      
      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        const data = JSON.stringify(response.data)
        res.send(data)
      })
      .catch((error) => {
        console.log(error);
        res.send({error: "something is wrong"})
      });
}

