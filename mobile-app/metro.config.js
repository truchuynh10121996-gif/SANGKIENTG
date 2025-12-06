const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix lỗi "Stripping types is currently unsupported for files under node_modules"
// Expo SDK 54+ sử dụng native TypeScript stripping, nhưng không hỗ trợ cho node_modules
// Giải pháp: Tắt TypeScript stripping cho các files trong node_modules

// Cấu hình transformer
config.transformer = {
  ...config.transformer,
  // Cho phép require context
  unstable_allowRequireContext: true,
};

// Cấu hình resolver để xử lý đúng các package exports
config.resolver = {
  ...config.resolver,
  // Enable package exports để resolve đúng các entry points đã compile
  unstable_enablePackageExports: true,
  // Ưu tiên resolve theo thứ tự: require -> import -> default
  unstable_conditionNames: ['require', 'import', 'default'],
  // Ưu tiên các file đã compile (.js) thay vì source (.ts)
  resolverMainFields: ['react-native', 'browser', 'main'],
};

module.exports = config;
