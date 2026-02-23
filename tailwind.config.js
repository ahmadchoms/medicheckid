/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/js/**/*.{js,jsx}",
        "./resources/views/**/*.blade.php",
    ],
    theme: {
        extend: {
            colors: {
                brutal: {
                    yellow: "#FFE500",
                    blue: "#0047FF",
                    red: "#FF2D20",
                    green: "#00C851",
                    orange: "#FF6B00",
                    pink: "#FF006E",
                    black: "#0A0A0A",
                    white: "#FAFAFA",
                    gray: "#F0F0F0",
                    muted: "#6B6B6B",
                },
                health: {
                    safe: "#00C851",
                    warning: "#FFB300",
                    danger: "#FF2D20",
                    info: "#0047FF",
                },
            },
            fontFamily: {
                display: ['"Archivo Black"', "sans-serif"],
                body: ['"DM Sans"', "sans-serif"],
                mono: ['"JetBrains Mono"', "monospace"],
            },
            boxShadow: {
                brutal: "4px 4px 0px 0px #0A0A0A",
                "brutal-sm": "2px 2px 0px 0px #0A0A0A",
                "brutal-lg": "6px 6px 0px 0px #0A0A0A",
                "brutal-xl": "8px 8px 0px 0px #0A0A0A",
                "brutal-blue": "4px 4px 0px 0px #0047FF",
                "brutal-yellow": "4px 4px 0px 0px #FFE500",
                "brutal-red": "4px 4px 0px 0px #FF2D20",
                "brutal-green": "4px 4px 0px 0px #00C851",
                "brutal-inset": "inset 2px 2px 0px 0px #0A0A0A",
            },
            borderWidth: {
                3: "3px",
                5: "5px",
                6: "6px",
            },
            backgroundImage: {
                "grid-brutal":
                    "linear-gradient(#0A0A0A 1px, transparent 1px), linear-gradient(90deg, #0A0A0A 1px, transparent 1px)",
                "grid-light":
                    "linear-gradient(rgba(10,10,10,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(10,10,10,0.07) 1px, transparent 1px)",
                "dot-pattern":
                    "radial-gradient(circle, #0A0A0A 1.5px, transparent 1.5px)",
            },
            backgroundSize: {
                "grid-sm": "20px 20px",
                "grid-md": "40px 40px",
                "dot-sm": "20px 20px",
            },
            animation: {
                "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                "slide-in": "slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                "fade-in": "fadeIn 0.25s ease-out",
                "pulse-brutal": "pulseBrutal 2s ease-in-out infinite",
                wiggle: "wiggle 0.5s ease-in-out",
                float: "float 3s ease-in-out infinite",
            },
            keyframes: {
                slideUp: {
                    "0%": { transform: "translateY(20px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                slideIn: {
                    "0%": { transform: "translateX(-20px)", opacity: "0" },
                    "100%": { transform: "translateX(0)", opacity: "1" },
                },
                fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
                pulseBrutal: {
                    "0%, 100%": { boxShadow: "4px 4px 0px 0px #0A0A0A" },
                    "50%": { boxShadow: "6px 6px 0px 0px #0047FF" },
                },
                wiggle: {
                    "0%, 100%": { transform: "rotate(0deg)" },
                    "25%": { transform: "rotate(-3deg)" },
                    "75%": { transform: "rotate(3deg)" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-8px)" },
                },
            },
        },
    },
    plugins: [],
};
