const express = require('express')
const chalk = require('chalk')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello MERN ')
})

app.listen(process.env.PORT || 3000, ()=> {
    console.log(chalk.bgCyanBright(`Server Connected on Port http://localhost:${process.env.PORT}`));
})

