// components/auth/register/BasicDetailsForm.tsx

"use client";

import { useState } from "react";
import { BasicDetails } from "./RegisterPage";

import DatePicker from "@/components/common/DatePicker";
import PhoneInput from "@/components/common/PhoneInput";

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

    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirm_password) {
            setError("Passwords do not match.");
            return;
        }
        onSubmit(form);
    };

    return (
        <>
            {error && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "#e57373",
                        marginBottom: "16px",
                        letterSpacing: "0.05em",
                    }}
                >
                    {error}
                </p>
            )}
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
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "28px",
                }}
            >
                {/* Full width fields */}
                <div
                    style={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label style={labelStyle}>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>

                <div
                    style={{
                        gridColumn: "1 / -1",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label style={labelStyle}>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>

                {/* Side by side */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label style={labelStyle}>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label style={labelStyle}>Confirm Password</label>
                    <input
                        type="password"
                        name="confirm_password"
                        value={form.confirm_password}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>

                {/* Full width */}
                <div style={{ gridColumn: "1 / -1" }}>
                    <DatePicker
                        value={form.dob}
                        onChange={(v) =>
                            setForm((prev) => ({ ...prev, dob: v }))
                        }
                    />
                </div>

                {/* Side by side */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <div style={{ gridColumn: "1 / -1" }}>
                        <PhoneInput
                            value={form.phone_number}
                            onChange={(v) =>
                                setForm((prev) => ({
                                    ...prev,
                                    phone_number: v,
                                }))
                            }
                        />
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label style={labelStyle}>Location</label>
                    <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>

                {/* Full width button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                        gridColumn: "1 / -1",
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
                    gridColumn: "1 / -1",
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
                    }}
                >
                    sign in
                </a>
            </p>
        </>
    );
}
