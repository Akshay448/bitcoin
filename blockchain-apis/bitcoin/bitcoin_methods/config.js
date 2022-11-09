const globalUrl = 'http://docker.for.mac.localhost:18332/'
const authKey = 'Basic dXNlcl9uYW1lOnlvdXJfcGFzc3dvcmQ='

/**
 * return the config object
 * @param walletName
 * @param methodName
 * @param params
 * @param extraUrl
 * @returns {{headers: {Authorization: string, "Content-Type": string}, method: string, data: string, url: string}}
 */

const getConfigObject = (methodName, params, extraUrl) => {
    let data = JSON.stringify({
        "jsonrpc": "1.0",
        "id": "curltest",
        "method": methodName,
        "params": params
    });
    return {
        method: 'post',
        url: globalUrl + extraUrl,
        headers: {
            'Authorization': authKey,
            'Content-Type': 'application/json'
        },
        data : data
    }
};

export default getConfigObject;