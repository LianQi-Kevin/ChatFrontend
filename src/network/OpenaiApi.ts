import axios from 'axios';

import {
    openaiChatCompletionRequestMessages,
    openaiChatCompletionRequestParams,
    openaiChatCompletionResponse,
    openaiListModelsResponse
} from '@/types/OpenaiAPI'

const API_VERSION: string = "v1"
const OPENAI_API_KEY: string = "EMPTY"

const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENAI_API_KEY}`
}

const apiClient = axios.create({
    timeout: undefined,
    headers: HEADERS
})

// v1/models
export async function listModels(url: string): Promise<string[]> {
    /* List all available models. */
    const modelListURL = new URL(url)
    modelListURL.pathname = `/${API_VERSION}/models`

    return new Promise((resolve, reject) => {
        apiClient({
            method: "GET",
            url: modelListURL.toString()
        }).then(response => {
            const data: openaiListModelsResponse = response.data
            resolve(data.data.map(model => model.id))
        }).catch(error => {
            console.error(error)
            reject(error)
        })
    })
}

// v1/chat/completions
export async function createChatCompletion(
    url: string,
    messages: openaiChatCompletionRequestMessages[],
    model_name: string,
    additionalParams?: openaiChatCompletionRequestParams,
): Promise<openaiChatCompletionResponse> {
    /* Create a chat completion. */
    const completionURL = new URL(url)
    completionURL.pathname = `/${API_VERSION}/chat/completions`
    // todo: unsupported stream
    return new Promise(async (resolve, reject) => {
        try {
            const response = await apiClient({
                method: "post",
                url: completionURL.toString(),
                data: {
                    messages: messages,
                    model: model_name,
                    ...additionalParams
                }
            })
            const data: openaiChatCompletionResponse = response.data
            resolve(data)
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}
