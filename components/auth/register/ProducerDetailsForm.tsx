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

interface ProducerChoices {
    union_status: Option[];
    languages: Option[];
    genre_choices: Option[];
    format_choices: Option[];
    producer_type: Option[];
    budget_tier: Option[];
    funding_sources: Option[];
}

interface ProducerData {
    union_status: string;
    languages: string[];
    producer_type: string;
    budget_tier: string;
    willing_to_travel: boolean;
    remote_capable: boolean;
    distribution_experience: boolean;
    genres: string[];
    formats: string[];
    funding_sources: string[];
    territories: string[];
    has_distribution_deals: boolean;
    has_broadcast_relationships: boolean;
    has_streaming_relationships: boolean;
    has_completion_bond_experience: boolean;
    has_co_production_experience: boolean;
    years_experience: string;
    largest_budget_managed: string;
    largest_crew_managed: string;
    has_feature_credits: boolean;
    has_tv_credits: boolean;
    has_theatre_credits: boolean;
    has_documentary_credits: boolean;
    has_commercial_credits: boolean;
    has_production_company: boolean;
    production_company_name: string;
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

export default function ProducerDetailsForm({ onComplete, onSkip }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [choices, setChoices] = useState<ProducerChoices>({
        union_status: [],
        languages: [],
        genre_choices: [],
        format_choices: [],
        producer_type: [],
        budget_tier: [],
        funding_sources: [],
    });

    useEffect(() => {
        api.get("/api/v1/profile/producer/choices/")
            .then((res) => setChoices(res.data))
            .catch(() => {});
    }, []);

    const [form, setForm] = useState<ProducerData>({
        union_status: "",
        languages: [],
        producer_type: "",
        budget_tier: "",
        willing_to_travel: false,
        remote_capable: false,
        distribution_experience: false,
        genres: [],
        formats: [],
        funding_sources: [],
        territories: [],
        has_distribution_deals: false,
        has_broadcast_relationships: false,
        has_streaming_relationships: false,
        has_completion_bond_experience: false,
        has_co_production_experience: false,
        years_experience: "",
        largest_budget_managed: "",
        largest_crew_managed: "",
        has_feature_credits: false,
        has_tv_credits: false,
        has_theatre_credits: false,
        has_documentary_credits: false,
        has_commercial_credits: false,
        has_production_company: false,
        production_company_name: "",
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

    const set = (key: keyof ProducerData, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await api.post("/api/v1/profile/producer/", {
                ...form,
                years_experience: form.years_experience
                    ? parseInt(form.years_experience)
                    : null,
                largest_crew_managed: form.largest_crew_managed
                    ? parseInt(form.largest_crew_managed)
                    : null,
                largest_budget_managed: form.largest_budget_managed || null,
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
                producer profile
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
                    options={choices.union_status}
                    value={form.union_status}
                    onChange={(v) => set("union_status", String(v))}
                    placeholder="Union / Guild Status"
                    optional
                />
                <Dropdown
                    options={choices.producer_type}
                    value={form.producer_type}
                    onChange={(v) => set("producer_type", String(v))}
                    placeholder="Producer Type"
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
                <Toggle
                    label="Willing to Travel"
                    value={form.willing_to_travel}
                    onChange={(v) => set("willing_to_travel", v)}
                />
                <Toggle
                    label="Remote Capable"
                    value={form.remote_capable}
                    onChange={(v) => set("remote_capable", v)}
                />

                {/* Finance & Business */}
                <Collapsible title="Finance & Business">
                    <Dropdown
                        options={choices.budget_tier}
                        value={form.budget_tier}
                        onChange={(v) => set("budget_tier", String(v))}
                        placeholder="Typical Budget Tier"
                        optional
                    />
                    <Dropdown
                        options={choices.budget_tier}
                        value={form.largest_budget_managed}
                        onChange={(v) => set("largest_budget_managed", String(v))}
                        placeholder="Largest Budget Managed"
                        optional
                    />
                    <MultiDropdownTagInput
                        label="Funding Sources"
                        options={choices.funding_sources}
                        value={form.funding_sources}
                        onChange={(v) => set("funding_sources", v)}
                    />
                    <TagInput
                        label="Territories"
                        value={form.territories}
                        onChange={(v) => set("territories", v)}
                    />
                    <Toggle
                        label="Distribution Experience"
                        value={form.distribution_experience}
                        onChange={(v) => set("distribution_experience", v)}
                    />
                    <Toggle
                        label="Has Distribution Deals"
                        value={form.has_distribution_deals}
                        onChange={(v) => set("has_distribution_deals", v)}
                    />
                    <Toggle
                        label="Broadcast Relationships"
                        value={form.has_broadcast_relationships}
                        onChange={(v) => set("has_broadcast_relationships", v)}
                    />
                    <Toggle
                        label="Streaming Relationships"
                        value={form.has_streaming_relationships}
                        onChange={(v) => set("has_streaming_relationships", v)}
                    />
                    <Toggle
                        label="Completion Bond Experience"
                        value={form.has_completion_bond_experience}
                        onChange={(v) => set("has_completion_bond_experience", v)}
                    />
                    <Toggle
                        label="Co-Production Experience"
                        value={form.has_co_production_experience}
                        onChange={(v) => set("has_co_production_experience", v)}
                    />
                </Collapsible>

                {/* Experience */}
                <Collapsible title="Experience">
                    <div style={{ display: "flex", gap: "24px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                            <label style={labelStyle}>Years Experience</label>
                            <input
                                type="number"
                                value={form.years_experience}
                                onChange={(e) => set("years_experience", e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                            <label style={labelStyle}>Largest Crew Managed</label>
                            <input
                                type="number"
                                value={form.largest_crew_managed}
                                onChange={(e) => set("largest_crew_managed", e.target.value)}
                                style={inputStyle}
                            />
                        </div>
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
                        label="Commercial Credits"
                        value={form.has_commercial_credits}
                        onChange={(v) => set("has_commercial_credits", v)}
                    />
                </Collapsible>

                {/* Production Company */}
                <Collapsible title="Production Company">
                    <Toggle
                        label="Has Production Company"
                        value={form.has_production_company}
                        onChange={(v) => set("has_production_company", v)}
                    />
                    {form.has_production_company && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={labelStyle}>Company Name</label>
                            <input
                                type="text"
                                value={form.production_company_name}
                                onChange={(e) => set("production_company_name", e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    )}
                </Collapsible>

                {/* Links */}
                <Collapsible title="Links & Credits">
                    {[
                        { label: "Reel URL", key: "reel_url", type: "url" },
                        { label: "IMDb URL", key: "imdb_url", type: "url" },
                    ].map(({ label, key, type }) => (
                        <div key={key} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <label style={labelStyle}>{label}</label>
                            <input
                                type={type}
                                value={form[key as keyof ProducerData] as string}
                                onChange={(e) => set(key as keyof ProducerData, e.target.value)}
                                style={inputStyle}
                            />
                        </div>
                    ))}
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