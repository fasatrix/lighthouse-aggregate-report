const path = require('path');
const constant = path.join(process.cwd(), './node_modules/lighthouse/lighthouse-core/config', 'constants');
const lighthouseConstants = require(constant);
export const mobileConfig = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    formFactor: 'mobile',
    throttling: lighthouseConstants.throttling.mobileSlow4G,
    screenEmulation: lighthouseConstants.screenEmulationMetrics.mobile,
    emulatedUserAgent: lighthouseConstants.userAgents.mobile,
  },
};

export const desktopConfig = {
  extends: 'lighthouse:default',
  settings: {
    maxWaitForFcp: 15 * 1000,
    maxWaitForLoad: 35 * 1000,
    formFactor: 'desktop',
    throttling: lighthouseConstants.throttling.desktopDense4G,
    screenEmulation: lighthouseConstants.screenEmulationMetrics.desktop,
    emulatedUserAgent: lighthouseConstants.userAgents.desktop,
  },
};
