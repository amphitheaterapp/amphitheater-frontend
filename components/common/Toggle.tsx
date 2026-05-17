// components/common/Toggle.tsx

"use client";

const labelStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    color: "var(--cream-muted)",
};

interface Props {
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
}

export default function Toggle({ label, value, onChange }: Props) {
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <label style={labelStyle}>{label}</label>
            <button
                type="button"
                onClick={() => onChange(!value)}
                style={{
                    width: "40px",
                    height: "20px",
                    borderRadius: "10px",
                    background: value
                        ? "var(--gold-accent)"
                        : "rgba(212,185,106,0.15)",
                    border: "none",
                    cursor: "pointer",
                    position: "relative",
                    transition: "background 0.2s ease",
                }}
            >
                <span
                    style={{
                        position: "absolute",
                        top: "2px",
                        left: value ? "22px" : "2px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "var(--ink)",
                        transition: "left 0.2s ease",
                    }}
                />
            </button>
        </div>
    );
}
