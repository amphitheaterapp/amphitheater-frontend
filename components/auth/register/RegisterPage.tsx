// components/auth/RegisterPage.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { uploadAvatar } from "@/lib/avatarUpload";

import LoginConstellation from "../LoginConstellation";
import AnimatedLogo from "../AnimatedLogo";

import BasicDetailsForm from "./BasicDetailsForm";
import RoleSelectForm from "./RoleSelectForm";

import DirectorDetailsForm from "./DirectorDetailsForm";
import ActorDetailsForm from "./ActorDetailsForm";
import ProducerDetailsForm from "./ProducerDetailsForm";
import CinematographerDetailsForm from "./CinematographerDetailsForm";
import ScreenwriterDetailsForm from "./ScreenwriterDetailsForm";

export type BasicDetails = {
    email: string;
    password: string;
    confirm_password: string;
    name: string;
    dob: string;
    phone_number: string;
    location_label: string;
    latitude: number | null;
    longitude: number | null;
};

export type Role =
    | "actor"
    | "director"
    | "producer"
    | "cinematographer"
    | "screenwriter";

const STEPS = ["details", "role", "profile"] as const;
type Step = (typeof STEPS)[number];

export default function RegisterPage() {
    const router = useRouter();
    const { register, updateAvatarUrl, user } = useAuth();

    const [step, setStep] = useState<Step>("details");
    const [basicDetails, setBasicDetails] = useState<BasicDetails | null>(null);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // route to feed if user already logged in
    useEffect(() => {
        if (!isLoading && user) {
            router.push("/app/feed");
        }
    }, [user, isLoading, router]);

    const currentStepIndex = STEPS.indexOf(step);

    const handleBasicDetails = async (
        data: BasicDetails,
        avatarFile: File | null,
    ) => {
        setError("");
        setIsLoading(true);
        try {
            await register(data);

            if (avatarFile) {
                try {
                    const avatarUrl = await uploadAvatar(avatarFile);
                    updateAvatarUrl(avatarUrl);
                } catch {
                    // user can set an avatar later
                }
            }

            setBasicDetails(data);
            setStep("role");
        } catch (err: any) {
            const data = err?.response?.data;
            console.log("Error data:", data);
            if (data?.email) {
                setError(
                    Array.isArray(data.email) ? data.email[0] : data.email,
                );
            } else if (data?.phone_number) {
                setError(
                    Array.isArray(data.phone_number)
                        ? data.phone_number[0]
                        : data.phone_number,
                );
            } else if (data?.non_field_errors) {
                setError(
                    Array.isArray(data.non_field_errors)
                        ? data.non_field_errors[0]
                        : data.non_field_errors,
                );
            } else {
                setError("Registration failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleRoleSelect = (role: Role) => {
        setSelectedRole(role);
        setStep("profile");
    };

    const handleProfileComplete = () => {
        router.push("/app/feed");
    };

    const handleSkip = () => {
        router.push("/app/feed");
    };

    return (
        <main style={{ position: "relative", minHeight: "100vh" }}>
            <LoginConstellation />

            <div
                style={{
                    position: "relative",
                    zIndex: 1,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px",
                }}
            >
                {/* Logo */}
                <a href="/">
                    <div style={{ marginBottom: "16px" }}>
                        <AnimatedLogo />
                    </div>
                </a>

                <a
                    href="/"
                    style={{
                        textDecoration: "none",
                        marginBottom: "32px",
                    }}
                >
                    <span
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "12px",
                            letterSpacing: "0.25em",
                            textTransform: "uppercase",
                            color: "var(--cream-dim)",
                        }}
                    >
                        Amphitheater
                    </span>
                </a>

                {/* Step indicator */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "32px",
                    }}
                >
                    {STEPS.map((s, i) => (
                        <div
                            key={s}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            <div
                                style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background:
                                        i <= currentStepIndex
                                            ? "var(--gold-accent)"
                                            : "rgba(212,185,106,0.2)",
                                    transition: "background 0.3s ease",
                                }}
                            />
                            {i < STEPS.length - 1 && (
                                <div
                                    style={{
                                        width: "40px",
                                        height: "1px",
                                        background:
                                            i < currentStepIndex
                                                ? "var(--gold-accent)"
                                                : "rgba(212,185,106,0.2)",
                                        transition: "background 0.3s ease",
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {/* Card */}
                <div
                    style={{
                        width: "100%",
                        maxWidth: "960px",
                        border: "1px solid rgba(212,185,106,0.3)",
                        padding: "48px 40px",
                        background: "rgba(9,11,54,0.6)",
                        backdropFilter: "blur(12px)",
                    }}
                >
                    {error && (
                        <p
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "11px",
                                color: "#e57373",
                                marginBottom: "24px",
                                letterSpacing: "0.05em",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    {step === "details" && (
                        <BasicDetailsForm
                            onSubmit={handleBasicDetails}
                            isLoading={isLoading}
                        />
                    )}

                    {step === "role" && (
                        <RoleSelectForm onSelect={handleRoleSelect} />
                    )}

                    {step === "profile" && selectedRole === "actor" && (
                        <ActorDetailsForm
                            onComplete={handleProfileComplete}
                            onSkip={handleSkip}
                        />
                    )}

                    {step === "profile" && selectedRole === "director" && (
                        <DirectorDetailsForm
                            onComplete={handleProfileComplete}
                            onSkip={handleSkip}
                        />
                    )}

                    {step === "profile" && selectedRole === "producer" && (
                        <ProducerDetailsForm
                            onComplete={handleProfileComplete}
                            onSkip={handleSkip}
                        />
                    )}

                    {step === "profile" && selectedRole === "cinematographer" && (
                        <CinematographerDetailsForm
                            onComplete={handleProfileComplete}
                            onSkip={handleSkip}
                        />
                    )}

                    {step === "profile" && selectedRole === "screenwriter" && (
                        <ScreenwriterDetailsForm
                            onComplete={handleProfileComplete}
                            onSkip={handleSkip}
                        />
                    )}

                    {/* TODO: add other role forms here as they are built */}

                </div>
            </div>
        </main>
    );
}
