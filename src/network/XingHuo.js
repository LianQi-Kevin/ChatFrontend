import {nanoid} from 'nanoid'
import Base64 from "crypto-js/enc-base64.js";
import HmacSHA256 from "crypto-js/hmac-sha256.js";


/**
 * Generates an authenticated URL for XunFei XingHuo LLM WebSocket Protocol. \
 * https://www.xfyun.cn/doc/spark/general_url_authentication.html
 *
 * @param {string} apiKey - The API key for authentication.
 * @param {string} apiSecret - The API secret key used to generate the HMAC signature.
 * @param {string} [wssURL ='wss://spark-api.xf-yun.com/v1.1/chat'] - The WebSocket Secure endpoint URL.
 * @returns {string} - Authenticated WebSocket Secure URL with query parameters.
 */
function GenerateWSSAuthURL(apiKey, apiSecret, wssURL = 'wss://spark-api.xf-yun.com/v1.1/chat') {
    const dateRFC1123 = new Date().toUTCString();
    const url = new URL(wssURL);

    // 使用CryptoJS生成签名
    // const message = `host: ${url.hostname}\ndate: ${dateRFC1123}\nGET ${url.pathname} HTTP/1.1`;
    const message = `host: ${location.host}\ndate: ${dateRFC1123}\nGET ${url.pathname} HTTP/1.1`;
    const signature = Base64.stringify(HmacSHA256(message, apiSecret));

    // 授权头
    const algorithm = 'hmac-sha256'
    const headers = 'host date request-line'
    const authorization = btoa(
        `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`,
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
        // console.debug(this)
    }

    _paramsGeneration(text, domain = "generalv3.5", temperature = 0.5, max_tokens = 4096, top_k = 4) {
        const params = {
            "header": {"app_id": this.APPID, "uid": this.UID},
            "parameter": {
                "chat": {
                    "domain": domain,
                    "temperature": temperature,
                    "max_tokens": max_tokens,
                    "top_k": top_k,
                    "chat_id": this.chatID
                }
            },
            "payload": {"message": {"text": text}}
        };
        console.debug(params);
        return params
    }

    _preprocess(messages, version='3.5',validRoles = ['user', 'assistant', 'system']) {
        const extracted = [];

        for (const { role, content } of messages) {
            // 校验role，如果无效则提前返回
            if (!validRoles.includes(role)) {
                throw new Error('Found invalid role.');
            }

            // 根据 version 判断是否包含 system 消息
            if (version === '3.5' || role !== 'system') {
                extracted.push({ role, content });
            }

            // 跳过system角色的消息
            if (role === 'system') continue;

            // 校验user和assistant的配对
            const lastIndex = extracted.length - 1;
            if (role === 'assistant' && (lastIndex === 0 || extracted[lastIndex - 1].role !== 'user')) {
                throw new Error('Invalid user-assistant pair.');
            }
        }

        // 检查最后一项是否为 user
        if (extracted[extracted.length - 1].role !== 'user'){
            throw new Error('The last message must be from the user.');
        }

        return extracted;
    }

    connectWebSocket(text, temperature = 0.5, max_tokens = 4096, top_k = 4, domain = "generalv3.5", wssURL = 'wss://spark-api.xf-yun.com/v3.5/chat') {
        const url = GenerateWSSAuthURL(this.APIKey, this.APISecret, wssURL)
        console.log(url.replace('ws:', 'https:'));
        // console.log(JSON.stringify(this._paramsGeneration(text, domain, temperature, max_tokens, top_k)));
        // todo: 待修正WebSocket方法
        try {
            this.ws = new WebSocket(url);
        } catch (e) {
            console.error(e.message)
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

// const app_id = "5d1ce7a1";
// const api_secret = "MTZlNGJiMjg0ZGM1YmUzMWE2MzJmZjY3";
// const api_key = "f92aa248f688d2f492e589f752a4c9d9";
// const Spark_url = "wss://spark-api.xf-yun.com/v1.1/chat";
//
// const messagesList = [
//     { role: 'system', userName: 'system', content: 'You are a helpful assistant.', showSystem: true },
//     { role: 'user', userName: 'allEN', content: 'Give me some python Example' },
//     { role: 'assistant', userName: 'Bot', content: 'Sure\n```python\ndoc.sections[0].page_height = Cm(29.7)\n```' },
//     { role: 'user', userName: 'allEN', content: 'what can you do?' },
// ]

// console.log(GenerateWSSAuthURL(api_key, api_secret, Spark_url))

// const wsRecorder = new WSRecorder(app_id, api_secret, api_key)
// try {
//     const extracted= wsRecorder._preprocess(messagesList, '2.0', ['user', 'assistant'])
//     console.log(extracted)
// } catch (error) {
//     console.error(error.message)
// }

// wsRecorder.connectWebSocket('hello')