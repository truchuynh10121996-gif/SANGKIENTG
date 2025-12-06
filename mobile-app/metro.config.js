const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Cấu hình resolver để ưu tiên file .js đã compile thay vì .ts source
config.resolver = {
  ...config.resolver,
  // Ưu tiên resolve các file đã compile (.js) thay vì source (.ts)
  resolverMainFields: ['react-native', 'browser', 'main'],
  // Thêm sourceExts để xử lý đúng các loại file
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
};

module.exports = config;
