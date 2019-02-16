const dbuser = require('./keys_db').user;
const dbpassword = require('./keys_db').password;
const secretKey = require('./keys_db').secretKey;

module.exports = {
  mongoURI : `mongodb://${dbuser}:${dbpassword}@ds213259.mlab.com:13259/blood-share`,
  secretKey: secretKey
}
