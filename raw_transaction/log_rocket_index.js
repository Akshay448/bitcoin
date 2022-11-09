const axios = require("axios");
const bitcore = require("bitcore-lib");

const sendBitcoin = async (recieverAddress, amountToSend) => {
    const sochain_network = "BTCTEST";
    const privateKey = "cTQLV57R1VkRnTiDknhcX1qmn8wyQzCvftPx72qm2A68QitAziJu";
    const sourceAddress = "tb1q6l6ssjy3kr3s9dc7qqkdqeu6emj4f2sjtn6995";
    const satoshiToSend = amountToSend * 100000000;
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2;
    const response = await axios.get(
        `https://sochain.com/api/v2/get_tx_unspent/${sochain_network}/${sourceAddress}`
    );
    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0;

    let inputs = [];
    let utxos = response.data.data.txs;

    for (const element of utxos) {
        let utxo = {};
        utxo.satoshis = Math.floor(Number(element.value) * 100000000);
        utxo.script = element.script_hex;
        utxo.address = response.data.data.address;
        utxo.txId = element.txid;
        utxo.outputIndex = element.output_no;
        totalAmountAvailable += utxo.satoshis;
        inputCount += 1;
        inputs.push(utxo);
    }

    transactionSize = inputCount * 146 + outputCount * 34 + 10 - inputCount;
    // Check if we have enough funds to cover the transaction and the fees assuming we want to pay 20 satoshis per byte

    fee = transactionSize * 20
    if (totalAmountAvailable - satoshiToSend - fee  < 0) {
        throw new Error("Balance is too low for this transaction");
    }

    //Set transaction input
    transaction.from(inputs);

    // set the recieving address and the amount to send
    transaction.to(recieverAddress, satoshiToSend);

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(sourceAddress);

    //manually set transaction fees: 20 satoshis per byte
    transaction.fee(fee);

    // Sign transaction with your private key
    transaction.sign(privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();
    // Send transaction
    const result = await axios({
        method: "POST",
        url: `https://sochain.com/api/v2/send_tx/${sochain_network}`,
        data: {
            tx_hex: serializedTransaction,
        },
    });
    return result.data.data;
};

sendBitcoin("tb1qnddwxp89kwfd27fgepdkvuzxejrx57cgrydq2v", 0.0001).then((r) => console.log(r))