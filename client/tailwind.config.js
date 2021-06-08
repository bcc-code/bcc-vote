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
        '4xl': ['24px', '32px'], //h2
        '5xl': ['32px', '44px'], //h1
      },
      borderRadius: {
        'xl': '1.5rem'
      },
      height: {
        '128': '32rem',
        '64': '16rem',
      },
      top: {
        '56': '14rem',
        '28': '7rem'
      },
      padding: {
        '15': '3.75rem',
        '0.5': '0.125rem'
      },
      margin: {
        '9': '2.25rem',
        '7': '1.75rem',
        '1.5': '0.375rem'
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
        blue: {
          300: '#EBF4FF',
          500: '#758CDF',
          600: '#6297FF',
          800: '#23687D',
          900: '#2A4E96',
        },
        red: {
          200: 'rgba(226, 52, 94, 0.1);',
          500: '#EB7362',
          600: '#E2345E',
        }
      }
    },
  }
}
