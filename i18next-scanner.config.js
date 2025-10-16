module.exports = {
  input: [
    'src/**/*.{js,jsx,ts,tsx}',
  ],
  output: './',
  options: {
    debug: true,
    removeUnusedKeys: false,
    sort: false,
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    lngs: ['en'],
    defaultLng: 'en',
    resource: {
      loadPath: 'locales/{{lng}}/{{ns}}.json',
      savePath: 'locales/{{lng}}/{{ns}}.json',
      jsonIndent: 2
    }
  }
};
