const { getDefaultConfig } = require("@react-native/metro-config");

const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push("sql");

module.exports = config;
