require("dotenv").config({ path: 'configs/.env' });
// Global configurations object contains Application Level variables such as:
// client secrets, passwords, connection strings, and misc flags
const configurations = {
  ConnectionStrings: {
    MongoDB: process.env.CONNECTION_STRING_MONGODB,
  },
  Authentication: {
    Google: {
      ClientId: process.env.GOOGLE_CLIENT_ID,
      ClientSecret: process.env.GOOGLE_CLIENT_SECRET,
      CallbackUrl: process.env.GOOGLE_CALLBACK_URL
    },
  },
};
module.exports = configurations;