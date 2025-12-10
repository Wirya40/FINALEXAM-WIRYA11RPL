/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css}"   // wajib agar Tailwind membaca semua CSS
  ],
  theme: { extend: {} },
  plugins: [],
}
