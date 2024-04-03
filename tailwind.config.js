/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.html", "./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        "blue-darker": "#005988",
        "blue-lighter": "#C8ECFF",
        "begin-gradient": "#0092DF",
        "end-gradient": "#00466B",
      },
    },
  },
  plugins: [],
};
