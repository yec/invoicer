module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
      screens: {
        print: { raw: "print" },
      },
      spacing: {
        // a4w: "210mm",
        // a4h: "297mm",
        a4w: "794px",
        a4h: "1122px",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
    },
  },
  plugins: [require("tailwindcss-glow")()],
};
