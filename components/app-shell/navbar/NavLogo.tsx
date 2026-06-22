"use client";

import Link from "next/link";
import { ColumnIcon } from "@/assets/InternalSVGPack";

export default function NavLogo() {
    return (
        <Link
            href="/"
            style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textDecoration: "none",
            }}
        >
            <ColumnIcon
                style={{ width: "36px", height: "36px", color: "var(--cream)" }}
            />
            <span
                style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "12px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "var(--cream-dim)",
                }}
            >
                Amphitheater
            </span>
        </Link>
    );
}
