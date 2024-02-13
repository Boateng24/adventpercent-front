/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: () => ({
        "custom-gradient":
          "linear-gradient(122.72deg, rgba(19, 83, 82, 0.98) 1.74%, rgba(79, 79, 79, 0.98) 1.75%, rgba(19, 83, 82, 0.98) 33.05%, rgba(79, 79, 79, 0.98) 97.16%), radial-gradient(88.13% 63.48% at 26.09% 25.74%, #FFFFFF 0%, rgba(255, 255, 255, 0.801323) 19.27%, rgba(255, 255, 255, 0.595409) 40.46%, rgba(255, 255, 255, 0.905829) 55.21%, rgba(255, 255, 255, 0.101914) 89.81%, rgba(255, 255, 255, 0.0385321) 96.15%, rgba(255, 255, 255, 0) 100%)",
      }),
    },
  },
  plugins: [],
};

