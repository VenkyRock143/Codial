const express = require('express');
const app = express();
const port = 8000;

const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const cookieParser = require('cookie-parser');

app.use(express.urlencoded());
app.use(cookieParser());


app.use(expressLayouts);
app.use(express.static('./assets'));

app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

app.use('/',require('./router'));

app.set('view engine', 'ejs');
app.set('views','./views');


app.listen(port,function(err){
    if(err){
        console.log(`error occured:${error}`)
    }
        console.log(`running succesfully:${port}`)
});
