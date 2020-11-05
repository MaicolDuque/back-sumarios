/**
 * Default specific configuration
  * @author: Maicol Felipe Duque Urrea <maicolduque01@gmail.com>
 */

const all = {
  env: process.env.NODE_ENV,

  // Server port
  PORT: process.env.PORT || 3000,

  // URL front
  URL_FRONT: process.env.URL_FRONT,

  // Server IP
  ip: process.env.IP || '127.0.0.1',

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: process.env.SECRETS_SESSION,
  },

  commonWords: [' ', '', 'A', 'DE', 'DEL', 'DESDE', 'COMO', 'CÓMO', ',', 'EN', 'LA', 'UN', 'LOS', 'LAS', 'ESTE', 'EL', 'Y', 'QUE', 'LO', 'SE', 'PARA', 'THE', 'CON',
    'CONTRA', 'POR', '-', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '45', '70', '99', 
    '100', '130'],


  userRoles: ['editor', 'admin'],

  // Credentials to login with Google and passport
  google: {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },

  // MongoDB connection options
  mongo: {
    uri: process.env.MONGODB_URI,
    db: process.env.NAME_DB,
  },
};

module.exports = all;
