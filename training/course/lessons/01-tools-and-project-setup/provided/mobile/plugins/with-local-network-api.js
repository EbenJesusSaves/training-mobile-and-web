/**
 * Expo config plugin (applies to development/preview builds, not Expo Go).
 *
 * Training APIs run over plain HTTP on a laptop (e.g. http://192.168.1.20:3000). Release builds block
 * that by default, so this plugin:
 *  - Android: allows cleartext HTTP traffic.
 *  - iOS: allows HTTP to local-network hosts (NSAllowsLocalNetworking).
 * Remove it before shipping anything that talks to a production (HTTPS) API.
 */
const { withAndroidManifest, withInfoPlist } = require('expo/config-plugins');

function withLocalNetworkApi(config) {
  config = withAndroidManifest(config, (mod) => {
    const application = mod.modResults.manifest.application?.[0];
    if (application) application.$['android:usesCleartextTraffic'] = 'true';
    return mod;
  });
  config = withInfoPlist(config, (mod) => {
    const ats = mod.modResults.NSAppTransportSecurity ?? {};
    mod.modResults.NSAppTransportSecurity = { ...ats, NSAllowsLocalNetworking: true };
    return mod;
  });
  return config;
}

module.exports = withLocalNetworkApi;
