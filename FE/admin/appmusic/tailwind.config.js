const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  corePlugins: {
    container: false
  },
  theme: {
    extend: {
      colors: {
        'main-color': '#1ed760'
      },
      backgroundImage: {
        'banner-image': "url('/src/imgs/banner.jpg')"
      },
      fontFamily: {
        Poppins: 'Poppins'
      }
    }
  },
  mode: 'jit',
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.container': {
          maxWidth: theme('columns.7xl'),
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: theme('spacing.4'),
          paddingRight: theme('spacing.4')
        }
      })
    }),
    // thêm @tailwindcss/line-clamp
    // có thuộc tính `line-clamp-x` để truncate với text có `x` dòng
    require('@tailwindcss/line-clamp')
  ]
}
