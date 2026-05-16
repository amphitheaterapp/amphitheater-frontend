// components/auth/register/DateOfBirthInput.tsx

"use client";

import { useState } from "react";

const selectStyle = {
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(212,185,106,0.4)",
    color: "var(--cream)",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    padding: "8px 0",
    outline: "none",
    cursor: "pointer",
    appearance: "none" as const,
    WebkitAppearance: "none" as const,
};

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const labelStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    color: "var(--cream-muted)",
};

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function DateOfBirthInput({ value, onChange }: Props) {
    const parts = value ? value.split("-") : ["", "", ""];
    const [year, setYear] = useState(parts[0]);
    const [month, setMonth] = useState(parts[1]);
    const [day, setDay] = useState(parts[2]);

    const update = (y: string, m: string, d: string) => {
        if (y && m && d) {
            onChange(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - 16 - i);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelStyle}>Date of Birth</label>
            <div style={{ display: "flex", gap: "16px" }}>
                <select
                    value={day}
                    onChange={(e) => {
                        setDay(e.target.value);
                        update(year, month, e.target.value);
                    }}
                    style={{ ...selectStyle, flex: 1 }}
                >
                    <option value="">Day</option>
                    {days.map((d) => (
                        <option key={d} value={d}>
                            {d}
                        </option>
                    ))}
                </select>

                <select
                    value={month}
                    onChange={(e) => {
                        setMonth(e.target.value);
                        update(year, e.target.value, day);
                    }}
                    style={{ ...selectStyle, flex: 2 }}
                >
                    <option value="">Month</option>
                    {MONTHS.map((m, i) => (
                        <option key={m} value={i + 1}>
                            {m}
                        </option>
                    ))}
                </select>

                <select
                    value={year}
                    onChange={(e) => {
                        setYear(e.target.value);
                        update(e.target.value, month, day);
                    }}
                    style={{ ...selectStyle, flex: 2 }}
                >
                    <option value="">Year</option>
                    {years.map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
