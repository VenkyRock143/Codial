const express            =       require('express');
const env                =       require('./config/environment');
const logger             =       require('morgan');
const cookieParser       =       require('cookie-parser');
const app                =       express();
require('./config/view_helper')(app);
const port               =       9000;
const expressLayouts     =       require('express-ejs-layouts');
const db                 =       require('./config/mongoose');
// used for session cookie
const session            =       require('express-session');
const passport           =       require('passport');
const passportLocal      =       require('./config/passport-local-strategy');
const passportJWT        =       require('./config/passport-jwt-strategy');
const passportGoogle     =       require('./config/passport-google-oauth-strategy')
const MongoStore         =       require('connect-mongo')(session);
const sassMiddleware     =       require('sass-middleware');
const flash              =       require('connect-flash');
const customMware        =       require('./config/middleware');
const path               =       require('path')


const { createClient } = require('redis');

// Initialize Redis client
const redisClient = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

// Handle Redis client events
redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis client connected'));
redisClient.on('ready', () => {
    console.log('Redis client is ready');

    // Setup the chat server to be used with socket.io
    const chatServer = require('http').createServer(app);
    const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
    chatServer.listen(5000);
    console.log('Chat server is listening on port 5000');

    // Express middleware setup
    if (env.name == 'development') {
        app.use(sassMiddleware({
            src: path.join(__dirname, env.asset_path, 'scss'),
            dest: path.join(__dirname, env.asset_path, 'css'),
            debug: true,
            outputStyle: 'extended',
            prefix: '/css'
        }));
    }

    app.use(express.urlencoded());
    app.use(cookieParser());
    app.use(express.static(env.asset_path));
    app.use('/uploads', express.static(__dirname + '/uploads'));
    app.use(logger(env.morgan.mode, env.morgan.options));
    app.use(expressLayouts);
    app.set('layout extractStyles', true);
    app.set('layout extractScripts', true);

    // Set up the view engine
    app.set('view engine', 'ejs');
    app.set('views', './views');

    // Mongostore is used to store the session cookie in db
    app.use(session({
        name: 'codeial',
        secret: env.session_cookie_key,
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: (1000 * 60 * 100)
        },
        store: new MongoStore({
            mongooseConnection: db,
            autoremove: 'disabled'
        }, (err) => {
            console.log(err || 'connect-mongodb setup ok');
        })
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.use(passport.setAuthenticatedUser);
    app.use(flash());
    app.use(customMware.setFlash);
    app.use('/', require('./routes'));

    app.listen(port, (err) => {
        if (err) {
            console.log(`Error in running the server: ${err}`);
        }
        console.log(`Server is running on port: ${port}`);
    });
});

// Connect to Redis server
redisClient.connect().catch(console.error);

