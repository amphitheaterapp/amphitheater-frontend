"use client";

import NavLogo from "./NavLogo";
import NavTabs from "./NavTabs";
import NavActions from "./NavActions";

export default function Navbar() {
    return (
        <nav
            aria-label="Primary"
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "20px 32px",
                background: "color-mix(in srgb, var(--ink) 90%, transparent)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(200,169,110,0.12)",
            }}
        >
            <NavLogo />
            <NavTabs />
            <NavActions />
        </nav>
    );
}
