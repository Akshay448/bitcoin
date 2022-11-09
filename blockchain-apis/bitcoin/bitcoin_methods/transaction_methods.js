import axios from "axios";
import getConfigObject from "./config.js";
import {getWalletBalance} from "./wallet_methods.js";

/**
 * filter utxos
 * @param utxos
 * @returns {*}
 */
const getRawTransactionValues = utxos => utxos.map(utxo => ({
    address: utxo.address,
    amount: utxo.amount,
    vout: utxo.vout,
    txid: utxo.txid
}));

/**
 * gets minimum number of utxos that will be used to create the raw transaction
 * @param utxos
 * @param amountToSend
 * @returns {*[]}
 */
function getEnoughUtxos(utxos, amountToSend) {
    let currentSum = 0.0;
    let enoughUtxos = [];
    let i = 0;
    while (currentSum < amountToSend) {
        enoughUtxos.push(utxos[i]);
        currentSum += utxos[i].amount
        i++;
    }
    return enoughUtxos;
}

/**
 * get utxos for the given wallet, mostly wallet is the sender wallet
 * @param walletName
 * @returns {Promise<*|SVGAnimatedString|T|string|ArrayBuffer>}
 */
const listUnspentTransaction = async (walletName) => {
    const method = 'listunspent';
    const params = [];
    const extraUrl = 'wallet/' + walletName;

    let config = getConfigObject(method, params, extraUrl);

    try {
        let response = await axios(config);
        let utxos = response.data.result;
        utxos = getRawTransactionValues(utxos)
        return utxos;
    } catch (error) {
        console.log(error);
    }
}

/**
 * create raw transaction that will be signed and published to the network
 * @param enoughUtxos
 * @param amountToSend
 * @param toAddress
 * @param amountBackToAddress
 * @returns {Promise<*>}
 */
const createRawTransaction = async (enoughUtxos, amountToSend, toAddress, amountBackToAddress) => {
    const method = 'createrawtransaction';
    let txidAndVoutArray = enoughUtxos.map(utxo => ({
        vout: utxo.vout,
        txid: utxo.txid
    }));

    let toAddressObj = {};
    toAddressObj[toAddress] = amountToSend;

    let backToSenderAddressObj = {};
    let backToSenderAddress = enoughUtxos[0].address;
    backToSenderAddressObj[backToSenderAddress] = amountBackToAddress;

    const params = [
        txidAndVoutArray,
        [
            {
                "data": "68656c6c6f20627463"
            },
            toAddressObj,
            backToSenderAddressObj
        ]
    ];

    const extraUrl = '';

    let config = getConfigObject(method, params, extraUrl);

    try {
        let response = await axios(config);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/**
 * sign the transaction using the rawHex
 * @param walletName
 * @param rawHex
 * @returns {Promise<*>}
 */
const signTransactionWithWallet = async (walletName, rawHex) => {
    const method = 'signrawtransactionwithwallet';
    const params = [
        rawHex
    ];
    const extraUrl = 'wallet/' + walletName;

    let config = getConfigObject(method, params, extraUrl);

    try {
        let response = await axios(config);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

/**
 * send the transaction to the bitcoin network
 * @param signedTransactionHex
 * @returns {Promise<*>}
 */
const sendRawTransaction = async (signedTransactionHex) => {
    const method = 'sendrawtransaction';
    const params = [
        signedTransactionHex
    ];
    const extraUrl = '';

    let config = getConfigObject(method, params, extraUrl);

    try {
        let response = await axios(config);
        return response;
    } catch (error) {
        console.log(error);
    }
}

/**
 * custom function to send bitcoins from one wallet to another
 * @param walletName
 * @param toAddress
 * @param amountToSend
 * @param fees
 * @returns {Promise<{message: string, statusCode: number}|*>}
 */
const sendBitcoin = async (walletName, toAddress, amountToSend, fees) => {

    // if amountToSend is more than wallet balance, return
    let minimumAmountNeeded = amountToSend + fees;
    let walletBalanceObj = await getWalletBalance(walletName);
    let walletBalance = walletBalanceObj.result;
    if (walletBalance < minimumAmountNeeded) {
        return {
            statusCode: 400,
            message: "not enough bitcoins to send"
        };
    }

    // get the UTXOs that will be used to create the transaction
    let utxos = await listUnspentTransaction(walletName);
    // utxos.sort((a, b) => b.amount - a.amount);
    // let enoughUtxos = getEnoughUtxos(utxos, minimumAmountNeeded);

    let amountBackToAddress = walletBalance - amountToSend - fees;

    // create raw transaction
    let rawTransaction = await createRawTransaction(utxos, amountToSend, toAddress, amountBackToAddress);
    let rawTransactionHex = rawTransaction.result;

    // sign transaction with wallet
    let signedTransaction = await signTransactionWithWallet(walletName, rawTransactionHex);
    let signedTransactionHex = signedTransaction.result.hex;

    // send raw transaction to the network
    let response = await sendRawTransaction(signedTransactionHex);
    return response.data
}

export {sendBitcoin};
