const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');


const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const accessLogStream = rfs.createStream('access.log', {
    interval: '1d',
    path: logDirectory
});



const development = {
    name: 'development',
    asset_path: './assets',
    session_cookie_key: 'gn1hyfZo34FHkH9LuDkpndCowJZJMIsH',
    db: 'codeial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'venky.balusani1@gmail.com',
            pass: 'lhibxfzivxhxwrjm'
        },tls: {
            rejectUnauthorized: false
        }
    },
    google_client_id: "1098500760309-37br3u6c2pcc9ni7969uf8q8cvna40mp.apps.googleusercontent.com",
    google_client_secret: "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",
    google_call_back_url: "http://localhost:9000/users/auth/google/callback",
    jwt_secret_key: '7sjvCQ0gMjowH7QjMBPsZLPMmasPhawg',
    morgan: {
        mode: 'dev',
        options: {stream: accessLogStream}
    }
}


const production =  {
    name: 'production',
    asset_path: process.env.CODEIAL_ASSET_PATH,
    session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY,
    db: process.env.CODEIAL_DB,
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.CODEIAL_GMAIL_USERNAME,
            pass: process.env.CODEIAL_GMAIL_PASSWORD
        },tls: {
            rejectUnauthorized: false
        }
    },
    google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
    google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
    google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_URL,
    jwt_secret_key: process.env.CODEIAL_JWT_SECRET,
    morgan: {
        mode: 'combined',
        options: {stream: accessLogStream}
    }
}



// module.exports = eval(process.env.CODEIAL_ENVIRONMENT) == undefined ? development : eval(process.env.CODEIAL_ENVIRONMENT);
module.exports = development;
// const fs = require('fs');
// const path = require('path');
// const rfs = require('rotating-file-stream');

// const logDirectory = path.join(__dirname, '../production_logs');
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory, { recursive: true });
// }

// const accessLogStream = rfs('access.log', {
//   interval: '1d',
//   path: logDirectory
// });

// const development = {
//   name: 'development',
//   asset_path: '/assets',
//   session_cookie_key: 'blahsomething',
//   db: 'codeial_development',
//   smtp: {
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'venky@gmail.com',
//       pass: 'lhibxfzivxgdheysg'
//     }
//   },
//   google_client_id: "1098500760309-37br3u6c2pcc9ni796g47sg28gh140mp.apps.googleusercontent.com",
//   google_client_secret: "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",
//   google_call_back_url: "http://localhost:1000/users/auth/google/callback",
//   jwt_secret_key: 'codeial',
//   morgan: {
//     mode: 'dev',
//     options: {stream: accessLogStream}
//   }
// };

// const production = {
//   name: 'production',
//   asset_path: process.env.CODEIAL_ASSET_PATH || '/assets',
//   session_cookie_key: process.env.CODEIAL_SESSION_COOKIE_KEY || 'blahsomething',
//   db: process.env.CODEIAL_DB || 'codeial_production',
//   smtp: {
//     service: 'gmail',
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: process.env.CODEIAL_GMAIL_USERNAME,
//       pass: process.env.CODEIAL_GMAIL_PASSWORD
//     }
//   },
//   google_client_id: process.env.CODEIAL_GOOGLE_CLIENT_ID,
//   google_client_secret: process.env.CODEIAL_GOOGLE_CLIENT_SECRET,
//   google_call_back_url: process.env.CODEIAL_GOOGLE_CALLBACK_RURL,
//   jwt_secret_key: process.env.CODEIAL_JWT_SECRET,
//   morgan: {
//     mode: 'combined',
//     options: {stream: accessLogStream}
//   }
// };
