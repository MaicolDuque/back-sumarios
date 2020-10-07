
const { mongo } = require('./config');

module.exports = (mongoose) => {
  // Connect to MongoDB
  mongoose.connect(mongo.uri, {  useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
  mongoose.connection.on('error', (err) => {
    console.error('Error', 'MongoDB connection error', {
      data: err,
      time: new Date().toISOString(),
    });
    process.exit(-1);
  });
  mongoose.connection.once('open', function() {
    console.log("We are connected to database...");
  });
}