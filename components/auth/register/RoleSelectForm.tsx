// components/auth/register/RoleSelectForm.tsx

"use client";

import { useState } from "react";
import { Role } from "./RegisterPage";

const ROLES: {
    id: Role;
    label: string;
    description: string;
    available: boolean;
}[] = [
    {
        id: "actor",
        label: "Actor",
        description:
            "Screen, stage, voice, stunt, and motion capture performance.",
        available: true,
    },
    // TODO: add remaining roles as their onboarding forms are built
    {
        id: "director",
        label: "Director",
        description:
            "Film, TV, commercial, theatre, and documentary direction.",
        available: true,
    },
    {
        id: "producer",
        label: "Producer",
        description: "Executive, line, field, and associate production.",
        available: true,
    },
    {
        id: "cinematographer",
        label: "Cinematographer",
        description: "Directors of photography, camera operators, and gaffers.",
        available: true,
    },
    {
        id: "screenwriter",
        label: "Screenwriter",
        description: "Feature, episodic, short, and documentary writing.",
        available: true,
    },
];

interface Props {
    onSelect: (role: Role) => void;
}

export default function RoleSelectForm({ onSelect }: Props) {
    const [selected, setSelected] = useState<Role | null>(null);

    return (
        <>
            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    letterSpacing: "0.4em",
                    textTransform: "lowercase",
                    color: "var(--gold)",
                    marginBottom: "12px",
                }}
            >
                your craft
            </p>

            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "40px",
                    fontWeight: 300,
                    color: "var(--cream)",
                    marginBottom: "12px",
                    lineHeight: 1.1,
                }}
            >
                What do you do?
            </h1>

            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    color: "var(--cream-muted)",
                    marginBottom: "36px",
                    letterSpacing: "0.05em",
                    lineHeight: 1.8,
                }}
            >
                Choose your primary role. You can add more from your profile
                later.
            </p>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                }}
            >
                {ROLES.map((role) => (
                    <button
                        key={role.id}
                        disabled={!role.available}
                        onClick={() => role.available && setSelected(role.id)}
                        style={{
                            background:
                                selected === role.id
                                    ? "rgba(212,185,106,0.08)"
                                    : "transparent",
                            border:
                                selected === role.id
                                    ? "1px solid var(--gold-accent)"
                                    : "1px solid rgba(212,185,106,0.15)",
                            padding: "16px 20px",
                            textAlign: "left",
                            cursor: role.available ? "pointer" : "not-allowed",
                            opacity: role.available ? 1 : 0.35,
                            transition: "all 0.2s ease",
                        }}
                    >
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color:
                                    selected === role.id
                                        ? "var(--gold-accent)"
                                        : "var(--cream)",
                                marginBottom: "4px",
                            }}
                        >
                            {role.label}
                            {!role.available && (
                                <span
                                    style={{
                                        marginLeft: "12px",
                                        fontSize: "9px",
                                        color: "var(--cream-muted)",
                                        letterSpacing: "0.15em",
                                    }}
                                >
                                    coming soon
                                </span>
                            )}
                        </p>
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                color: "var(--cream-muted)",
                                lineHeight: 1.6,
                            }}
                        >
                            {role.description}
                        </p>
                    </button>
                ))}
            </div>

            <button
                onClick={() => selected && onSelect(selected)}
                disabled={!selected}
                style={{
                    marginTop: "32px",
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    background: selected ? "var(--gold-accent)" : "transparent",
                    color: selected ? "var(--ink)" : "var(--cream-muted)",
                    border: "1px solid var(--gold-accent)",
                    padding: "16px 32px",
                    cursor: selected ? "pointer" : "not-allowed",
                    transition: "all 0.3s ease",
                    width: "100%",
                    opacity: selected ? 1 : 0.4,
                }}
            >
                continue
            </button>
        </>
    );
}
