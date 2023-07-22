/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderColor: ["responsive", "hover", "focus", "focus-visible"],
      ringColor: ["responsive", "hover", "focus", "focus-visible"],
    },
  },
  plugins: [],
};
