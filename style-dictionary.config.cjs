module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'app/tokens/',
      files: [{ destination: 'variables.css', format: 'css/variables' }],
    },
  },
}
