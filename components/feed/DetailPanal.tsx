"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { getInitials } from "@/lib/initials";
import { FIELD_GROUPS_BY_ROLE, formatFieldValue } from "@/lib/feedFields";
import Collapsible from "@/components/common/Collapsible";

interface DetailRole {
    role: string;
    data?: Record<string, any>;
    detail_unavailable?: boolean;
}

interface ProfileDetail {
    user: {
        id: string;
        name: string;
        avatar_url: string | null;
        location_label: string;
    };
    roles: DetailRole[];
}

interface Props {
    userId: string | null;
    onClose: () => void;
}

export default function DetailPanel({ userId, onClose }: Props) {
    const [detail, setDetail] = useState<ProfileDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        if (!userId) {
            setDetail(null);
            return;
        }
        setLoading(true);
        setError(false);
        setActiveTab(0);

        api.get(`/api/v1/profile/detail/${userId}/`)
            .then((res) => setDetail(res.data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [userId]);

    if (!userId) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--cream-muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    letterSpacing: "0.1em",
                }}
            >
                Select a profile to view details
            </div>
        );
    }

    if (loading) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--cream-muted)",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                }}
            >
                Loading...
            </div>
        );
    }

    if (error || !detail) {
        return (
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#e57373",
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                }}
            >
                Couldn't load this profile.
            </div>
        );
    }

    const role = detail.roles[activeTab];

    return (
        <div style={{ flex: 1, padding: "24px 32px", overflowY: "auto" }}>
            <button
                onClick={onClose}
                style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--cream-muted)",
                    fontSize: "11px",
                    cursor: "pointer",
                    marginBottom: "16px",
                    fontFamily: "var(--font-body)",
                    letterSpacing: "0.1em",
                }}
            >
                &times; Close
            </button>

            <div
                style={{
                    display: "flex",
                    gap: "16px",
                    alignItems: "center",
                    marginBottom: "24px",
                }}
            >
                <div
                    style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "50%",
                        background: "rgba(212,185,106,0.15)",
                        border: "1px solid var(--gold-accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "var(--font-body)",
                        fontSize: "16px",
                        color: "var(--gold-accent)",
                    }}
                >
                    {getInitials(detail.user.name)}
                </div>
                <div>
                    <h2
                        style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "24px",
                            fontWeight: 300,
                            color: "var(--cream)",
                            margin: 0,
                        }}
                    >
                        {detail.user.name}
                    </h2>
                    <p
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            color: "var(--cream-muted)",
                            margin: "4px 0 0",
                        }}
                    >
                        {detail.user.location_label}
                    </p>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: "24px",
                    borderBottom: "1px solid rgba(212,185,106,0.15)",
                    marginBottom: "24px",
                }}
            >
                {detail.roles.map((r, i) =>
                    detail.roles.length > 1 ? (
                        <button
                            key={r.role}
                            onClick={() => setActiveTab(i)}
                            style={{
                                background: "transparent",
                                border: "none",
                                borderBottom:
                                    i === activeTab
                                        ? "2px solid var(--gold-accent)"
                                        : "2px solid transparent",
                                color:
                                    i === activeTab
                                        ? "var(--gold)"
                                        : "var(--cream-muted)",
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                padding: "0 0 10px",
                                cursor: "pointer",
                            }}
                        >
                            {r.role}
                        </button>
                    ) : (
                        <span
                            key={r.role}
                            style={{
                                borderBottom: "2px solid var(--gold-accent)",
                                color: "var(--gold)",
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                padding: "0 0 10px",
                            }}
                        >
                            {r.role}
                        </span>
                    ),
                )}
            </div>

            {role.detail_unavailable ? (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "12px",
                        color: "var(--cream-muted)",
                        fontStyle: "italic",
                    }}
                >
                    Full detail view for this role is coming soon.
                </p>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "20px",
                    }}
                >
                    {FIELD_GROUPS_BY_ROLE[role.role]?.map((group) => (
                        <Collapsible key={group.title} title={group.title}>
                            {group.fields.map((field) => (
                                <div
                                    key={field}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "16px",
                                    }}
                                >
                                    <span
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "11px",
                                            color: "var(--cream-muted)",
                                        }}
                                    >
                                        {field.replace(/_/g, " ")}
                                    </span>
                                    <span
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "12px",
                                            color: "var(--cream)",
                                            textAlign: "right",
                                        }}
                                    >
                                        {formatFieldValue(role.data?.[field])}
                                    </span>
                                </div>
                            ))}
                        </Collapsible>
                    ))}
                </div>
            )}
        </div>
    );
}
