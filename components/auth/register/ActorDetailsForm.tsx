// components/auth/register/ActorDetailsForm.tsx

"use client";

import { useState } from "react";
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

const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
};

interface ActorData {
    // Core
    union_status: string;
    age_range_min: string;
    age_range_max: string;
    languages: string[];
    accents: string[];
    special_skills: string[];
    willing_to_travel: boolean;
    has_valid_passport: boolean;
    nudity_comfort: string;
    // Physical
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
    // Performance
    dance_styles: string[];
    instrument_skills: string[];
    combat_styles: string[];
    sport_skills: string[];
    singing_voice_type: string;
    stunt_certified: boolean;
    has_vehicle: boolean;
    can_drive_manual: boolean;
    // Links
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

function TagInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string[];
    onChange: (val: string[]) => void;
}) {
    const [input, setInput] = useState("");

    const add = () => {
        const trimmed = input.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setInput("");
    };

    const remove = (item: string) => {
        onChange(value.filter((v) => v !== item));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelStyle}>{label}</label>
            <div style={{ display: "flex", gap: "8px" }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && (e.preventDefault(), add())
                    }
                    style={{ ...inputStyle, flex: 1 }}
                    placeholder="type and press enter"
                />
                <button
                    type="button"
                    onClick={add}
                    style={{
                        background: "transparent",
                        border: "1px solid rgba(212,185,106,0.3)",
                        color: "var(--gold-accent)",
                        fontFamily: "var(--font-body)",
                        fontSize: "11px",
                        padding: "4px 12px",
                        cursor: "pointer",
                    }}
                >
                    add
                </button>
            </div>
            {value.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {value.map((item) => (
                        <span
                            key={item}
                            style={{
                                fontFamily: "var(--font-body)",
                                fontSize: "10px",
                                letterSpacing: "0.1em",
                                color: "var(--cream)",
                                border: "1px solid rgba(212,185,106,0.3)",
                                padding: "4px 10px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                            }}
                        >
                            {item}
                            <button
                                type="button"
                                onClick={() => remove(item)}
                                style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--cream-muted)",
                                    cursor: "pointer",
                                    padding: 0,
                                    fontSize: "12px",
                                }}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

function Toggle({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
}) {
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
                {/* ── Core fields ── */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label style={labelStyle}>Union Status</label>
                    <select
                        value={form.union_status}
                        onChange={(e) => set("union_status", e.target.value)}
                        style={selectStyle}
                    >
                        <option value="">Select</option>
                        <option value="sag_aftra">SAG-AFTRA</option>
                        <option value="iatse">IATSE</option>
                        <option value="non_union">Non-Union</option>
                        <option value="fi_core">Fi-Core</option>
                    </select>
                </div>

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

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                    }}
                >
                    <label style={labelStyle}>Nudity Comfort</label>
                    <select
                        value={form.nudity_comfort}
                        onChange={(e) => set("nudity_comfort", e.target.value)}
                        style={selectStyle}
                    >
                        <option value="none">None</option>
                        <option value="implied">Implied</option>
                        <option value="partial">Partial</option>
                        <option value="full">Full</option>
                    </select>
                </div>

                {/* ── Physical ── */}
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

                    {[
                        {
                            label: "Eye Color",
                            key: "eye_color",
                            options: [
                                "brown",
                                "blue",
                                "hazel",
                                "amber",
                                "gray",
                                "green",
                                "violet",
                                "red",
                                "black",
                            ],
                        },
                        {
                            label: "Hair Color",
                            key: "hair_color",
                            options: [
                                "black",
                                "dark_brown",
                                "brown",
                                "light_brown",
                                "dirty_blonde",
                                "blonde",
                                "platinum_blonde",
                                "strawberry_blonde",
                                "auburn",
                                "red",
                                "gray",
                                "white",
                                "salt_and_pepper",
                                "other",
                            ],
                        },
                        {
                            label: "Hair Length",
                            key: "hair_length",
                            options: [
                                "bald",
                                "buzzed",
                                "short",
                                "ear_length",
                                "chin_length",
                                "shoulder_length",
                                "armpit_length",
                                "mid_back_length",
                                "waist_length",
                                "hip_length",
                                "tailbone_length",
                                "floor_length",
                            ],
                        },
                        {
                            label: "Body Type",
                            key: "body_type",
                            options: [
                                "thin",
                                "slim",
                                "slender",
                                "average",
                                "athletic",
                                "toned",
                                "muscular",
                                "stocky",
                                "curvy",
                                "plus_size",
                                "large",
                                "heavyset",
                            ],
                        },
                        {
                            label: "Ethnicity",
                            key: "ethnicity",
                            options: [
                                "american_indian_alaska_native",
                                "asian",
                                "black_african_american",
                                "hispanic_latino",
                                "middle_eastern_north_african",
                                "native_hawaiian_pacific_islander",
                                "white",
                                "other",
                                "prefer_not_to_say",
                            ],
                        },
                        {
                            label: "Skin Tone",
                            key: "skin_tone",
                            options: [
                                "porcelain",
                                "fair",
                                "light",
                                "medium",
                                "tan",
                                "olive",
                                "brown",
                                "dark",
                                "deep",
                                "ebony",
                            ],
                        },
                        {
                            label: "Facial Hair",
                            key: "facial_hair",
                            options: [
                                "none",
                                "stubble",
                                "moustache",
                                "goatee",
                                "beard",
                                "full_beard",
                            ],
                        },
                    ].map(({ label, key, options }) => (
                        <div
                            key={key}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "8px",
                            }}
                        >
                            <label style={labelStyle}>{label}</label>
                            <select
                                value={form[key as keyof ActorData] as string}
                                onChange={(e) =>
                                    set(key as keyof ActorData, e.target.value)
                                }
                                style={selectStyle}
                            >
                                <option value="">Select</option>
                                {options.map((o) => (
                                    <option key={o} value={o}>
                                        {o.replace(/_/g, " ")}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}

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

                {/* ── Performance ── */}
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
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "8px",
                        }}
                    >
                        <label style={labelStyle}>Singing Voice Type</label>
                        <select
                            value={form.singing_voice_type}
                            onChange={(e) =>
                                set("singing_voice_type", e.target.value)
                            }
                            style={selectStyle}
                        >
                            <option value="">Select</option>
                            <option value="soprano">Soprano</option>
                            <option value="mezzo_soprano">Mezzo-Soprano</option>
                            <option value="contralto">Contralto</option>
                            <option value="tenor">Tenor</option>
                            <option value="baritone">Baritone</option>
                            <option value="bass">Bass</option>
                            <option value="countertenor">Countertenor</option>
                        </select>
                    </div>
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

                {/* ── Links & Credits ── */}
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

                {/* ── Actions ── */}
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
