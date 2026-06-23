"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/lib/initials";
import MessagesDropdown from "@/components/messaging/MessagesDropdown";

export default function NavActions() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [signOutHovered, setSignOutHovered] = useState(false);
    const [avatarHovered, setAvatarHovered] = useState(false);

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <MessagesDropdown />

            <div
                title={user?.name}
                onMouseEnter={() => setAvatarHovered(true)}
                onMouseLeave={() => setAvatarHovered(false)}
                style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "rgba(212,185,106,0.15)",
                    border: "1px solid var(--gold-accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    letterSpacing: "0.05em",
                    color: "var(--gold-accent)",
                    overflow: "hidden",
                    cursor: "pointer",
                    transform: avatarHovered ? "scale(1.08)" : "scale(1)",
                    transition: "transform 0.2s ease",
                }}
            >
                {user?.avatar_url ? (
                    <img
                        src={user.avatar_url}
                        alt={user.name}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                ) : (
                    getInitials(user?.name)
                )}
            </div>

            <button
                onClick={handleLogout}
                onMouseEnter={() => setSignOutHovered(true)}
                onMouseLeave={() => setSignOutHovered(false)}
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "10px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: signOutHovered
                        ? "rgba(212,185,106,0.08)"
                        : "transparent",
                    color: signOutHovered
                        ? "var(--cream)"
                        : "var(--cream-muted)",
                    border: "1px solid",
                    borderColor: signOutHovered
                        ? "rgba(212,185,106,0.5)"
                        : "rgba(212,185,106,0.2)",
                    padding: "8px 16px",
                    cursor: "pointer",
                    transition:
                        "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
                }}
            >
                Sign out
            </button>
        </div>
    );
}
