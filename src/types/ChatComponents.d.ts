import type {openaiChatCompletionRequestMessagesContent} from "@/types/OpenaiAPI";
import type {ChatCardProps} from "@/components/ChatCard.vue";

export interface ChatMessagesList extends ChatCardProps {
    content: string | openaiChatCompletionRequestMessagesContent[];
}