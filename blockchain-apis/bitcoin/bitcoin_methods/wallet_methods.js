import axios from "axios";
import getConfigObject from "./config.js";

/**
 * returns information about the wallet
 * @param walletName
 * @returns {Promise<any>}
 */
const getWalletInfo = async (walletName) => {

    const method = 'getwalletinfo';
    const params = [];
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
 * creates a bitcoin wallet, the wallet is stored alongside the bitcoin core instance
 * @param walletName
 * @returns {Promise<any>}
 */
const createWallet = async (walletName) => {

    const method = 'createwallet';
    const params = [
        walletName
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
 * return wallet balance
 * @param walletName
 * @returns {Promise<void>}
 */
const getWalletBalance = async (walletName) => {

    const method = 'getbalance';
    const params = [];
    const extraUrl = 'wallet/' + walletName;

    let config = getConfigObject(method, params, extraUrl);

    try {
        let response = await axios(config);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export {getWalletInfo, createWallet, getWalletBalance};
