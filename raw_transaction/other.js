var axios = require('axios');
var data = JSON.stringify({
    "jsonrpc": "1.0",
    "id": "curltest",
    "method": "getwalletinfo",
    "params": []
});

var config = {
    method: 'post',
    url: 'http://localhost:18332/wallet/wallet_A',
    headers: {
        'Authorization': 'Basic dXNlcl9uYW1lOnlvdXJfcGFzc3dvcmQ=',
        'Content-Type': 'application/json'
    },
    data : data
};

// axios(config)
//     .then(function (response) {
//         console.log(JSON.stringify(response.data));
//     })
//     .catch(function (error) {
//         console.log(error);
//     });



const getBalance = async () => {
  try {
      let response = await axios(config);
      console.log(JSON.stringify(response.data))
    } catch(error) {
        console.log(error);
    }
}

getBalance();