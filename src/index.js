require('dotenv').config()
const { DbConnection } = require('./DatabaseConfiguration/DbConfiguration.js')
const app = require('./App.js');
// Database Connection method
DbConnection();




