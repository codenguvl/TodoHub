import { type Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        task: "#0065FF",
        inprogress: "#0854cc",
        done: "#08845c",
        todo: "#d4d4d8",
        subtask: "#6CC3E0",
        initiative: "#ff6600",
        "high-priority": "#FF5630",
        "medium-priority": "#FFAB00",
        "low-priority": "#00B8D9",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
    require("tailwindcss-animate"),
  ],
} satisfies Config;
