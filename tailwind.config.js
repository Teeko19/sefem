/** @type {import("tailwindcss").Config} */

const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./src/**/*.{html,md,liquid,erb,serb,rb}",
    "./frontend/javascript/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        z0: "#051D23",
        z1: "#ffffff",
        fg: {
          DEFAULT: "#ffffff",
          secondary: "rgba(255, 255, 255, 0.8)",
          tertiary: "rgba(255, 255, 255, 0.6)"
        },
        month: {
          1: "#00909B",
          2: "#00606B",
          3: "#005B3E",
          4: "#00591D",
          5: "#4B7F3B",
          6: "#7A7614",
          7: "#A5A034",
          8: "#EBB65E",
          9: "#DD962F",
          10: "#C16811",
          11: "#A03A0D",
          12: "#701208",
        }
      }
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/forms"),
  ],
}
