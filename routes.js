const scraping = require('./api/scraping');

module.exports = (app) => {
  app.use('/api/scraping', scraping);
}