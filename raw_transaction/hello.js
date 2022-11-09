const bitcoin = require('bitcoinjs-lib')
const rp = require('request-promise');


const data = Buffer.from('Hello World', 'utf8');
const testnet=bitcoin.networks.testnet;
const privateKey='cTQLV57R1VkRnTiDknhcX1qmn8wyQzCvftPx72qm2A68QitAziJu'
const SourceAddress="tb1q6l6ssjy3kr3s9dc7qqkdqeu6emj4f2sjtn6995"

const url="https://chain.so/api/v2/get_tx_unspent/BTCTEST/"+SourceAddress
const DestionationAddress ='tb1qnddwxp89kwfd27fgepdkvuzxejrx57cgrydq2v'
const options = {
    uri: url,
    json: true
};


rp(options).then(function (response) {
    const index = response.data.txs.length - 1;

    console.log(response.data.txs[index])
    const UtxoId =response.data.txs[index].txid;
    const vout = response.data.txs[index].output_no;
    const amount=Number(response.data.txs[index].value*100000000);
    const fee = 0.0005*100000000; // 0.0005 BTC

    const RawTransaction = new bitcoin.TransactionBuilder(testnet)
    RawTransaction.addInput(UtxoId, vout);
    RawTransaction.addOutput(DestionationAddress, parseInt(amount-fee));
    scrypt = bitcoin.script.compile([bitcoin.opcodes.OP_RETURN,data]);
    RawTransaction.addOutput(scrypt, 0);
    const keyPair = bitcoin.ECPair.fromWIF(privateKey, testnet);
    RawTransaction.sign(0, keyPair)

    /* For P2SH transaction use the following code instead the previous line. Make sure that the source address is a P2SH address
    const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPair.publicKey, network: bitcoin.networks.testnet })
    const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh, network: bitcoin.networks.testnet })
    RawTransaction.sign(0, keyPair, p2sh.redeem.output, null, parseInt(amount))
    */
    const Transaction=RawTransaction.build().toHex();



    const Sendingoptions = {
        method: 'POST',
        url: 'https://chain.so/api/v2/send_tx/BTCTEST',

        body: {tx_hex: Transaction},
        json: true
    };

    rp(Sendingoptions).then(function (response) {
        const Jresponse = JSON.stringify(response);
        console.log("Transaction ID:\n"+Jresponse);

    }).catch(function (err) {

        console.log("err");

    });

}).catch(function (err) {

    console.log(err);

});

// wallet_A
// Adress - tb1q6l6ssjy3kr3s9dc7qqkdqeu6emj4f2sjtn6995
// URI - bitcoin:TB1Q6L6SSJY3KR3S9DC7QQKDQEU6EMJ4F2SJTN6995
// private key - cTQLV57R1VkRnTiDknhcX1qmn8wyQzCvftPx72qm2A68QitAziJu

// wallet_B
// address - tb1qnddwxp89kwfd27fgepdkvuzxejrx57cgrydq2v

// wallet_C
// address - tb1qc6327sd7tqmpwql6w940h9usdt3kylj9pyg0l3