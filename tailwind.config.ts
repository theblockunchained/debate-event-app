import colors from 'tailwindcss/colors';

interface MyTailwindConfig {
  content: string[];
  theme: {
    extend: {
      backgroundImage: {
        [key: string]: string;
      };
      colors: {
        [key: string]: {
          [key: number]: string;
        };
      };
    };
  };
  plugins: any[];
}

const config: MyTailwindConfig = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        lightpurple: {
          100: '#E6E2F3',
          // ... you can add other shades if required
        },
        aqua: {
          50: '#E6FFFF',
          300: '#4DD0E1',
          // ... add more shades if required
        },
        gray: colors.trueGray,
      },
    },
  },
  plugins: [],
};

export default config;
