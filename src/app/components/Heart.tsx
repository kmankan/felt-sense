"use client";
export default function Heart() {
    return <>  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="mt-auto">
        <defs>
            <path id="heartPath" d="M100,170 C100,170 180,110 180,65 C180,20 140,20 100,60 C60,20 20,20 20,65 C20,110 100,170 100,170 Z" />

            <clipPath id="heartClip">
                <use href="#heartPath" />
            </clipPath>

            <filter id="displacementFilter">
                <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" seed="2" result="turbulence">
                    <animate attributeName="seed" from="0" to="100" dur="15s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>

            <radialGradient id="heartGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{ stopColor: "#ff1a1a" }}>
                    <animate attributeName="stop-color" values="#ff1a1a;#ff0000;#cc0000;#ff1a1a" dur="5s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" style={{ stopColor: "#990000" }}>
                    <animate attributeName="stop-color" values="#990000;#cc0000;#990000;#990000" dur="5s" repeatCount="indefinite" />
                </stop>
            </radialGradient>
        </defs>

        <g clipPath="url(#heartClip)">
            <use href="#heartPath" fill="url(#heartGradient)" filter="url(#displacementFilter)" />
        </g>

        <use href="#heartPath" fill="none" stroke="#cc0000" strokeWidth="1" />
    </svg></>;
}
