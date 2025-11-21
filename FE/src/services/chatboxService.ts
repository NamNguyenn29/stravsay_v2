import api from "@/lib/axios";

export const ChatboxService = {
    chat: (message: string) => api.post("Chat/chat", message),
}