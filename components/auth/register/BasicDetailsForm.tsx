// components/auth/register/BasicDetailsForm.tsx

"use client";

import { useState } from "react";
import { BasicDetails } from "./RegisterPage";

import DatePicker from "@/components/common/DatePicker";

const inputStyle = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(212,185,106,0.4)",
    color: "var(--cream)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    padding: "8px 0",
    outline: "none",
    width: "100%",
};

const labelStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    color: "var(--cream-muted)",
};

interface Props {
    onSubmit: (data: BasicDetails) => void;
    isLoading: boolean;
}

export default function BasicDetailsForm({ onSubmit, isLoading }: Props) {
    const [form, setForm] = useState<BasicDetails>({
        email: "",
        password: "",
        confirm_password: "",
        name: "",
        dob: "",
        phone_number: "",
        location: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    };

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
                create your account
            </p>

            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "40px",
                    fontWeight: 300,
                    color: "var(--cream)",
                    marginBottom: "40px",
                    lineHeight: 1.1,
                }}
            >
                Who are you?
            </h1>

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "28px",
                }}
            >
                {[
                    { label: "Full Name", name: "name", type: "text" },
                    { label: "Email", name: "email", type: "email" },
                    { label: "Password", name: "password", type: "password" },
                    {
                        label: "Confirm Password",
                        name: "confirm_password",
                        type: "password",
                    },
                ].map(({ label, name, type }) => (
                    <div
                        key={name}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <label style={labelStyle}>{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={form[name as keyof BasicDetails]}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                ))}

                <DatePicker
                    value={form.dob}
                    onChange={(v) => setForm((prev) => ({ ...prev, dob: v }))}
                />

                {[
                    {
                        label: "Phone Number",
                        name: "phone_number",
                        type: "tel",
                    },
                    { label: "Location", name: "location", type: "text" },
                ].map(({ label, name, type }) => (
                    <div
                        key={name}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <label style={labelStyle}>{label}</label>
                        <input
                            type={type}
                            name={name}
                            value={form[name as keyof BasicDetails]}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                ))}

                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        marginTop: "8px",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        background: isLoading
                            ? "transparent"
                            : "var(--gold-accent)",
                        color: isLoading ? "var(--cream-muted)" : "var(--ink)",
                        border: "1px solid var(--gold-accent)",
                        padding: "16px 32px",
                        cursor: isLoading ? "not-allowed" : "pointer",
                        transition: "all 0.3s ease",
                        width: "100%",
                    }}
                >
                    {isLoading ? "creating account..." : "continue"}
                </button>
            </form>

            <p
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    color: "var(--cream-muted)",
                    marginTop: "32px",
                    textAlign: "center",
                    letterSpacing: "0.05em",
                }}
            >
                already have an account?{" "}
                <a
                    href="/login"
                    style={{
                        color: "var(--gold-accent)",
                        textDecoration: "none",
                        letterSpacing: "0.1em",
                    }}
                >
                    sign in
                </a>
            </p>
        </>
    );
}
