// components/auth/register/ActorDetailsForm.tsx

"use client";

import { useState } from "react";
import api from "@/lib/axios";
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
    singing_voice_type: string;
    stunt_certified: boolean;
    has_vehicle: boolean;
    can_drive_manual: boolean;
    reel_url: string;
    imdb_url: string;
    representation: string;
    past_works: string[];
}

interface CollapsibleProps {
    title: string;
    children: React.ReactNode;
}

function Collapsible({ title, children }: CollapsibleProps) {
    const [open, setOpen] = useState(false);

    return (
        <div
            style={{
                borderTop: "1px solid rgba(212,185,106,0.15)",
                paddingTop: "20px",
            }}
        >
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    padding: 0,
                }}
            >
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "10px",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                        color: "var(--gold-accent)",
                    }}
                >
                    {title}
                </span>
                <span
                    style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "16px",
                        color: "var(--gold-accent)",
                        transition: "transform 0.2s ease",
                        transform: open ? "rotate(45deg)" : "rotate(0deg)",
                    }}
                >
                    +
                </span>
            </button>

            {open && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "24px",
                        marginTop: "24px",
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

interface Props {
    onComplete: () => void;
    onSkip: () => void;
}

export default function ActorDetailsForm({ onComplete, onSkip }: Props) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState<ActorData>({
        union_status: "",
        age_range_min: "",
        age_range_max: "",
        languages: [],
        accents: [],
        special_skills: [],
        willing_to_travel: false,
        has_valid_passport: false,
        nudity_comfort: "none",
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
        singing_voice_type: "",
        stunt_certified: false,
        has_vehicle: false,
        can_drive_manual: false,
        reel_url: "",
        imdb_url: "",
        representation: "",
        past_works: [],
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
                profile_links: {},
            });
            onComplete();
        } catch {
            setError("Failed to save profile. Please try again.");
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
                    options={[
                        { label: "SAG-AFTRA", value: "sag_aftra" },
                        { label: "IATSE", value: "iatse" },
                        { label: "Non-Union", value: "non_union" },
                        { label: "Fi-Core", value: "fi_core" },
                    ]}
                    value={form.union_status}
                    onChange={(v) => set("union_status", String(v))}
                    placeholder="Union Status"
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

                <TagInput
                    label="Languages"
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
                    options={[
                        { label: "None", value: "none" },
                        { label: "Implied", value: "implied" },
                        { label: "Partial", value: "partial" },
                        { label: "Full", value: "full" },
                    ]}
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
                        options={[
                            { label: "Brown", value: "brown" },
                            { label: "Blue", value: "blue" },
                            { label: "Hazel", value: "hazel" },
                            { label: "Amber", value: "amber" },
                            { label: "Gray", value: "gray" },
                            { label: "Green", value: "green" },
                            { label: "Violet", value: "violet" },
                            { label: "Red", value: "red" },
                            { label: "Black", value: "black" },
                        ]}
                        value={form.eye_color}
                        onChange={(v) => set("eye_color", String(v))}
                        placeholder="Eye Color"
                    />
                    <Dropdown
                        options={[
                            { label: "Black", value: "black" },
                            { label: "Dark Brown", value: "dark_brown" },
                            { label: "Brown", value: "brown" },
                            { label: "Light Brown", value: "light_brown" },
                            { label: "Dirty Blonde", value: "dirty_blonde" },
                            { label: "Blonde", value: "blonde" },
                            {
                                label: "Platinum Blonde",
                                value: "platinum_blonde",
                            },
                            {
                                label: "Strawberry Blonde",
                                value: "strawberry_blonde",
                            },
                            { label: "Auburn", value: "auburn" },
                            { label: "Red", value: "red" },
                            { label: "Gray", value: "gray" },
                            { label: "White", value: "white" },
                            {
                                label: "Salt and Pepper",
                                value: "salt_and_pepper",
                            },
                            { label: "Other", value: "other" },
                        ]}
                        value={form.hair_color}
                        onChange={(v) => set("hair_color", String(v))}
                        placeholder="Hair Color"
                    />
                    <Dropdown
                        options={[
                            { label: "Bald", value: "bald" },
                            { label: "Buzzed", value: "buzzed" },
                            { label: "Short", value: "short" },
                            { label: "Ear Length", value: "ear_length" },
                            { label: "Chin Length", value: "chin_length" },
                            {
                                label: "Shoulder Length",
                                value: "shoulder_length",
                            },
                            { label: "Armpit Length", value: "armpit_length" },
                            {
                                label: "Mid-Back Length",
                                value: "mid_back_length",
                            },
                            { label: "Waist Length", value: "waist_length" },
                            { label: "Hip Length", value: "hip_length" },
                            {
                                label: "Tailbone Length",
                                value: "tailbone_length",
                            },
                            { label: "Floor Length", value: "floor_length" },
                        ]}
                        value={form.hair_length}
                        onChange={(v) => set("hair_length", String(v))}
                        placeholder="Hair Length"
                    />
                    <Dropdown
                        options={[
                            { label: "Thin", value: "thin" },
                            { label: "Slim", value: "slim" },
                            { label: "Slender", value: "slender" },
                            { label: "Average", value: "average" },
                            { label: "Athletic", value: "athletic" },
                            { label: "Toned", value: "toned" },
                            { label: "Muscular", value: "muscular" },
                            { label: "Stocky", value: "stocky" },
                            { label: "Curvy", value: "curvy" },
                            { label: "Plus Size", value: "plus_size" },
                            { label: "Large", value: "large" },
                            { label: "Heavyset", value: "heavyset" },
                        ]}
                        value={form.body_type}
                        onChange={(v) => set("body_type", String(v))}
                        placeholder="Body Type"
                    />
                    <Dropdown
                        options={[
                            {
                                label: "American Indian or Alaska Native",
                                value: "american_indian_alaska_native",
                            },
                            { label: "Asian", value: "asian" },
                            {
                                label: "Black or African American",
                                value: "black_african_american",
                            },
                            {
                                label: "Hispanic or Latino",
                                value: "hispanic_latino",
                            },
                            {
                                label: "Middle Eastern or North African",
                                value: "middle_eastern_north_african",
                            },
                            {
                                label: "Native Hawaiian or Pacific Islander",
                                value: "native_hawaiian_pacific_islander",
                            },
                            { label: "White", value: "white" },
                            { label: "Other", value: "other" },
                            {
                                label: "Prefer not to say",
                                value: "prefer_not_to_say",
                            },
                        ]}
                        value={form.ethnicity}
                        onChange={(v) => set("ethnicity", String(v))}
                        placeholder="Ethnicity"
                    />
                    <Dropdown
                        options={[
                            { label: "Porcelain", value: "porcelain" },
                            { label: "Fair", value: "fair" },
                            { label: "Light", value: "light" },
                            { label: "Medium", value: "medium" },
                            { label: "Tan", value: "tan" },
                            { label: "Olive", value: "olive" },
                            { label: "Brown", value: "brown" },
                            { label: "Dark", value: "dark" },
                            { label: "Deep", value: "deep" },
                            { label: "Ebony", value: "ebony" },
                        ]}
                        value={form.skin_tone}
                        onChange={(v) => set("skin_tone", String(v))}
                        placeholder="Skin Tone"
                    />
                    <Dropdown
                        options={[
                            { label: "None", value: "none" },
                            { label: "Stubble", value: "stubble" },
                            { label: "Moustache", value: "moustache" },
                            { label: "Goatee", value: "goatee" },
                            { label: "Beard", value: "beard" },
                            { label: "Full Beard", value: "full_beard" },
                        ]}
                        value={form.facial_hair}
                        onChange={(v) => set("facial_hair", String(v))}
                        placeholder="Facial Hair"
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
                    <Dropdown
                        options={[
                            { label: "Soprano", value: "soprano" },
                            { label: "Mezzo-Soprano", value: "mezzo_soprano" },
                            { label: "Contralto", value: "contralto" },
                            { label: "Tenor", value: "tenor" },
                            { label: "Baritone", value: "baritone" },
                            { label: "Bass", value: "bass" },
                            { label: "Countertenor", value: "countertenor" },
                        ]}
                        value={form.singing_voice_type}
                        onChange={(v) => set("singing_voice_type", String(v))}
                        placeholder="Singing Voice Type"
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
