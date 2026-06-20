"use client";

import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";

export interface ChatUser {
    id: string;
    name: string;
    avatar_url: string | null;
}

export interface ChatMessage {
    id: string;
    sender: "me" | "them";
    content: string;
    timestamp: string;
}

export interface Conversation {
    id: string;
    user: ChatUser;
    messages: ChatMessage[];
    unread: boolean;
}

interface OpenBubble {
    conversationId: string;
    minimized: boolean;
}

interface MessagingContextType {
    conversations: Conversation[];
    openBubbles: OpenBubble[];
    openConversation: (user: ChatUser) => void;
    closeBubble: (conversationId: string) => void;
    toggleMinimize: (conversationId: string) => void;
    sendMessage: (conversationId: string, content: string) => void;
}

const MessagingContext = createContext<MessagingContextType | null>(null);

// Mock seed data, deliberately fake ids (mock-1, mock-2) so this is
// never confused with real backend data once Channels replaces it.
const MOCK_CONVERSATIONS: Conversation[] = [
    {
        id: "mock-1",
        user: { id: "mock-1", name: "Faith Howard", avatar_url: null },
        messages: [
            {
                id: "m1",
                sender: "them",
                content:
                    "Hey, loved your reel. Are you free to chat about the thriller project?",
                timestamp: "Yesterday",
            },
        ],
        unread: true,
    },
    {
        id: "mock-2",
        user: { id: "mock-2", name: "David Miller", avatar_url: null },
        messages: [
            {
                id: "m2",
                sender: "me",
                content:
                    "Sent over the stunt reel, let me know what you think.",
                timestamp: "Mon",
            },
        ],
        unread: false,
    },
];

const AUTO_REPLIES = [
    "Got it, thanks for reaching out!",
    "Sounds good, let me check my schedule.",
    "Appreciate you sending this over.",
];

export function MessagingProvider({ children }: { children: ReactNode }) {
    const [conversations, setConversations] =
        useState<Conversation[]>(MOCK_CONVERSATIONS);
    const [openBubbles, setOpenBubbles] = useState<OpenBubble[]>([]);

    // Opens a bubble for this user, creating a conversation if one
    // doesn't exist yet. Re-opening an already-open bubble un-minimizes it.
    const openConversation = useCallback((user: ChatUser) => {
        setConversations((prev) => {
            const exists = prev.find((c) => c.id === user.id);
            if (exists) {
                return prev.map((c) =>
                    c.id === user.id ? { ...c, unread: false } : c,
                );
            }
            return [
                ...prev,
                { id: user.id, user, messages: [], unread: false },
            ];
        });

        setOpenBubbles((prev) => {
            const already = prev.find((b) => b.conversationId === user.id);
            if (already) {
                return prev.map((b) =>
                    b.conversationId === user.id
                        ? { ...b, minimized: false }
                        : b,
                );
            }
            // Facebook caps visible bubbles, drop the oldest past 3
            const next = [
                ...prev,
                { conversationId: user.id, minimized: false },
            ];
            return next.length > 3 ? next.slice(next.length - 3) : next;
        });
    }, []);

    const closeBubble = useCallback((conversationId: string) => {
        setOpenBubbles((prev) =>
            prev.filter((b) => b.conversationId !== conversationId),
        );
    }, []);

    const toggleMinimize = useCallback((conversationId: string) => {
        setOpenBubbles((prev) =>
            prev.map((b) =>
                b.conversationId === conversationId
                    ? { ...b, minimized: !b.minimized }
                    : b,
            ),
        );
    }, []);

    // Appends locally only, no backend call. The setTimeout auto-reply
    // is cosmetic so the mock feels alive, delete this block once
    // real Channels messages replace it.
    const sendMessage = useCallback(
        (conversationId: string, content: string) => {
            if (!content.trim()) return;

            const newMessage: ChatMessage = {
                id: `${Date.now()}`,
                sender: "me",
                content,
                timestamp: "Now",
            };

            setConversations((prev) =>
                prev.map((c) =>
                    c.id === conversationId
                        ? { ...c, messages: [...c.messages, newMessage] }
                        : c,
                ),
            );

            setTimeout(() => {
                const reply: ChatMessage = {
                    id: `${Date.now()}-reply`,
                    sender: "them",
                    content:
                        AUTO_REPLIES[
                            Math.floor(Math.random() * AUTO_REPLIES.length)
                        ],
                    timestamp: "Now",
                };
                setConversations((prev) =>
                    prev.map((c) =>
                        c.id === conversationId
                            ? { ...c, messages: [...c.messages, reply] }
                            : c,
                    ),
                );
            }, 1400);
        },
        [],
    );

    return (
        <MessagingContext.Provider
            value={{
                conversations,
                openBubbles,
                openConversation,
                closeBubble,
                toggleMinimize,
                sendMessage,
            }}
        >
            {children}
        </MessagingContext.Provider>
    );
}

export function useMessaging() {
    const context = useContext(MessagingContext);
    if (!context) {
        throw new Error("useMessaging must be used within a MessagingProvider");
    }
    return context;
}
