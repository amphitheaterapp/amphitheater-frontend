// components/auth/register/ActorDetailsForm.tsx

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/axios";

import MultiDropdownTagInput from "@/components/common/MultiDropdownTagInput";
import Collapsible from "@/components/common/Collapsible";
import Dropdown from "@/components/common/Dropdown";
import TagInput from "@/components/common/TagInput";
import Toggle from "@/components/common/Toggle";

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

interface ActorChoices {
    union_status: Option[];
    languages: Option[];
    singing_voice: Option[];
    eye_color: Option[];
    hair_color: Option[];
    hair_length: Option[];
    body_type: Option[];
    ethnicity: Option[];
    skin_tone: Option[];
    facial_hair: Option[];
    nudity_comfort: Option[];
}

interface ActorData {
    union_status: string;
    age_range_min: string;
    age_range_max: string;
    languages: string[];
    accents: string[];
    special_skills: string[];
    willing_to_travel: boolean;
    has_valid_passport: boolean;
    nudity_comfort: string;
    height_cm: string;
    weight_kg: string;
    eye_color: string;
    hair_color: string;
    hair_length: string;
    body_type: string;
    ethnicity: string;
    skin_tone: string;
    facial_hair: string;
    visible_tattoos: boolean;
    visible_piercings: boolean;
    dance_styles: string[];
    instrument_skills: string[];
    combat_styles: string[];
    sport_skills: string[];
    singing_voice_type: string[];
    stunt_certified: boolean;
    has_vehicle: boolean;
    can_drive_manual: boolean;
    reel_url: string;
    imdb_url: string;
    representation: string;
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

export default function ActorDetailsForm({ onComplete, onSkip }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [choices, setChoices] = useState<ActorChoices>({
        union_status: [],
        languages: [],
        singing_voice: [],
        eye_color: [],
        hair_color: [],
        hair_length: [],
        body_type: [],
        ethnicity: [],
        skin_tone: [],
        facial_hair: [],
        nudity_comfort: [],
    });

    useEffect(() => {
        api.get("/api/v1/profile/actor/choices/")
            .then((res) => setChoices(res.data))
            .catch(() => {});
    }, []);

    const [form, setForm] = useState<ActorData>({
        union_status: "",
        age_range_min: "",
        age_range_max: "",
        languages: [],
        accents: [],
        special_skills: [],
        willing_to_travel: false,
        has_valid_passport: false,
        nudity_comfort: "",
        height_cm: "",
        weight_kg: "",
        eye_color: "",
        hair_color: "",
        hair_length: "",
        body_type: "",
        ethnicity: "",
        skin_tone: "",
        facial_hair: "",
        visible_tattoos: false,
        visible_piercings: false,
        dance_styles: [],
        instrument_skills: [],
        combat_styles: [],
        sport_skills: [],
        singing_voice_type: [],
        stunt_certified: false,
        has_vehicle: false,
        can_drive_manual: false,
        reel_url: "",
        imdb_url: "",
        representation: "",
        past_works: [],
        profile_links: {
            linkedin: "",
            instagram: "",
            youtube: "",
            website: "",
        },
    });

    const set = (key: keyof ActorData, value: any) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            await api.post("/api/v1/profile/actor/", {
                ...form,
                age_range_min: form.age_range_min
                    ? parseInt(form.age_range_min)
                    : null,
                age_range_max: form.age_range_max
                    ? parseInt(form.age_range_max)
                    : null,
                height_cm: form.height_cm ? parseInt(form.height_cm) : null,
                weight_kg: form.weight_kg ? parseInt(form.weight_kg) : null,
                profile_links: Object.fromEntries(
                    Object.entries(form.profile_links).filter(([_, v]) => v !== "")
                ),
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
                actor profile
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
                {/*  Core  */}
                <Dropdown
                    options={choices.union_status}
                    value={form.union_status}
                    onChange={(v) => set("union_status", String(v))}
                    placeholder="Union Status"
                    optional
                />

                <div style={{ display: "flex", gap: "16px" }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                            flex: 1,
                        }}
                    >
                        <label style={labelStyle}>Age Range Min</label>
                        <input
                            type="number"
                            value={form.age_range_min}
                            onChange={(e) =>
                                set("age_range_min", e.target.value)
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
                        <label style={labelStyle}>Age Range Max</label>
                        <input
                            type="number"
                            value={form.age_range_max}
                            onChange={(e) =>
                                set("age_range_max", e.target.value)
                            }
                            style={inputStyle}
                        />
                    </div>
                </div>

                <MultiDropdownTagInput
                    label="Languages"
                    options={choices.languages}
                    value={form.languages}
                    onChange={(v) => set("languages", v)}
                />
                <TagInput
                    label="Accents"
                    value={form.accents}
                    onChange={(v) => set("accents", v)}
                />
                <TagInput
                    label="Special Skills"
                    value={form.special_skills}
                    onChange={(v) => set("special_skills", v)}
                />

                <Toggle
                    label="Willing to Travel"
                    value={form.willing_to_travel}
                    onChange={(v) => set("willing_to_travel", v)}
                />
                <Toggle
                    label="Has Valid Passport"
                    value={form.has_valid_passport}
                    onChange={(v) => set("has_valid_passport", v)}
                />

                <Dropdown
                    options={choices.nudity_comfort}
                    value={form.nudity_comfort}
                    onChange={(v) => set("nudity_comfort", String(v))}
                    placeholder="Nudity Comfort"
                />

                {/*  Physical  */}
                <Collapsible title="Physical Attributes">
                    <div style={{ display: "flex", gap: "16px" }}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                                flex: 1,
                            }}
                        >
                            <label style={labelStyle}>Height (cm)</label>
                            <input
                                type="number"
                                value={form.height_cm}
                                onChange={(e) =>
                                    set("height_cm", e.target.value)
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
                            <label style={labelStyle}>Weight (kg)</label>
                            <input
                                type="number"
                                value={form.weight_kg}
                                onChange={(e) =>
                                    set("weight_kg", e.target.value)
                                }
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <Dropdown
                        options={choices.eye_color}
                        value={form.eye_color}
                        onChange={(v) => set("eye_color", String(v))}
                        placeholder="Eye Color"
                        optional
                    />
                    <Dropdown
                        options={choices.hair_color}
                        value={form.hair_color}
                        onChange={(v) => set("hair_color", String(v))}
                        placeholder="Hair Color"
                        optional
                    />
                    <Dropdown
                        options={choices.hair_length}
                        value={form.hair_length}
                        onChange={(v) => set("hair_length", String(v))}
                        placeholder="Hair Length"
                        optional
                    />
                    <Dropdown
                        options={choices.body_type}
                        value={form.body_type}
                        onChange={(v) => set("body_type", String(v))}
                        placeholder="Body Type"
                        optional
                    />
                    <Dropdown
                        options={choices.ethnicity}
                        value={form.ethnicity}
                        onChange={(v) => set("ethnicity", String(v))}
                        placeholder="Ethnicity"
                        optional
                    />
                    <Dropdown
                        options={choices.skin_tone}
                        value={form.skin_tone}
                        onChange={(v) => set("skin_tone", String(v))}
                        placeholder="Skin Tone"
                        optional
                    />
                    <Dropdown
                        options={choices.facial_hair}
                        value={form.facial_hair}
                        onChange={(v) => set("facial_hair", String(v))}
                        placeholder="Facial Hair"
                        optional
                    />

                    <Toggle
                        label="Visible Tattoos"
                        value={form.visible_tattoos}
                        onChange={(v) => set("visible_tattoos", v)}
                    />
                    <Toggle
                        label="Visible Piercings"
                        value={form.visible_piercings}
                        onChange={(v) => set("visible_piercings", v)}
                    />
                </Collapsible>

                {/*  Performance  */}
                <Collapsible title="Performance">
                    <TagInput
                        label="Dance Styles"
                        value={form.dance_styles}
                        onChange={(v) => set("dance_styles", v)}
                    />
                    <TagInput
                        label="Instrument Skills"
                        value={form.instrument_skills}
                        onChange={(v) => set("instrument_skills", v)}
                    />
                    <TagInput
                        label="Combat Styles"
                        value={form.combat_styles}
                        onChange={(v) => set("combat_styles", v)}
                    />
                    <TagInput
                        label="Sport Skills"
                        value={form.sport_skills}
                        onChange={(v) => set("sport_skills", v)}
                    />
                    <MultiDropdownTagInput
                        label="Singing Voice Type"
                        options={choices.singing_voice}
                        value={form.singing_voice_type}
                        onChange={(v) => set("singing_voice_type", v)}
                    />
                    <Toggle
                        label="Stunt Certified"
                        value={form.stunt_certified}
                        onChange={(v) => set("stunt_certified", v)}
                    />
                    <Toggle
                        label="Has Vehicle"
                        value={form.has_vehicle}
                        onChange={(v) => set("has_vehicle", v)}
                    />
                    <Toggle
                        label="Can Drive Manual"
                        value={form.can_drive_manual}
                        onChange={(v) => set("can_drive_manual", v)}
                    />
                </Collapsible>

                {/*  Links & Credits  */}
                <Collapsible title="Links & Credits">
                    {[
                        { label: "Reel URL", key: "reel_url", type: "url" },
                        { label: "IMDb URL", key: "imdb_url", type: "url" },
                        {
                            label: "Representation",
                            key: "representation",
                            type: "text",
                        },
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
                                value={form[key as keyof ActorData] as string}
                                onChange={(e) =>
                                    set(key as keyof ActorData, e.target.value)
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

                {/*  Actions  */}
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