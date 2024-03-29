/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-montserrat)"],
        body: ["var(--font-lato)"],
      },
      transitionProperty: {
        height: "height",
        maxHeight: "max-height",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        wine: "linear-gradient(0deg, rgba(52, 78, 65, 0.25) 0%, rgba(52, 78, 65, 0.25) 100%), url('/images/cv-bg/wine.jpg')",
      },
      colors: {
        brunswick_green: {
          DEFAULT: "#344e41",
          100: "#0a0f0d",
          200: "#141f1a",
          300: "#1f2e26",
          400: "#293d33",
          500: "#344e41",
          600: "#527a66",
          700: "#75a38c",
          800: "#a3c2b3",
          900: "#d1e0d9",
        },
        sage: {
          DEFAULT: "#a3b18a",
          100: "#212619",
          200: "#434c33",
          300: "#64724c",
          400: "#859865",
          500: "#a3b18a",
          600: "#b6c1a2",
          700: "#c8d0b9",
          800: "#dae0d0",
          900: "#edefe8",
        },
        isabelline: {
          DEFAULT: "#eeece8",
          100: "#363128",
          200: "#6c6350",
          300: "#9e927c",
          400: "#c6bfb2",
          500: "#eeece8",
          600: "#f1efec",
          700: "#f5f3f1",
          800: "#f8f7f6",
          900: "#fcfbfa",
        },
        platinum: {
          DEFAULT: "#e5e2dc",
          100: "#342f26",
          200: "#675e4c",
          300: "#998d75",
          400: "#bfb7a8",
          500: "#e5e2dc",
          600: "#eae8e3",
          700: "#efeeea",
          800: "#f5f3f1",
          900: "#faf9f8",
        },
        pearl: {
          DEFAULT: "#eadfc8",
          100: "#3f3318",
          200: "#7e6530",
          300: "#ba974a",
          400: "#d2bb89",
          500: "#eadfc8",
          600: "#eee5d3",
          700: "#f2ecde",
          800: "#f7f2e9",
          900: "#fbf9f4",
        },
        wheat: {
          DEFAULT: "#e6d1a8",
          100: "#3e2f12",
          200: "#7b5e24",
          300: "#b98d36",
          400: "#d4b16a",
          500: "#e6d1a8",
          600: "#ebdab9",
          700: "#f0e4cb",
          800: "#f5eddc",
          900: "#faf6ee",
        },
        bole: {
          DEFAULT: "#804638",
          100: "#1a0e0b",
          200: "#331c16",
          300: "#4d2a22",
          400: "#66382d",
          500: "#804638",
          600: "#ad5f4c",
          700: "#c38677",
          800: "#d7aea4",
          900: "#ebd7d2",
        },
        redwood: {
          DEFAULT: "#a25f4b",
          100: "#20130f",
          200: "#40261e",
          300: "#60382c",
          400: "#814b3b",
          500: "#a25f4b",
          600: "#ba7b68",
          700: "#cb9c8e",
          800: "#dcbdb4",
          900: "#eeded9",
        },
        brown_sugar: {
          DEFAULT: "#c4775d",
          100: "#2b160f",
          200: "#552c1f",
          300: "#80432e",
          400: "#ab593e",
          500: "#c4775d",
          600: "#d1937e",
          700: "#dcae9e",
          800: "#e8c9bf",
          900: "#f3e4df",
        },

        khaki: {
          DEFAULT: "#bfb59e",
          100: "#2a251c",
          200: "#534b37",
          300: "#7d7053",
          400: "#a29473",
          500: "#bfb59e",
          600: "#cbc3b1",
          700: "#d8d2c4",
          800: "#e5e1d8",
          900: "#f2f0eb",
        },

        oxford_blue: {
          DEFAULT: "#0e1c36",
          100: "#03050b",
          200: "#050b15",
          300: "#081020",
          400: "#0b162a",
          500: "#0e1c36",
          600: "#20407b",
          700: "#3264c2",
          800: "#7297db",
          900: "#b8cbed",
        },

        coolgray: {
          50: "#f9fafb ",
          100: "#f3f4f6 ",
          200: "#e5e7eb ",
          300: "#d1d5db ",
          400: "#94a3b8 ",
          500: "#6b7280 ",
          600: "#4b5563 ",
          700: "#374151 ",
          800: "#1f2937 ",
          900: "#111827 ",
        },
        bluegray: {
          50: "#f8fafc ",
          100: "#f1f5f9 ",
          200: "#e2e8f0 ",
          300: "#cbd5e1 ",
          400: "#94a3b8 ",
          500: "#64748b ",
          600: "#475569 ",
          700: "#334155 ",
          800: "#1e293b ",
          900: "#0f172a ",
        },
      },
      padding: {
        "1/3": "33.333333%",
        "2/3": "66.666667%",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
