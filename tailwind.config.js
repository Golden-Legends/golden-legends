/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.html", "./src/**/*.vue"],
  theme: {
    extend: {
      colors: {
        "blue-darker": "#005988",
        "blue-lighter": "#C8ECFF",
        "begin-blue-gradient": "#0092DF",
        "end-blue-gradient": "#00466B",
        "begin-red-gradient": "#EE333A",
        "end-red-gradient": "#6b0e1b",
        "begin-light-blue-gradient": "#90D9FF",
        "end-light-blue-gradient": "#0093E1",
      },
    },
  },
  plugins: [],
};
