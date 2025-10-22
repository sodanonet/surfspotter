const sharedConfig = require('../shared-config/tailwind.config');

module.exports = {
  ...sharedConfig,
  content: [
    './src/**/*.{html,ts,scss}',
  ],
  plugins: [
    require('daisyui'),
  ],
}
