import {nanoid} from 'nanoid'
import Base64 from "crypto-js/enc-base64.js";
import HmacSHA256 from "crypto-js/hmac-sha256.js";


/**
 * XunFei XingHuo LLM WebSocket Protocol Universal Authentication URL Generation. \
 * https://www.xfyun.cn/doc/spark/general_url_authentication.html
 *
 * @param {string} APIKey - The API key
 * @param {string} APISecret - The API secret key, used to generate the HMAC signature.
 * @param {string} [WssURL='wss://spark-api.xf-yun.com/v1.1/chat'] - The base URL of the WebSocket Secure endpoint.
 * @returns {string} - The WSS URL with appended query parameters for authorization.
 */
function GenerateWSSAuthURL(APIKey, APISecret, WssURL = 'wss://spark-api.xf-yun.com/v1.1/chat') {
    const dateRFC1123 = new Date().toUTCString();
    const url = new URL(WssURL);

    // 使用CryptoJS生成签名
    const message = `host: ${url.hostname}\ndate: ${dateRFC1123}\nGET ${url.pathname} HTTP/1.1`;
    const signature = Base64.stringify(HmacSHA256(message, APISecret));

    // 授权头
    const algorithm = 'hmac-sha256'
    const headers = 'host date request-line'
    const authorization = btoa(
        `api_key="${APIKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`,
    );

    // 设置URL查询参数
    url.search = new URLSearchParams({
        'authorization': authorization,
        'date': dateRFC1123,
        'host': url.host
    }).toString();
    return url.href
}

export class WSRecorder {
    constructor(APPID, APISecret, APIKey, UserID = nanoid()) {
        // base info
        this.APPID = APPID;
        this.APISecret = APISecret;
        this.APIKey = APIKey;
        this.UID = UserID;

        // chat info
        this.tokenCost = 0;
        this.status = 'disconnected';
        this.totalResult = '';
        this.chatID = nanoid();
        console.debug(this)
    }

    _paramsGeneration(text, domain = "generalv3.5", temperature = 0.5, max_tokens = 4096, top_k = 4) {
        // todo: text validation
        const params = {
            "header": {"app_id": this.APPID, "uid": this.UID}, "parameter": {
                "chat": {
                    "domain": domain,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "top_k": top_k,
                    "chat_id": this.chatID
                }
            }, "payload": {"message": {"text": text}}
        };
        console.debug(params);
        return params
    }

    connectWebSocket(text, temperature = 0.5, max_tokens = 4096, top_k = 4, domain = "generalv3.5", wssURL = 'wss://spark-api.xf-yun.com/v3.5/chat') {
        const url = GenerateWSSAuthURL(this.APIKey, this.APISecret, wssURL)
        console.log(url);
        console.log(JSON.stringify(this._paramsGeneration(text, domain, temperature, max_tokens, top_k)));
        // todo: 待修正WebSocket方法
        try {
            this.ws = new WebSocket(url);
        } catch (e) {
            console.error(e.text)
        }

        // this.ws = new WebSocket(url);
        // this.ws.close()
        // this.ws.onopen = () => {
        //     console.log('WebSocket connected');
        //     this.ws.send(JSON.stringify(this._paramsGeneration(text, domain, temperature, max_tokens, top_k)));
        //     this.status = 'connected';
        // };
        // this.ws.onmessage = (event) => {
        //     console.log('WebSocket message received:', event.data);
        // };
        // this.ws.onclose = () => {
        //     console.log('WebSocket disconnected');
        //     this.status = 'disconnected';
        //     this.chatID = nanoid();
        // };
        // this.ws.onerror = e => {
        //     this.status = 'error';
        //     alert('WebSocket报错，请f12查看详情')
        //     console.error(`详情查看：${encodeURI(url.replace('wss:', 'https:'))}`)
        // }
    }
}

// const date = "Mon, 05 Feb 2024 07:12:42 GMT"
// const api_secret = "MTZlNGJiMjg0ZGM1YmUzMWE2MzJmZjY3"
// const api_key = "f92aa248f688d2f492e589f752a4c9d9"
// const Spark_url = "wss://spark-api.xf-yun.com/v1.1/chat"
//
//
// console.log(GenerateWSSAuthURL(api_key, api_secret, Spark_url))
