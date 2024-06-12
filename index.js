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

const redis = require('redis');
const redisClient = redis.createClient({
    url: 'redis://127.0.0.1:6379',
    socket: {
        connectTimeout: 50000, // increase connection timeout if needed
    },
});

redisClient.on('connect', function() {
    console.log('Connected to Redis');
});

redisClient.on('ready', function() {
    console.log('Redis client ready');
});

redisClient.on('error', function(err) {
    console.error('Redis error:', err);
});

redisClient.on('end', function() {
    console.log('Redis client disconnected');
});

redisClient.on('reconnecting', function() {
    console.log('Reconnecting to Redis');
});

(async () => {
    try {
        await redisClient.connect();
        
        // Perform Redis operations here
        await redisClient.set('key', 'value');
        const value = await redisClient.get('key');
        console.log('Value:', value);

        // Other server setup code goes here

        const chatServer = require('http').createServer(app);
        const chatSockets = require('./config/chat_sockets').chatSockets(chatServer, redisClient);
        chatServer.listen(5000);
        console.log('Chat server is listening on port 5000');

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
        //make the uploads path available to browser
        app.use('/uploads', express.static(__dirname + '/uploads'));
        app.use(logger(env.morgan.mode, env.morgan.options));

        app.use(expressLayouts);
        // extract style and scripts from sub pages into the layout
        app.set('layout extractStyles', true);
        app.set('layout extractScripts', true);

        // set up the view engine
        app.set('view engine', 'ejs');
        app.set('views', './views');

        //mongostore is used to store the session cookie in db
        app.use(session({
            name: 'codeial',
            // TODO change the secret before deployment in production mode
            secret: env.session_cookie_key,
            saveUninitialized: false,
            resave: false,
            cookie: {
                maxAge: (1000 * 60 * 100)
            },
            store: new MongoStore(
                {
                    mongooseConnection: db,
                    autoremove: 'disabled'
                },
                function(err) {
                    console.log(err || 'connect-mongodb setup ok');
                }
            )
        }));

        app.use(passport.initialize());
        app.use(passport.session());

        app.use(passport.setAuthenticatedUser);

        app.use(flash());
        app.use(customMware.setFlash);
        // use express router
        app.use('/', require('./routes'));

        app.listen(port, function(err) {
            if (err) {
                console.log(`Error in running the server: ${err}`);
            }
            console.log(`Server is running on port: ${port}`);
        });
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

//setup the chat serverto be used with socket.io
// const chatServer = require('http').createServer(app);
// const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
// chatServer.listen(5000);
// console.log('chat server is listening on port 5000')



// if (env.name == 'development'){
//     app.use(sassMiddleware({
//         src: path.join(__dirname, env.asset_path, 'scss'),
//         dest: path.join(__dirname, env.asset_path, 'css'),
//         debug: true,
//         outputStyle: 'extended',
//         prefix: '/css'
//     }));
// }



// app.use(express.urlencoded());

// app.use(cookieParser());

// app.use(express.static(env.asset_path));
// //make the uploads path available to browser
// app.use('/uploads', express.static(__dirname + '/uploads'));
// app.use(logger(env.morgan.mode, env.morgan.options));

// app.use(expressLayouts);
// // extract style and scripts from sub pages into the layout
// app.set('layout extractStyles', true);
// app.set('layout extractScripts', true);




// // set up the view engine
// app.set('view engine', 'ejs');
// app.set('views', './views');

// //mongostore is used to store the session cookie in db
// app.use(session({
//     name: 'codeial',
//     // TODO change the secret before deployment in production mode
//     secret: env.session_cookie_key,
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         maxAge: (1000 * 60 * 100)
//     },
//     store: new MongoStore(
//         {
//             mongooseConnection:db,
//             autoremove:'disabled'
//         }
//         ,
//         {
//             function(err){
//                 console.log(err || 'connect-mongodb setup ok')
//             }
//         }
        
//         )
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(passport.setAuthenticatedUser);

// app.use(flash());
// app.use(customMware.setFlash);
// // use express router
// app.use('/', require('./routes'));


// app.listen(port, function(err){
//     if (err){
//         console.log(`Error in running the server: ${err}`);
//     }

//     console.log(`Server is running on port: ${port}`);
// });
