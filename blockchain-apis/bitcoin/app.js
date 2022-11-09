// const axios = require('axios')
import axios from "axios";
import {createWallet, getWalletBalance, getWalletInfo} from "./bitcoin_methods/wallet_methods.js";
import {sendBitcoin} from "./bitcoin_methods/transaction_methods.js";
const url = 'http://checkip.amazonaws.com/';
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
        // const ret = await axios(url);

        // response = {
        //     'statusCode': 200,
        //     'body': JSON.stringify({
        //         message: 'hello btc',
        //         location: ret.data.trim()
            // })
        // }
        // return response

        let body = JSON.parse(event.body);
        let walletName = body.wallet_name;

        switch (event.httpMethod) {
            case "POST":
                const path = event.path
                switch (path) {
                    case '/btc/wallet_info':
                        response = await getWalletInfo(walletName);
                        break;
                    case '/btc/create_wallet':
                        response = await createWallet(walletName);
                        break;
                    case '/btc/get_balance':
                        response = await getWalletBalance(walletName);
                        break;
                    case '/btc/send_btc':
                        let toAddress = body.to_address;
                        let amountToSend = body.amount_to_send;
                        let fees = body.fees
                        response = await sendBitcoin(walletName, toAddress, amountToSend, fees);
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }

        response = formatResponse(response);
    } catch (err) {
        console.log(err);
        return err;
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