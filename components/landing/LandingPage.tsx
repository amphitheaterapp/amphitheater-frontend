"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ColumnIcon = ({ className = "" }: { className?: string }) => (
    <svg
        viewBox="0 0 60 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-hidden
    >
        <path
            d="M8 10 Q10 4 30 4 Q50 4 52 10 L50 14 H10 Z"
            fill="currentColor"
            opacity="0.9"
        />
        <path d="M10 14 H50 V16 H10 Z" fill="currentColor" />
        <rect
            x="13"
            y="16"
            width="4.5"
            height="44"
            fill="currentColor"
            opacity="0.85"
        />
        <rect
            x="19.5"
            y="16"
            width="4.5"
            height="44"
            fill="currentColor"
            opacity="0.85"
        />
        <rect
            x="26"
            y="16"
            width="4.5"
            height="44"
            fill="currentColor"
            opacity="0.85"
        />
        <rect
            x="32.5"
            y="16"
            width="4.5"
            height="44"
            fill="currentColor"
            opacity="0.85"
        />
        <rect
            x="39"
            y="16"
            width="4.5"
            height="44"
            fill="currentColor"
            opacity="0.85"
        />
        <path d="M9 60 H51 V63 H9 Z" fill="currentColor" />
        <path d="M5 63 H55 V67 H5 Z" fill="currentColor" opacity="0.9" />
        <path d="M2 67 H58 V72 H2 Z" fill="currentColor" />
    </svg>
);

export default function LandingPage() {
    return (
        <div>
            <h1>Amphitheater</h1>
        </div>
    );
}
