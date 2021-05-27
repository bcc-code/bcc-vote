module.exports = {
  plugins: [],
  purge: [
    './src/**/*.vue',
    './src/**/*.ts'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Ubuntu', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', '16px'], //
        sm: ['11px', '20px'], //h6
        base: ['16px', '28px'], //p
        lg: ['14px', '20px'], //h5
        xl: ['14px', '24px'], //label
        '2xl': ['17px', '24px'], //h4
        '3xl': ['20px', '28px'], //h3
        '4xl': ['28px', '36px'], //h2
        '5xl': ['32px', '44px'], //h1
      },
      borderRadius: {
        'xl': '24px'
      },
      colors: {
        gray: {
          100: '#F5F6FA',
          200: '#E6E9F2',
          300: '#D4D4D5',
          400: '#B3B4B6',
          500: '#E6E9F2',
          600: '#C1C7DA',
          700: '#838CA8',
          800: '#5A617D',
          900: '#16171A',
        },
        green: {
          100: '#E3F1E2',
          200: '#E3F1E2',
          300: '#E3F1E2',
          400: '#E3F1E2',
          500: '#43B02A',
          600: '#43B02A',
          700: '#70A76F',
          800: '#70A76F',
          900: '#70A76F',
        },
        blue: {
          600: '#6297FF',
          900: '#2A4E96',
        }
      }
    },
  }
}
