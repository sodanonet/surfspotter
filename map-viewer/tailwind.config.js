const sharedConfig = require('../shared-config/tailwind.config');

module.exports = {
  ...sharedConfig,
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
}
