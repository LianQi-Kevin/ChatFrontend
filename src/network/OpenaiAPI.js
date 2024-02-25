import axios from 'axios';

const API_VERSION = "v1"

// v1/models
async function listModels(url) {
    /* List all available models. */
    const modelListURL = new URL(url)
    modelListURL.pathname = `/${API_VERSION}/models`
    try {
        const response = await axios.get(modelListURL.toString())
        return response.data.data.map(model => model["id"])
    } catch (error) {
        console.error(error)
    }
}

// v1/chat/completions
async function createCompletion(url, messages, model_name) {
    /* Create a completion for a prompt. */
    const completionURL = new URL(url)
    completionURL.pathname = `/${API_VERSION}/chat/completions`
    try {
        const response = await axios.post(completionURL.toString(), {
            messages: messages,
            model: model_name,
        })
        return {data: response.data["choices"][0]["message"]["content"], status: response.status}
    } catch (error) {
        return {data: error.response.data, status: error.response.status}
    }
}

const modelName = await listModels("https://u23218-b635-989ec868.beijinga.seetacloud.com/")
// console.log(modelName)

createCompletion(
    "https://u23218-b635-989ec868.beijinga.seetacloud.com/",
    [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "What is the purpose of life?" }
        ],
    modelName[0]
).then(({data, status}) => {
    console.log(data)
    console.log(status)
})