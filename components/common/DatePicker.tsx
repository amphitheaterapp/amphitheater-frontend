"use client";

import { useState } from "react";
import Dropdown from "@/components/common/Dropdown";

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

export default function DatePicker({ value, onChange }: Props) {
    const parts = value ? value.split("-") : ["", "", ""];
    const [year, setYear] = useState(parts[0]);
    const [month, setMonth] = useState(parts[1]);
    const [day, setDay] = useState(parts[2]);

    const update = (y: string, m: string, d: string) => {
        if (y && m && d) {
            onChange(
                `${y}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`,
            );
        }
    };

    const currentYear = new Date().getFullYear();

    const dayOptions = Array.from({ length: 31 }, (_, i) => ({
        label: String(i + 1),
        value: String(i + 1),
    }));

    const monthOptions = MONTHS.map((m, i) => ({
        label: m,
        value: String(i + 1),
    }));

    const yearOptions = Array.from({ length: 100 }, (_, i) => ({
        label: String(currentYear - 16 - i),
        value: String(currentYear - 16 - i),
    }));

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelStyle}>Date of Birth</label>
            <div style={{ display: "flex", gap: "16px" }}>
                <Dropdown
                    options={dayOptions}
                    value={day}
                    onChange={(v) => {
                        setDay(String(v));
                        update(year, month, String(v));
                    }}
                    placeholder="Day"
                />
                <Dropdown
                    options={monthOptions}
                    value={month}
                    onChange={(v) => {
                        setMonth(String(v));
                        update(year, String(v), day);
                    }}
                    placeholder="Month"
                />
                <Dropdown
                    options={yearOptions}
                    value={year}
                    onChange={(v) => {
                        setYear(String(v));
                        update(String(v), month, day);
                    }}
                    placeholder="Year"
                />
            </div>
        </div>
    );
}
