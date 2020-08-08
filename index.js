'use strict'

// const rp = require('request-promise');
// const cheerio = require('cheerio');
// const fs = require('fs');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const passport = require('passport');
const mongoose = require('mongoose');

const { PORT } = require('./config');
const { mongo } = require('./config');
const routesConfig = require('./routes');

app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use(passport.initialize());
app.use(passport.session());


// Connect to MongoDB
mongoose.connect(mongo.uri, {  useCreateIndex: true, useUnifiedTopology: true, useNewUrlParser: true });
mongoose.connection.on('error', (err) => {
  console.error('Error', 'MongoDB connection error', {
    data: err,
    time: new Date().toISOString(),
  });
  process.exit(-1);
});


routesConfig(app);
// const URL = 'https://revistas.elpoli.edu.co/index.php/pol/issue/archive'; 

// fs.readFile('test.html', 'utf8', function (err,html) {
//   if (err) {
//     return console.log(err);
//   }
//   // console.log(html);
//   const getCompanies = async (baseURL) => {  
//     // const html = await rp(baseURL);
//     const $ = cheerio.load(html);
//     const issues = $("#issues").html();    
//     const urlArticles = $('div',issues).children('div').map((i,e)=> {
//       console.log($(e).text()) 
//       if($(e).children('h4').html()){
//         return {
//           titulo: $(e).children('h4').children('a').attr('href')
//         }
//       }  
//     }).get()
//     return urlArticles;
//   }

//   app.get("/", (req, res) => {
//     getCompanies(URL)
//         .then( result => res.send(result) )
//         .catch( error => res.send(error));     
//   })
  
// });

app.listen(PORT, () => console.log(`Server runnig in port: ${PORT}`) );
