
const env = require('./environment');
const fs = require('fs');
const path = require('path');


module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        if (env.name == 'development'){
            return filePath;
        }

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];
    }
}

// let revManifest;

// function getRevManifest() {
//   if (!revManifest) {
//     revManifest = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')));
//   }
//   return revManifest;
// }

// module.exports = (app) => {
//   app.locals.assetPath = function(filePath) {
//     if (env.name === 'development') {
//       return filePath;
//     }

//     const manifest = getRevManifest();
//     return '/' + manifest[filePath];
//   }
// };