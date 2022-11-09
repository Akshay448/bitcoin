// const axios = require('axios')
// const url = 'http://checkip.amazonaws.com/';
// import {network, url} from "./blockchain_networks/btc/btc_constants.js";
import axios from "axios";

let response;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
export const lambdaHandler = async (event, context) => {
    try {
        let ans = await getWallet();
        // response = {
        //     'statusCode': 200,
        //     'body': JSON.stringify({
        //         message: 'hello btc',
        //         wallet: ans
        //         location: ret.data.trim()
            // })
        // }
        response = formatResponse(ans);
    } catch (err) {
        console.log(err);
        formatError(err);
    }

    return response
};


const formatResponse = function (body) {
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "isBase64Encoded": false,
        "multiValueHeaders": {
            "X-Custom-Header": ["My value", "My other value"],
        },
        "body": body
    }
};

const formatError = function (error) {
    return {
        "statusCode": error.statusCode,
        "headers": {
            "Content-Type": "text/plain",
            "x-amzn-ErrorType": error.code
        },
        "isBase64Encoded": false,
        "body": error.code + ": " + error.message
    }
};


const getBalance = async(address) => {
    let resp;
    let request_url = 'https://chain.so/api/v2/get_address_balance/BTCTEST/' + address;
    try {
        resp = await axios.get(request_url);
    } catch (err) {
        console.error(err);
        resp = err;
    }
    return resp;
}

const getWallet = async() => {
    // var axios = require('axios');
    var data = JSON.stringify({
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": "getwalletinfo",
        "params": []
    });

    var config = {
        method: 'post',
        url: 'http://docker.for.mac.localhost:18332/wallet/wallet_A',
        headers: {
            'Authorization': 'Basic dXNlcl9uYW1lOnlvdXJfcGFzc3dvcmQ=',
            'Content-Type': 'application/json'
        },
        data : data
    };

    try {
        let response = await axios(config);
        return response.data;
    } catch(error) {
        console.log(error);
    }

}

/**
 * 1. Wallet methods
 * create wallet
 * getwallet
 * getbalance
 * getnewaddress
 * gettransaction
 * getwalletinfo
 * listwallets
 *
 * 2. Transaction
 * createrawtransaction
 * decoderawtransaction
 * getrawtransaction
 * sendrawtransaction
 * signrawtransactionwithkey
 *
 *
 */