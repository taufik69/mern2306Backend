const mongoose = require('mongoose');
const chalk = require('chalk')
const {DBName} = require('../Constant/constant.js')
const DbConnection =async ()=> {
    try {
        const connectionInfo =  await mongoose.connect(`${process.env.DATABASE_URL}/${DBName}`);
        console.log(
            chalk.blue.bgGreenBright.bold(`MongoDB Connected !! DB HOST !! ${
              (await connectionInfo).connection.host
            }`)            
          );        
    } catch (error) {
        console.log(chalk.bgRedBright(error));        
    }
}

module.exports = {DbConnection}