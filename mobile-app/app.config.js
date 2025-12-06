// Dynamic config - extends app.json với environment variables
// File này cho phép sử dụng biến môi trường trong config

module.exports = ({ config }) => {
  // Đọc config từ app.json và chỉ override những gì cần thiết
  return {
    ...config,
    extra: {
      ...config.extra,
      eas: {
        // Sử dụng projectId từ env nếu có, nếu không dùng từ app.json
        projectId: process.env.EAS_PROJECT_ID || config.extra?.eas?.projectId || ""
      }
    }
  };
};
