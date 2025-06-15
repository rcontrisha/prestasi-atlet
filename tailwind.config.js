/* eslint-disable @typescript-eslint/no-require-imports */
import withMT from "@material-tailwind/react/utils/withMT";


module.exports = withMT({
  content: ["./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin'),
    require('tailwind-scrollbar-hide')
  ],
});