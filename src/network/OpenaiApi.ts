import axios from 'axios';

import {
    openaiChatCompletionRequestMessages,
    openaiChatCompletionRequestParams,
    openaiChatCompletionResponse,
    openaiListModelsResponse
} from '@/types/OpenaiAPITypes'

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
    try {
        const response = await apiClient({
            method: "GET",
            url: modelListURL.toString()
        })
        const data = response.data as openaiListModelsResponse
        return data.data.map(model => model.id)
    } catch (error) {
        console.error(error)
        return []
    }
}

// v1/chat/completions
export async function createChatCompletion(
    url: string,
    messages: openaiChatCompletionRequestMessages[],
    model_name: string,
    additionalParams?: openaiChatCompletionRequestParams,
) {
    /* Create a chat completion. */
    const completionURL = new URL(url)
    completionURL.pathname = `/${API_VERSION}/chat/completions`
    if (additionalParams?.stream) {
        const response = await fetch(completionURL.toString(), {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify({
                messages: messages,
                model: model_name,
                ...additionalParams
            })
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        // decode stream
        if (response.body) {
            // const reader = response.body.getReader();
            // const decoder = new TextDecoder('utf-8');

            // todo - handle stream
        }
    } else {
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
            const data = response.data as openaiChatCompletionResponse
            return data.choices[0].message?.content
        } catch (error) {
            console.error(error)
        }
    }
}
