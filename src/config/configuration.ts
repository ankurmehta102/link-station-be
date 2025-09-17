export default () => ({
  node_env: process.env.NODE_ENV,

  port: parseInt(process.env.PORT, 10) || 5000,

  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationSeconds:
      parseInt(process.env.JWT_ACCESS_EXPIRATION_SECONDS, 10) || 3600,
  },

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
});
