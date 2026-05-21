// components/common/PhoneInput.tsx

"use client";

import { useState, useMemo } from "react";
import {
    getCountries,
    getCountryCallingCode,
    CountryCode,
} from "libphonenumber-js";
import Dropdown from "./Dropdown";

const labelStyle = {
    fontFamily: "var(--font-body)",
    fontSize: "10px",
    letterSpacing: "0.3em",
    textTransform: "uppercase" as const,
    color: "var(--cream-muted)",
};

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

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export default function PhoneInput({ value, onChange }: Props) {
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>("US");
    const [number, setNumber] = useState("");

    const countryOptions = useMemo(() => {
        return getCountries()
            .map((country) => ({
                // Dropdown shows: United States (+1)
                label: `${regionNames.of(country)} (+${getCountryCallingCode(country)})`,
                // Trigger shows: +1
                value: country,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));
    }, []);

    const handleCountryChange = (val: string | number) => {
        const country = val as CountryCode;
        setSelectedCountry(country);
        onChange(`+${getCountryCallingCode(country)}${number}`);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const num = e.target.value.replace(/[^0-9]/g, "");
        setNumber(num);
        onChange(`+${getCountryCallingCode(selectedCountry)}${num}`);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <label style={labelStyle}>Phone Number</label>
            <div
                style={{ display: "flex", gap: "12px", alignItems: "flex-end" }}
            >
                {/* Country code trigger — shows only +1 */}
                <div style={{ flex: "0 0 72px" }}>
                    <Dropdown
                        options={countryOptions}
                        value={selectedCountry}
                        onChange={handleCountryChange}
                        placeholder="+1"
                        // Override the displayed value in the trigger
                        displayValue={`+${getCountryCallingCode(selectedCountry)}`}
                    />
                </div>
                <input
                    type="tel"
                    value={number}
                    onChange={handleNumberChange}
                    style={{ ...inputStyle, flex: 1 }}
                />
            </div>
        </div>
    );
}
