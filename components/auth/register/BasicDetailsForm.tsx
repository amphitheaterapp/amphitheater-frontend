// components/auth/register/BasicDetailsForm.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { BasicDetails } from "./RegisterPage";
import DatePicker from "@/components/common/DatePicker";
import PhoneInput from "@/components/common/PhoneInput";
import { validateAvatarFile } from "@/lib/avatarUpload";
import api from "@/lib/axios";

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
    onSubmit: (data: BasicDetails, avatarFile: File | null) => void;
    isLoading: boolean;
}

type OTPState = "idle" | "sending" | "sent" | "verified";

function UploadIcon({ size = 28 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
        </svg>
    );
}

export default function BasicDetailsForm({ onSubmit, isLoading }: Props) {
    const [form, setForm] = useState<BasicDetails>({
        email: "",
        password: "",
        confirm_password: "",
        name: "",
        dob: "",
        phone_number: "",
        location_label: "",
        latitude: null,
        longitude: null,
    });

    const [error, setError] = useState("");
    const [otpState, setOtpState] = useState<OTPState>("idle");
    const [otpCode, setOtpCode] = useState("");
    const [otpError, setOtpError] = useState("");

    // Avatar is staged here only, no network call happens until
    // registration itself succeeds, see RegisterPage.handleBasicDetails
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(
        null,
    );
    const [avatarError, setAvatarError] = useState("");
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const clearErrors = () => {
        setOtpError("");
        setError("");
    };

    const stageFile = (file: File) => {
        const validationError = validateAvatarFile(file);
        if (validationError) {
            setAvatarError(validationError);
            return;
        }
        setAvatarError("");
        if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
        setAvatarFile(file);
        setAvatarPreviewUrl(URL.createObjectURL(file));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) stageFile(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) stageFile(file);
    };

    const clearAvatar = () => {
        if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
        setAvatarFile(null);
        setAvatarPreviewUrl(null);
        setAvatarError("");
    };

    // Revoke the object URL on unmount, otherwise it leaks
    useEffect(() => {
        return () => {
            if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
        };
    }, [avatarPreviewUrl]);

    const autocompleteRef = useRef<any | null>(null);
    const locationInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const initAutocomplete = () => {
            if (!locationInputRef.current) return;
            const g = (window as any).google;
            if (!g?.maps?.places) return;

            autocompleteRef.current = new g.maps.places.Autocomplete(
                locationInputRef.current,
                { types: ["(cities)"] },
            );
            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current?.getPlace();
                if (!place?.geometry?.location) return;
                setForm((prev) => ({
                    ...prev,
                    location_label: place.formatted_address || place.name || "",
                    latitude: place.geometry!.location!.lat(),
                    longitude: place.geometry!.location!.lng(),
                }));
            });
        };

        if ((window as any).google?.maps?.places) {
            initAutocomplete();
            return;
        }

        const interval = setInterval(() => {
            if ((window as any).google?.maps?.places) {
                initAutocomplete();
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        clearErrors();
        if (e.target.name === "email" && otpState !== "idle") {
            setOtpState("idle");
            setOtpCode("");
            setOtpError("");
        }
    };

    const handleSendOTP = async () => {
        if (!form.email) return;
        setOtpState("sending");
        setOtpError("");
        try {
            await api.post("/api/v1/auth/send-otp/", {
                email: form.email,
            });
            setOtpState("sent");
        } catch (err: any) {
            const data = err?.response?.data;
            if (data?.message) {
                setOtpError(data.message);
            } else {
                setOtpError("Failed to send code. Check the email address.");
            }
            setOtpState("idle");
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpCode) return;
        setOtpError("");
        try {
            await api.post("/api/v1/auth/verify-otp/", {
                email: form.email,
                code: otpCode,
            });
            setOtpState("verified");
        } catch {
            setOtpError("Invalid or expired code.");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otpState !== "verified") {
            setError("Please verify your email before continuing.");
            return;
        }
        if (form.password !== form.confirm_password) {
            setError("Passwords do not match.");
            return;
        }
        if (form.latitude === null || form.longitude === null) {
            setError("Please select a location from the dropdown.");
            return;
        }
        onSubmit(form, avatarFile);
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
                    textAlign: "center",
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
                    textAlign: "center",
                }}
            >
                Who are you?
            </h1>

            <form onSubmit={handleSubmit}>
                <div
                    style={{
                        display: "flex",
                        gap: "32px",
                        alignItems: "flex-start",
                    }}
                >
                    {/* Avatar dropzone */}
                    <div style={{ flexShrink: 0 }}>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault();
                                setDragActive(true);
                            }}
                            onDragLeave={() => setDragActive(false)}
                            onDrop={handleDrop}
                            style={{
                                width: "220px",
                                height: "220px",
                                border: dragActive
                                    ? "1px solid var(--gold-accent)"
                                    : "1px dashed rgba(212,185,106,0.4)",
                                background: dragActive
                                    ? "rgba(212,185,106,0.06)"
                                    : "rgba(255,255,255,0.02)",
                                borderRadius: "4px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                position: "relative",
                                overflow: "hidden",
                                transition:
                                    "border-color 0.2s ease, background 0.2s ease",
                            }}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFileSelect}
                                style={{ display: "none" }}
                            />

                            {avatarPreviewUrl ? (
                                <>
                                    <img
                                        src={avatarPreviewUrl}
                                        alt="Avatar preview"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            position: "absolute",
                                            inset: 0,
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            clearAvatar();
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: "8px",
                                            right: "8px",
                                            width: "24px",
                                            height: "24px",
                                            borderRadius: "50%",
                                            background: "rgba(9,11,54,0.85)",
                                            border: "1px solid rgba(212,185,106,0.4)",
                                            color: "var(--cream)",
                                            cursor: "pointer",
                                            fontSize: "13px",
                                            lineHeight: 1,
                                        }}
                                    >
                                        &times;
                                    </button>
                                </>
                            ) : (
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: "10px",
                                        padding: "16px",
                                        textAlign: "center",
                                    }}
                                >
                                    <span
                                        style={{ color: "var(--gold-accent)" }}
                                    >
                                        <UploadIcon />
                                    </span>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "11px",
                                            color: "var(--cream-muted)",
                                            letterSpacing: "0.05em",
                                            margin: 0,
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        Drag and drop your
                                        <br />
                                        profile picture
                                    </p>
                                    <p
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            color: "var(--gold-accent)",
                                            letterSpacing: "0.1em",
                                            textTransform: "uppercase",
                                            margin: 0,
                                        }}
                                    >
                                        or click to upload
                                    </p>
                                </div>
                            )}
                        </div>

                        {avatarError && (
                            <p
                                style={{
                                    fontFamily: "var(--font-body)",
                                    fontSize: "10px",
                                    color: "#e57373",
                                    marginTop: "8px",
                                    textAlign: "center",
                                    width: "220px",
                                }}
                            >
                                {avatarError}
                            </p>
                        )}
                    </div>

                    {/* Form fields */}
                    <div
                        style={{
                            flex: 1,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            gap: "28px",
                        }}
                    >
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

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                }}
                            >
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    disabled={otpState === "verified"}
                                    style={{
                                        ...inputStyle,
                                        flex: 1,
                                        opacity:
                                            otpState === "verified" ? 0.6 : 1,
                                    }}
                                />

                                {otpState === "verified" ? (
                                    <span
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            letterSpacing: "0.15em",
                                            color: "#81c784",
                                            textTransform: "uppercase",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        ✓ verified
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleSendOTP}
                                        disabled={
                                            !form.email ||
                                            otpState === "sending"
                                        }
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            letterSpacing: "0.15em",
                                            textTransform: "uppercase",
                                            background: "transparent",
                                            color: form.email
                                                ? "var(--gold-accent)"
                                                : "var(--cream-muted)",
                                            border: "1px solid",
                                            borderColor: form.email
                                                ? "var(--gold-accent)"
                                                : "rgba(212,185,106,0.2)",
                                            padding: "6px 12px",
                                            cursor: form.email
                                                ? "pointer"
                                                : "not-allowed",
                                            whiteSpace: "nowrap",
                                            transition: "all 0.2s ease",
                                        }}
                                    >
                                        {otpState === "sending"
                                            ? "sending..."
                                            : otpState === "sent"
                                              ? "resend"
                                              : "send code"}
                                    </button>
                                )}
                            </div>

                            {otpState === "sent" && (
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        marginTop: "8px",
                                    }}
                                >
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder="enter 6-digit code"
                                        value={otpCode}
                                        onChange={(e) =>
                                            setOtpCode(
                                                e.target.value.replace(
                                                    /\D/g,
                                                    "",
                                                ),
                                            )
                                        }
                                        style={{
                                            ...inputStyle,
                                            flex: 1,
                                            letterSpacing: "0.2em",
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOTP}
                                        disabled={otpCode.length !== 6}
                                        style={{
                                            fontFamily: "var(--font-body)",
                                            fontSize: "10px",
                                            letterSpacing: "0.15em",
                                            textTransform: "uppercase",
                                            background:
                                                otpCode.length === 6
                                                    ? "var(--gold-accent)"
                                                    : "transparent",
                                            color:
                                                otpCode.length === 6
                                                    ? "var(--ink)"
                                                    : "var(--cream-muted)",
                                            border: "1px solid var(--gold-accent)",
                                            padding: "6px 12px",
                                            cursor:
                                                otpCode.length === 6
                                                    ? "pointer"
                                                    : "not-allowed",
                                            whiteSpace: "nowrap",
                                            transition: "all 0.2s ease",
                                            opacity:
                                                otpCode.length === 6 ? 1 : 0.4,
                                        }}
                                    >
                                        verify
                                    </button>
                                </div>
                            )}

                            {otpError && (
                                <p
                                    style={{
                                        fontFamily: "var(--font-body)",
                                        fontSize: "11px",
                                        color: "#e57373",
                                        letterSpacing: "0.05em",
                                        marginTop: "4px",
                                    }}
                                >
                                    {otpError}
                                </p>
                            )}
                        </div>

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
                                autoComplete="off"
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
                                autoComplete="off"
                            />
                        </div>

                        <div style={{ gridColumn: "1 / -1" }}>
                            <DatePicker
                                value={form.dob}
                                onChange={(v) =>
                                    setForm((prev) => ({ ...prev, dob: v }))
                                }
                            />
                        </div>

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
                                ref={locationInputRef}
                                type="text"
                                placeholder="Start typing your city..."
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || otpState !== "verified"}
                    style={{
                        marginTop: "32px",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        background:
                            isLoading || otpState !== "verified"
                                ? "transparent"
                                : "var(--gold-accent)",
                        color:
                            isLoading || otpState !== "verified"
                                ? "var(--cream-muted)"
                                : "var(--ink)",
                        border: "1px solid var(--gold-accent)",
                        padding: "16px 32px",
                        cursor:
                            isLoading || otpState !== "verified"
                                ? "not-allowed"
                                : "pointer",
                        transition: "all 0.3s ease",
                        width: "100%",
                        opacity: isLoading || otpState !== "verified" ? 0.4 : 1,
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
                    }}
                >
                    sign in
                </a>
            </p>
        </>
    );
}
