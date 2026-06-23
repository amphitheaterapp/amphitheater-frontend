// app/app/feed/page.tsx
"use client";

import { useState } from "react";
import FeedList from "@/components/feed/FeedList";
import DetailPanel from "@/components/feed/detailed/DetailPanal";

export default function FeedPage() {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    return (
        <div
            style={{
                display: "flex",
                height: "calc(100vh - 72px)",
                padding: "0 32px",
            }}
        >
            <FeedList
                selectedUserId={selectedUserId}
                onSelect={setSelectedUserId}
            />
            <DetailPanel
                userId={selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />
        </div>
    );
}
