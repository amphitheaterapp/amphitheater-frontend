"use client";

import ConstellationBackground from "./ConstellationBackground";
import HowItWorks from "./HowItWorks";
import Hero from "./Hero";
import Nav from "./Nav";
import Mission from "./Mission";

export default function LandingPage() {
    return (
        <main style={{ position: "relative" }}>
            <ConstellationBackground />
            <div style={{ position: "relative", zIndex: 1 }}>
                <Nav />
                <Hero />
                <Mission />
                <HowItWorks />
            </div>
        </main>
    );
}
