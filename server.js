
require('dotenv').config();
const { PORT } = require('./config');
const app = require('./index');

app.listen(PORT, () => console.log(`Server runnig in port: ${PORT}`) );