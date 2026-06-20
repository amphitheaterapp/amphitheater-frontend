"use client";

import { useMessaging } from "@/context/MessagingContext";
import MessageBubble from "./MessageBubble";

export default function BubbleDock() {
    const { openBubbles, conversations } = useMessaging();

    if (openBubbles.length === 0) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                right: "20px",
                zIndex: 60,
                display: "flex",
                alignItems: "flex-end",
                gap: "12px",
            }}
        >
            {openBubbles.map((bubble) => {
                const conversation = conversations.find(
                    (c) => c.id === bubble.conversationId,
                );
                if (!conversation) return null;
                return (
                    <MessageBubble
                        key={bubble.conversationId}
                        conversation={conversation}
                        minimized={bubble.minimized}
                    />
                );
            })}
        </div>
    );
}
