/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customButton: "#FF8A62",
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
