const express            =       require('express');
const env                =       require('./config/environment');
const logger             =       require('morgan');
const cookieParser       =       require('cookie-parser');
require('dotenv').config();
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
// const { redisClient, redisStore } = require('./config/redis');

const { createClient } = require('redis');
const RedisStore = require('connect-redis');

// Log the Redis URL for debugging
console.log('Connecting to Redis at:', process.env.REDIS_URL);

(async () => {
  try {
    // Connect to your Redis instance using the REDIS_URL environment variable
    const client = createClient({
      url: process.env.REDIS_URL
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    console.log('Connected to Redis successfully');

    // Setup the chat server to be used with socket.io
    const chatServer = require('http').createServer(app);
    const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
    chatServer.listen(5000);
    console.log('chat server is listening on port 5000');

    if (env.name == 'development') {
      app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'extended',
        prefix: '/css'
      }));
    }

    app.use(express.urlencoded({ extended: true }));

    app.use(cookieParser());

    app.use(express.static(env.asset_path));
    // Make the uploads path available to browser
    app.use('/uploads', express.static(__dirname + '/uploads'));
    app.use(logger(env.morgan.mode, env.morgan.options));

    app.use(expressLayouts);
    // Extract style and scripts from sub pages into the layout
    app.set('layout extractStyles', true);
    app.set('layout extractScripts', true);

    // Set up the view engine
    app.set('view engine', 'ejs');
    app.set('views', './views');

    // Setup session management
    app.use(session({
      name: 'codeial',
      // TODO change the secret before deployment in production mode
      secret: env.session_cookie_key,
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: (1000 * 60 * 100)
      },
      store: new RedisStore({ client })
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
  } catch (err) {
    console.error('Error connecting to Redis', err);
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
//     // store: redisStore
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
