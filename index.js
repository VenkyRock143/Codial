const express = require('express');
const env = require('./config/environment');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const app = express();
require('./config/view_helper')(app);
const port = 9000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth-strategy');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const http = require('http');
const chatSockets = require('./config/chat_sockets').chatSockets;
const path = require('path');
const fs = require('fs');
const sass = require('sass');

// Setup the chat server to be used with socket.io
const chatServer = http.createServer(app);
chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening on port 5000');

if (env.name === 'development') {
    // Compile SCSS to CSS
    const result = sass.renderSync({
        file: path.join(__dirname, 'assets', 'scss', 'style.scss'),
        outFile: path.join(__dirname, 'assets', 'css', 'style.css'),
        outputStyle: 'extended'
    });

    // Write the result to a file
    fs.writeFileSync(path.join(__dirname, 'assets', 'css', 'style.css'), result.css);
}

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(env.asset_path));

// Make the uploads path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use(logger(env.morgan.mode, env.morgan.options));

app.use(expressLayouts);
// Extract style and scripts from subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// MongoStore is used to store the session cookie in db
app.use(session({
    name: 'codeial',
    // TODO: change the secret before deployment in production mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore({
        mongooseConnection: db,
        autoremove: 'disabled'
    }, function (err) {
        console.log(err || 'connect-mongodb setup ok');
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

// Use express router
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
    }
    console.log(`Server is running on port: ${port}`);
});
