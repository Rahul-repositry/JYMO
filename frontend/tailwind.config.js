/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fade: "fadeIn 2s ease-in-out 1s",
      },

      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      colors: {
        customButton: "#FF8A62",
        yellowBox: "#FEC972",
        redBox: "#EA3F3F",
        lightBlack: "#3F3D3D",
        darkBlack: "#404446",
      },
      screens: {
        "custom-md400": "400px",
        "custom-md500": "500px",
        "custom-md800": "800px",
        "custom-md900": "900px",
        "custom-lg1100": "1100px",
        standalone: {
          raw: "(display-mode: standalone) and (max-width: 768px)",
        },
      },
    },
  },
  plugins: [],
};
