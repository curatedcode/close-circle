/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "web-white": "rgba(240, 242, 245)",
        "logo-blue": "rgba(34, 139, 230)",
        "web-gray": "rgba(24, 25, 26)",
        "web-gray-light": "rgba(36, 37, 38)",
      },
      gridAutoColumns: {
        auto: "auto auto",
      },
      borderWidth: {
        1: "1px",
      },
      screens: {
        xs: "420px",
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/line-clamp")],
  future: {
    hoverOnlyWhenSupported: true,
  },
};

module.exports = config;
