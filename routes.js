const scraping = require('./api/scraping');
const user = require('./api/user');
const article = require('./api/article');
const auth = require('./auth');
const contactList = require('./api/contact-list');

module.exports = (app) => {
  app.use('/api/scraping', scraping);
  app.use('/api/users', user);
  app.use('/auth', auth);
  app.use('/api/contact-list', contactList);
  app.use('/api/articles', article);
}