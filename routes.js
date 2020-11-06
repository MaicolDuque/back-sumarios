const scraping = require('./api/scraping');
const user = require('./api/user');
const article = require('./api/article');
const auth = require('./auth');
const contactList = require('./api/contact-list');
const summary = require('./api/summary');
const contact = require('./api/contact');

module.exports = (app) => {
  app.use('/api/scraping', scraping);
  app.use('/api/users', user);
  app.use('/auth', auth);
  app.use('/api/contact-list', contactList);
  app.use('/api/contact', contact);
  app.use('/api/articles', article);
  app.use('/api/summaries', summary);
}