const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix: Loại trừ source TypeScript files trong node_modules
// để tránh lỗi "Stripping types is currently unsupported"
config.resolver.blockList = [
  /node_modules\/.*\/src\/.*\.ts$/,
  /node_modules\/expo-modules-core\/src\/.*/,
];

// Đảm bảo chỉ resolve các file đã được compile
config.resolver.sourceExts = config.resolver.sourceExts.filter(
  ext => ext !== 'ts' && ext !== 'tsx'
).concat(['ts', 'tsx']);

module.exports = config;
