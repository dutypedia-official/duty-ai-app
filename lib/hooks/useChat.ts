import { create } from "zustand";

interface ChatStore {
  prompt: string;
  template: "general" | "finance" | "forex" | "scanner";
  setTemplate: (template: "general" | "finance" | "forex" | "scanner") => void;
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
  histories: any;
  setHistories: (histories: any) => void;
  prevId: any;
  setPrevId: (prevId: any) => void;
}

const useChat = create<ChatStore>((set, get) => ({
  prompt: "",
  template: "finance",
  setTemplate: (template) => set({ template }),
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
  histories: [],
  setHistories: (histories) => set({ histories }),
  prevId: null,
  setPrevId: (prevId) => set({ prevId }),
}));

export default useChat;
