import { create } from "zustand";

interface ChatStore {
  prompt: string;
  setPrompt: (prompt: string) => void;
  activeConversationId: string | null;
  setActiveConversationId: (conversationId: string | null) => void;
  submitPrompt: boolean;
  setSubmitPrompt: (submitPrompt: boolean) => void;
  promptInputRef: React.RefObject<HTMLTextAreaElement> | null;
  setPromptInputRef: (
    promptInputRef: React.RefObject<HTMLTextAreaElement> | null
  ) => void;
  messages: any;
  setMessages: (messages: any) => void;
}

const useChat = create<ChatStore>((set, get) => ({
  prompt: "",
  setPrompt: (prompt) => set({ prompt }),
  activeConversationId: null,
  setActiveConversationId: (conversationId) =>
    set({ activeConversationId: conversationId }),
  submitPrompt: false,
  setSubmitPrompt: (submitPrompt) => set({ submitPrompt }),
  promptInputRef: null,
  setPromptInputRef: (promptInputRef) => set({ promptInputRef }),
  messages: [],
  setMessages: (messages) => set({ messages }),
}));

export default useChat;
