const express = require('express');
const app = express();
const port = 8000;
const homeController = require('../Codial/controller/home_controller')

app.use('/',require('./router'))
app.listen(port,function(err){
    if(err){
        console.log(`error occured:${error}`)
    }
        console.log(`running succesfully:${port}`)
});
