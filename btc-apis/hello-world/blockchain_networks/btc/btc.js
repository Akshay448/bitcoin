import {network, url} from "./btc_constants.js";
import axios from "axios";

const getBalance = async() => {
    let request_url = url;
    request_url = request_url + '/get_address_balance' + '/' + network + '/' + this.address;
    try {
        const response = await axios.get(request_url);
        console.log(response.status);
        return response.data.data.confirmed_balance;
    } catch (e) {
        console.log('fail');
        return e;
    }
}