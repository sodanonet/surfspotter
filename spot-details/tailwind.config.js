const sharedConfig = require('../shared-config/tailwind.config');

module.exports = {
  ...sharedConfig,
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
}
