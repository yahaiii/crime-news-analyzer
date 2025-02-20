module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        colors: {
          'brand': {
            primary: '#15A6DF',    // Main brand color
            secondary: '#FF6B35',  // Accent color
            dark: '#1A365D',       // Dark variant
            light: '#EBF4FF'       // Light variant
          }
        },
        fontFamily: {
          heading: ['Inter', 'sans-serif'],
          body: ['Open Sans', 'sans-serif']
        }
      }
    }
}