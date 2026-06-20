export function humanizeLabel(key: string): string {
    return key
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatFieldValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (Array.isArray(value)) {
        return value.length === 0 ? "—" : value.join(", ");
    }
    return String(value);
}

export interface FieldGroup {
    title: string;
    fields: string[];
}

// Deliberately leaves out id, qdrant_id, template_content,
// embedding_complete, profile_links. Those are internal or AI-search
// fields, not meant for a human-facing detail view.
export const ACTOR_FIELD_GROUPS: FieldGroup[] = [
    {
        title: "Physical",
        fields: [
            "height_cm", "weight_kg", "eye_color", "hair_length", "hair_color",
            "body_type", "ethnicity", "skin_tone", "facial_hair",
            "visible_tattoos", "visible_piercings",
        ],
    },
    {
        title: "Performance",
        fields: [
            "special_skills", "accents", "dance_styles", "instrument_skills",
            "combat_styles", "sport_skills", "singing_voice_type", "stunt_certified",
        ],
    },
    {
        title: "Logistics",
        fields: [
            "has_vehicle", "can_drive_manual", "has_valid_passport",
            "willing_to_travel", "nudity_comfort",
        ],
    },
    {
        title: "Booking",
        fields: ["union_status", "age_range_min", "age_range_max", "representation"],
    },
    {
        title: "Languages & Work",
        fields: ["languages", "past_works"],
    },
];

export const DIRECTOR_FIELD_GROUPS: FieldGroup[] = [
    {
        title: "Style",
        fields: [
            "genres", "formats", "narrative_style", "shooting_style",
            "color_philosophy", "works_with_actors_approach", "visual_references",
        ],
    },
    {
        title: "Credits",
        fields: [
            "has_feature_credits", "has_tv_credits", "has_theatre_credits",
            "has_documentary_credits", "has_commercial_credits",
            "has_music_video_credits", "years_experience",
            "longest_project_runtime_mins",
        ],
    },
    {
        title: "Production",
        fields: [
            "largest_crew_managed", "has_production_company",
            "production_company_name", "camera_systems", "has_own_equipment",
        ],
    },
    {
        title: "Recognition",
        fields: ["awards", "festival_selections"],
    },
    {
        title: "Booking",
        fields: ["union_status", "past_budget_max", "willing_to_travel", "remote_capable"],
    },
    {
        title: "Languages & Work",
        fields: ["languages", "past_works"],
    },
];

export const FIELD_GROUPS_BY_ROLE: Record<string, FieldGroup[]> = {
    actor: ACTOR_FIELD_GROUPS,
    director: DIRECTOR_FIELD_GROUPS,
};