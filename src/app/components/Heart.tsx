export default function Heart() {
    return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mt-auto absolute top-8 w-[200px] h-[200px]">
        <defs>
            <path id="heartPath" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />

            <clipPath id="heartClip">
                <use href="#heartPath" />
            </clipPath>

            <filter id="displacementFilter">
                <feTurbulence type="turbulence" baseFrequency="0.008" numOctaves="2" seed="2" result="turbulence">
                    <animate attributeName="seed" from="0" to="100" dur="15s" repeatCount="indefinite" />
                </feTurbulence>
                <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="4" xChannelSelector="R" yChannelSelector="G" />
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
            <rect x="0" y="0" width="24" height="24" fill="url(#heartGradient)" filter="url(#displacementFilter)" />
        </g>

        <use href="#heartPath" fill="none" stroke="#cc0000" strokeWidth="1" />
    </svg>;
}
