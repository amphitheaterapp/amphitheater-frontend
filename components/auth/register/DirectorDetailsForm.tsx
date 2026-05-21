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

interface DirectorChoices {
    union_status: Option[];
    languages: Option[];
    narrative_style: Option[];
    shooting_style: Option[];
    color_philosophy: Option[];
    works_with_actors_approach: Option[];
    genre_choices: Option[];
    format_choices: Option[];
    camera_systems: Option[];
}

interface DirectorData {
    // Common
    union_status: string;
    languages: string[];
    willing_to_travel: boolean;
    remote_capable: boolean;
    has_own_equipment: boolean;
    // Style
    narrative_style: string[];
    shooting_style: string[];
    color_philosophy: string[];
    works_with_actors_approach: string[];
    visual_references: string[];
    // Genres & Formats
    genres: string[];
    formats: string[];
    camera_systems: string[];
    // Experience
    years_experience: string;
    has_feature_credits: boolean;
    has_tv_credits: boolean;
    has_theatre_credits: boolean;
    has_documentary_credits: boolean;
    has_commercial_credits: boolean;
    has_music_video_credits: boolean;
    longest_project_runtime_mins: string;
    largest_crew_managed: string;
    past_budget_max: string;
    // Production company
    has_production_company: boolean;
    production_company_name: string;
    // Links
    reel_url: string;
    imdb_url: string;
    past_works: string[];
}

interface Props {
    onComplete: () => void;
    onSkip: () => void;
}

export default function DirectorDetailsForm({ onComplete, onSkip }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [choices, setChoices] = useState<DirectorChoices>({
        union_status: [],
        languages: [],
        narrative_style: [],
        shooting_style: [],
        color_philosophy: [],
        works_with_actors_approach: [],
        genre_choices: [],
        format_choices: [],
        camera_systems: [],
    });

    useEffect(() => {
        api.get("/api/v1/profile/director/choices/")
            .then((res) => setChoices(res.data))
            .catch(() => {});
    }, []);

    const [form, setForm] = useState<DirectorData>({
        union_status: "",
        languages: [],
        willing_to_travel: false,
        remote_capable: false,
        has_own_equipment: false,
        narrative_style: [],
        shooting_style: [],
        color_philosophy: [],
        works_with_actors_approach: [],
        visual_references: [],
        genres: [],
        formats: [],
        camera_systems: [],
        years_experience: "",
        has_feature_credits: false,
        has_tv_credits: false,
        has_theatre_credits: false,
        has_documentary_credits: false,
        has_commercial_credits: false,
        has_music_video_credits: false,
        longest_project_runtime_mins: "",
        largest_crew_managed: "",
        past_budget_max: "",
        has_production_company: false,
        production_company_name: "",
        reel_url: "",
        imdb_url: "",
        past_works: [],
    });

    const set = (key: keyof DirectorData, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await api.post("/api/v1/profile/director/", {
                ...form,
                years_experience: form.years_experience
                    ? parseInt(form.years_experience)
                    : null,
                longest_project_runtime_mins: form.longest_project_runtime_mins
                    ? parseInt(form.longest_project_runtime_mins)
                    : null,
                largest_crew_managed: form.largest_crew_managed
                    ? parseInt(form.largest_crew_managed)
                    : null,
                profile_links: {},
            });
            onComplete();
        } catch (err: any) {
            const data = err?.response?.data;
            if (data) {
                // Find the first field error and show it
                const firstKey = Object.keys(data).find((k) => k !== "message");
                if (firstKey) {
                    const fieldError = data[firstKey];
                    // Handle both array errors (["msg"]) and indexed errors ({"0": ["msg"]})
                    if (Array.isArray(fieldError)) {
                        setError(`${firstKey}: ${fieldError[0]}`);
                    } else if (typeof fieldError === "object") {
                        const firstIndexError = Object.values(
                            fieldError,
                        )[0] as string[];
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
                director profile
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
                Build your profile
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
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "28px",
                }}
            >
                {/*Core*/}
                <Dropdown
                    options={choices.union_status}
                    value={form.union_status}
                    onChange={(v) => set("union_status", String(v))}
                    placeholder="Union Status"
                    optional
                />

                <MultiDropdownTagInput
                    label="Languages"
                    options={choices.languages}
                    value={form.languages}
                    onChange={(v) => set("languages", v)}
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
                <Toggle
                    label="Has Own Equipment"
                    value={form.has_own_equipment}
                    onChange={(v) => set("has_own_equipment", v)}
                />

                {/*Style & Creative*/}
                <Collapsible title="Style & Creative">
                    <MultiDropdownTagInput
                        label="Narrative Style"
                        options={choices.narrative_style}
                        value={form.narrative_style}
                        onChange={(v) => set("narrative_style", v)}
                    />
                    <MultiDropdownTagInput
                        label="Shooting Style"
                        options={choices.shooting_style}
                        value={form.shooting_style}
                        onChange={(v) => set("shooting_style", v)}
                    />
                    <MultiDropdownTagInput
                        label="Color Philosophy"
                        options={choices.color_philosophy}
                        value={form.color_philosophy}
                        onChange={(v) => set("color_philosophy", v)}
                    />
                    <MultiDropdownTagInput
                        label="Works With Actors"
                        options={choices.works_with_actors_approach}
                        value={form.works_with_actors_approach}
                        onChange={(v) => set("works_with_actors_approach", v)}
                    />
                    <TagInput
                        label="Visual References"
                        value={form.visual_references}
                        onChange={(v) => set("visual_references", v)}
                    />
                </Collapsible>

                {/*Genres, Formats & Camera*/}
                <Collapsible title="Genres, Formats & Camera">
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
                    <MultiDropdownTagInput
                        label="Camera Systems"
                        options={choices.camera_systems}
                        value={form.camera_systems}
                        onChange={(v) => set("camera_systems", v)}
                    />
                </Collapsible>

                {/*Experience*/}
                <Collapsible title="Experience">
                    <div style={{ display: "flex", gap: "16px" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                flex: 1,
                            }}
                        >
                            <label style={labelStyle}>Years Experience</label>
                            <input
                                type="number"
                                value={form.years_experience}
                                onChange={(e) =>
                                    set("years_experience", e.target.value)
                                }
                                style={inputStyle}
                            />
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                flex: 1,
                            }}
                        >
                            <label style={labelStyle}>
                                Largest Crew Managed
                            </label>
                            <input
                                type="number"
                                value={form.largest_crew_managed}
                                onChange={(e) =>
                                    set("largest_crew_managed", e.target.value)
                                }
                                style={inputStyle}
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
                        <label style={labelStyle}>
                            Longest Project Runtime (mins)
                        </label>
                        <input
                            type="number"
                            value={form.longest_project_runtime_mins}
                            onChange={(e) =>
                                set(
                                    "longest_project_runtime_mins",
                                    e.target.value,
                                )
                            }
                            style={inputStyle}
                        />
                    </div>

                    <Dropdown
                        options={[
                            { label: "Micro (under $10K)", value: "micro" },
                            { label: "Low ($10K-$100K)", value: "low" },
                            { label: "Mid ($100K-$1M)", value: "mid" },
                            { label: "High ($1M-$10M)", value: "high" },
                            { label: "Studio ($10M+)", value: "studio" },
                        ]}
                        value={form.past_budget_max}
                        onChange={(v) => set("past_budget_max", String(v))}
                        placeholder="Past Budget Max"
                        optional
                    />

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
                    <Toggle
                        label="Music Video Credits"
                        value={form.has_music_video_credits}
                        onChange={(v) => set("has_music_video_credits", v)}
                    />
                </Collapsible>

                {/*Production Company*/}
                <Collapsible title="Production Company">
                    <Toggle
                        label="Has Production Company"
                        value={form.has_production_company}
                        onChange={(v) => set("has_production_company", v)}
                    />
                    {form.has_production_company && (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <label style={labelStyle}>Company Name</label>
                            <input
                                type="text"
                                value={form.production_company_name}
                                onChange={(e) =>
                                    set(
                                        "production_company_name",
                                        e.target.value,
                                    )
                                }
                                style={inputStyle}
                            />
                        </div>
                    )}
                </Collapsible>

                {/*Links*/}
                <Collapsible title="Links & Credits">
                    {[
                        { label: "Reel URL", key: "reel_url", type: "url" },
                        { label: "IMDb URL", key: "imdb_url", type: "url" },
                    ].map(({ label, key, type }) => (
                        <div
                            key={key}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <label style={labelStyle}>{label}</label>
                            <input
                                type={type}
                                value={
                                    form[key as keyof DirectorData] as string
                                }
                                onChange={(e) =>
                                    set(
                                        key as keyof DirectorData,
                                        e.target.value,
                                    )
                                }
                                style={inputStyle}
                            />
                        </div>
                    ))}
                    <TagInput
                        label="Past Works (URLs)"
                        value={form.past_works}
                        onChange={(v) => set("past_works", v)}
                    />
                </Collapsible>

                {/*Actions*/}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        marginTop: "8px",
                    }}
                >
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "11px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            background: isLoading
                                ? "transparent"
                                : "var(--gold-accent)",
                            color: isLoading
                                ? "var(--cream-muted)"
                                : "var(--ink)",
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
