// /v1/models
export interface openaiListModelsResponse {
    object: string;
    data: {
        id: string;
        object?: string;
        created?: number;
        owned_by?: string;
    }[];
}

// completions params
export interface openaiChatCompletionRequestParams {
    frequency_penalty?: number | null;
    logprobs?: number | null;
    max_tokens?: number | null;
    n?: number | null;
    presence_penalty?: number | null;
    seed?: number | null;
    stop?: string | string[] | any;
    stream?: boolean | null;
    temperature?: number | null;
    top_p?: number | null;
    user?: string;
}

// /v1/chat/completions
export interface openaiChatCompletionRequestMessages {
    role: "system" | "user" | "assistant";
    content: string | {
        type: "image" | "text";
        image_url?: { url: string };
        text?: string;
    }[];
}

interface openaiChatCompletionRequest extends openaiChatCompletionRequestParams {
    model: string;
    messages: openaiChatCompletionRequestMessages[];
    // todo: to support tool_calls
}

export interface openaiChatCompletionResponse {
    id: string;
    object: "chat.completion" | "chat.completion.chunk";
    created: number;
    model: string;
    system_fingerprint? : string;
    choices: {
        index: number;
        message?: {
            role: string;
            content?: string;
            // todo: to support tool_calls
        };
        delta?: {
            role?: string;
            content?: string;
        }
        logprobs?: any | null;
        finish_reason: "stop" | "length" | "content_filter" | "tool_calls" | "function_call" | null;
    }[];
    usage?: {
        "prompt_tokens": number,
        "total_tokens": number,
        "completion_tokens": number
    }
}

// /v1/completions
interface openaiCompletionRequest extends openaiChatCompletionRequestParams {
    model: string;
    prompt: string;
    best_of?: number | null;
    echo?: boolean | null;
    suffix?: string | null;
}