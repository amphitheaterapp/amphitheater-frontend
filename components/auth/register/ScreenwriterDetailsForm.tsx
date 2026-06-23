"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";
import Dropdown from "@/components/common/Dropdown";
import TagInput from "@/components/common/TagInput";
import MultiDropdownTagInput from "@/components/common/MultiDropdownTagInput";
import Toggle from "@/components/common/Toggle";
import Collapsible from "@/components/common/Collapsible";

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

interface Option {
    value: string;
    label: string;
}

interface ScreenwriterChoices {
    guild_status: Option[];
    languages: Option[];
    genre_choices: Option[];
    format_choices: Option[];
    writing_style: Option[];
    structural_approach: Option[];
}

interface ScreenwriterData {
    guild_status: string;
    languages: string[];
    representation: string;
    remote_capable: boolean;
    genres: string[];
    formats: string[];
    writing_style: string;
    structural_approach: string;
    thematic_interests: string[];
    influences: string[];
    years_experience: string;
    has_feature_credits: boolean;
    has_tv_credits: boolean;
    has_theatre_credits: boolean;
    has_documentary_credits: boolean;
    has_short_credits: boolean;
    has_podcast_credits: boolean;
    has_produced_credits: boolean;
    has_spec_scripts: boolean;
    adaptation_experience: boolean;
    has_optioned_scripts: boolean;
    has_sold_scripts: boolean;
    awards: string[];
    fellowships: string[];
    reel_url: string;
    imdb_url: string;
    past_works: string[];
    profile_links: {
        linkedin: string;
        instagram: string;
        youtube: string;
        website: string;
    };
}

interface Props {
    onComplete: () => void;
    onSkip: () => void;
}

export default function ScreenwriterDetailsForm({ onComplete, onSkip }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [choices, setChoices] = useState<ScreenwriterChoices>({
        guild_status: [],
        languages: [],
        genre_choices: [],
        format_choices: [],
        writing_style: [],
        structural_approach: [],
    });

    useEffect(() => {
        api.get("/api/v1/profile/screenwriter/choices/")
            .then((res) => setChoices(res.data))
            .catch(() => {});
    }, []);

    const [form, setForm] = useState<ScreenwriterData>({
        guild_status: "",
        languages: [],
        representation: "",
        remote_capable: false,
        genres: [],
        formats: [],
        writing_style: "",
        structural_approach: "",
        thematic_interests: [],
        influences: [],
        years_experience: "",
        has_feature_credits: false,
        has_tv_credits: false,
        has_theatre_credits: false,
        has_documentary_credits: false,
        has_short_credits: false,
        has_podcast_credits: false,
        has_produced_credits: false,
        has_spec_scripts: false,
        adaptation_experience: false,
        has_optioned_scripts: false,
        has_sold_scripts: false,
        awards: [],
        fellowships: [],
        reel_url: "",
        imdb_url: "",
        past_works: [],
        profile_links: {
            linkedin: "",
            instagram: "",
            youtube: "",
            website: "",
        },
    });

    const set = (key: keyof ScreenwriterData, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await api.post("/api/v1/profile/screenwriter/", {
                ...form,
                years_experience: form.years_experience
                    ? parseInt(form.years_experience)
                    : null,
                profile_links: Object.fromEntries(
                    Object.entries(form.profile_links).filter(([_, v]) => v !== "")
                ),
            });
            onComplete();
        } catch (err: any) {
            const data = err?.response?.data;
            if (data) {
                const firstKey = Object.keys(data).find((k) => k !== "message");
                if (firstKey) {
                    const fieldError = data[firstKey];
                    if (Array.isArray(fieldError)) {
                        setError(`${firstKey}: ${fieldError[0]}`);
                    } else if (typeof fieldError === "object") {
                        const firstIndexError = Object.values(fieldError)[0] as string[];
                        setError(`${firstKey}: ${firstIndexError[0]}`);
                    } else {
                        setError(String(fieldError));
                    }
                } else {
                    setError("Failed to save profile. Please try again.");
                }
            } else {
                setError("Failed to save profile. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
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
                screenwriter profile
            </p>

            <h1
                style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "40px",
                    fontWeight: 300,
                    color: "var(--cream)",
                    marginBottom: "8px",
                    lineHeight: 1.1,
                }}
            >
                Build your profile.
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
                Fill in what you can. Everything can be updated from your
                profile page later.
            </p>

            {error && (
                <p
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        color: "#e57373",
                        marginBottom: "24px",
                    }}
                >
                    {error}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                style={{ display: "flex", flexDirection: "column", gap: "28px" }}
            >
                {/* Core — always visible */}
                <Dropdown
                    options={choices.guild_status}
                    value={form.guild_status}
                    onChange={(v) => set("guild_status", String(v))}
                    placeholder="Guild Status"
                    optional
                />
                <MultiDropdownTagInput
                    label="Languages"
                    options={choices.languages}
                    value={form.languages}
                    onChange={(v) => set("languages", v)}
                />
                <MultiDropdownTagInput
                    label="Genres"
                    options={choices.genre_choices}
                    value={form.genres}
                    onChange={(v) => set("genres", v)}
                />
                <MultiDropdownTagInput
                    label="Formats"
                    options={choices.format_choices}
                    value={form.formats}
                    onChange={(v) => set("formats", v)}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <label style={labelStyle}>Representation</label>
                    <input
                        type="text"
                        value={form.representation}
                        onChange={(e) => set("representation", e.target.value)}
                        style={inputStyle}
                    />
                </div>
                <Toggle
                    label="Remote Capable"
                    value={form.remote_capable}
                    onChange={(v) => set("remote_capable", v)}
                />

                {/* Style & Voice */}
                <Collapsible title="Style & Voice">
                    <Dropdown
                        options={choices.writing_style}
                        value={form.writing_style}
                        onChange={(v) => set("writing_style", String(v))}
                        placeholder="Writing Style"
                        optional
                    />
                    <Dropdown
                        options={choices.structural_approach}
                        value={form.structural_approach}
                        onChange={(v) => set("structural_approach", String(v))}
                        placeholder="Structural Approach"
                        optional
                    />
                    <TagInput
                        label="Thematic Interests"
                        value={form.thematic_interests}
                        onChange={(v) => set("thematic_interests", v)}
                    />
                    <TagInput
                        label="Influences"
                        value={form.influences}
                        onChange={(v) => set("influences", v)}
                    />
                </Collapsible>

                {/* Experience */}
                <Collapsible title="Experience">
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={labelStyle}>Years Experience</label>
                        <input
                            type="number"
                            value={form.years_experience}
                            onChange={(e) => set("years_experience", e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <Toggle
                        label="Feature Credits"
                        value={form.has_feature_credits}
                        onChange={(v) => set("has_feature_credits", v)}
                    />
                    <Toggle
                        label="TV Credits"
                        value={form.has_tv_credits}
                        onChange={(v) => set("has_tv_credits", v)}
                    />
                    <Toggle
                        label="Theatre Credits"
                        value={form.has_theatre_credits}
                        onChange={(v) => set("has_theatre_credits", v)}
                    />
                    <Toggle
                        label="Documentary Credits"
                        value={form.has_documentary_credits}
                        onChange={(v) => set("has_documentary_credits", v)}
                    />
                    <Toggle
                        label="Short Film Credits"
                        value={form.has_short_credits}
                        onChange={(v) => set("has_short_credits", v)}
                    />
                    <Toggle
                        label="Podcast Credits"
                        value={form.has_podcast_credits}
                        onChange={(v) => set("has_podcast_credits", v)}
                    />
                    <Toggle
                        label="Produced Credits"
                        value={form.has_produced_credits}
                        onChange={(v) => set("has_produced_credits", v)}
                    />
                    <Toggle
                        label="Has Spec Scripts"
                        value={form.has_spec_scripts}
                        onChange={(v) => set("has_spec_scripts", v)}
                    />
                    <Toggle
                        label="Adaptation Experience"
                        value={form.adaptation_experience}
                        onChange={(v) => set("adaptation_experience", v)}
                    />
                    <Toggle
                        label="Optioned Scripts"
                        value={form.has_optioned_scripts}
                        onChange={(v) => set("has_optioned_scripts", v)}
                    />
                    <Toggle
                        label="Sold Scripts"
                        value={form.has_sold_scripts}
                        onChange={(v) => set("has_sold_scripts", v)}
                    />
                </Collapsible>

                {/* Awards & Recognition */}
                <Collapsible title="Awards & Recognition">
                    <TagInput
                        label="Awards"
                        value={form.awards}
                        onChange={(v) => set("awards", v)}
                    />
                    <TagInput
                        label="Fellowships"
                        value={form.fellowships}
                        onChange={(v) => set("fellowships", v)}
                    />
                </Collapsible>

                {/* Links */}
                <Collapsible title="Links & Credits">
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={labelStyle}>Reel URL</label>
                        <input
                            type="url"
                            value={form.reel_url}
                            onChange={(e) => set("reel_url", e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        <label style={labelStyle}>IMDb URL</label>
                        <input
                            type="url"
                            value={form.imdb_url}
                            onChange={(e) => set("imdb_url", e.target.value)}
                            style={inputStyle}
                        />
                    </div>
                    <TagInput
                        label="Past Works (URLs)"
                        value={form.past_works}
                        onChange={(v) => set("past_works", v)}
                    />
                    {[
                        { label: "LinkedIn", key: "linkedin" },
                        { label: "Instagram", key: "instagram" },
                        { label: "YouTube", key: "youtube" },
                        { label: "Personal Website", key: "website" },
                    ].map(({ label, key }) => (
                        <div key={key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={labelStyle}>{label}</label>
                            <input
                                type="url"
                                value={form.profile_links[key as keyof typeof form.profile_links]}
                                onChange={(e) =>
                                    set("profile_links", {
                                        ...form.profile_links,
                                        [key]: e.target.value,
                                    })
                                }
                                style={inputStyle}
                            />
                        </div>
                    ))}
                </Collapsible>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            background: isLoading ? "transparent" : "var(--gold-accent)",
                            color: isLoading ? "var(--cream-muted)" : "var(--ink)",
                            border: "1px solid var(--gold-accent)",
                            padding: "16px 32px",
                            cursor: isLoading ? "not-allowed" : "pointer",
                            transition: "all 0.3s ease",
                            width: "100%",
                        }}
                    >
                        {isLoading ? "saving..." : "complete profile"}
                    </button>

                    <button
                        type="button"
                        onClick={onSkip}
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            background: "transparent",
                            color: "var(--cream-muted)",
                            border: "none",
                            padding: "8px",
                            cursor: "pointer",
                            width: "100%",
                        }}
                    >
                        skip for now
                    </button>
                </div>
            </form>
        </>
    );
}