const scraping = require('./api/scraping');
const user = require('./api/user');
const auth = require('./auth');

module.exports = (app) => {
  app.use('/api/scraping', scraping);
  app.use('/api/users', user);
  app.use('/auth', auth);
}