module.exports = {
  darkMode: 'class',
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary:{50:"#eff6ff",100:"#dbeafe",600:"#2563EB",700:"#1D4ED8"},
        success:{600:"#059669"},
        warning:{600:"#D97706"},
        danger:{600:"#DC2626"}
      },
      boxShadow:{ 'sm-soft':'0 1px 2px -1px rgba(0,0,0,0.08),0 1px 1px rgba(0,0,0,0.06)','md-soft':'0 4px 12px -2px rgba(0,0,0,0.08),0 2px 4px -2px rgba(0,0,0,0.04)'}
    }
  },
  plugins:[]
};