import crypto from 'crypto';


/**
 * XunFei XingHuo LLM WebSocket Protocol Universal Authentication URL Generation.
 * https://www.xfyun.cn/doc/spark/general_url_authentication.html
 *
 * @param {string} APIKey - The API key
 * @param {string} APISecret - The API secret key, used to generate the HMAC signature.
 * @param {string} [WssURL='wss://spark-api.xf-yun.com/v3.5/chat'] - The base URL of the WebSocket Secure endpoint.
 * @returns {string} - The WSS URL with appended query parameters for authorization.
 */
export function GenerateWSSAuthURL(APIKey, APISecret, WssURL = 'wss://spark-api.xf-yun.com/v3.5/chat') {
    const dateRFC1123 = new Date().toUTCString();
    const url = new URL(WssURL);

    const signature = crypto.createHmac('sha256', APISecret)
        .update(`host: ${url.host}\ndate: ${dateRFC1123}\nGET ${url.pathname} HTTP/1.1`, 'utf-8')
        .digest('base64');

    const authorization = Buffer.from(
        `api_key='${APIKey}', algorithm='hmac-sha256', headers='host date request-line', signature='${signature}'`,
        'utf-8'
    ).toString('base64');

    url.search = new URLSearchParams({
        'authorization': authorization,
        'date': dateRFC1123,
        'host': url.host
    }).toString();
    return url.href
}