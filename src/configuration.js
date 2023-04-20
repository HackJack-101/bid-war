export default {
    port: process.env.PORT,
    host: process.env.HOST,
    mongoUri: process.env.MONGODB_ADDON_URI,
    env: process.env.NODE_ENV,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    clientRedirectUri: process.env.CLIENT_REDIRECT_URI
};
