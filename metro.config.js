const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ignore nested sub-projects so Metro does not crawl extraneous node_modules
config.resolver.blockList = [
  /my-expo-app[\\\/].*/,
];

module.exports = withNativeWind(config, { input: './global.css' });