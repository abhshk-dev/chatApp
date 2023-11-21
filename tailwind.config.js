/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,jsx,tsx,js,ts}", "./index.html"],
  theme: {
    extend: {
      colors: {
        text: "#11090d",
        background: "#f3e7ee",
        primary: "#72b692",
        secondary: "#debfd0",
        accent: "#478a66",
      },
      backgroundImage: {
        "chat-bg": "url('./src/images/bgChat.jpg')",
      },
    },
  },
  plugins: [],
};
