/* Skeleton server application
to get started at localhost: npm install / npm run start_dev
on the server: npm install / npm run build / docker build -t [imageName] .
then start a mongo container: screen docker run --restart=always --name devMongo -p 27017:27017 -d mongo
then deploy: docker run  --restart=always [--name MyContainer] --link devMongo:devMongo -p [PORT exposed to the outside e.g. 80]:3000 [imageName]
see README.md for step-by-step instructions
*/

function main() {
    const path = require('path');
    const express = require('express');
    const webpack = require('webpack');
    const webpackMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    const config = require('../webpack.config.js');

    const mongoose = require('mongoose');

    // dev mode (hot reload etc) is default, unless you set the environment variable
    // (it is set for you by default when you run npm run build, which builds the production app)
    const isDeveloping = process.env.NODE_ENV !== 'production';

    // connect to the mongo database
    const mongoAddress = isDeveloping ? 'mongodb://localhost/project' : 'mongodb://devMongo:27017/project';
    mongoose.Promise = Promise;
    mongoose.connect(mongoAddress);
    var db = mongoose.connection;
    // error logging - you may want to handle this differently
    db.on('error',console.error);
    // close the database connection on process exit
    var gracefulExit = function() {
      db.close(function () {
        console.log('Database connection safely closed.');
        process.exit(0);
      });
    }
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

    /*some simple, example db operations.
    db.once('open', function() {
      const Name = require('./models/Name.js');
      var aFirstDataItem = new Name({_id:'1',name:'Created within bootcamp-skeleton'});
      aFirstDataItem.save( function(err,data) { console.log(data); });
      Name.find({}).then(function(data) { console.log(data); });
    });*/

    // default port is 3000, unless you've set an environment variable
    const port = isDeveloping ? 3000 : process.env.PORT;
    // create the app (Express server)
    const app = express();

    // serve static files - JS, CSS, fonts etc - from the public directory
    // e.g. on the filesystem /home/app/public/jquery.js would become http://localhost:3000/jquery.js
    app.use(express.static('public'));

    // bundle a bunch of useful things in if we're in dev mode (i.e. running on local machine)
    if (isDeveloping) {
      const compiler = webpack(config);
      const middleware = webpackMiddleware(compiler, {
        publicPath: config.output.publicPath,
        contentBase: 'src',
        stats: {
          colors: true,
          hash: false,
          timings: true,
          chunks: false,
          chunkModules: false,
          modules: false
        }
      });
      app.use(middleware);
      app.use(webpackHotMiddleware(compiler));

      // an example route
      app.get('/example_rest_endpoint/:id', function response(req, res) {
        res.write(`hello ${req.params.id}`); // or you can use res.json({some object})
        res.end();
      });

      // if the routes above didn't do anything, then do this:
      app.get('/', function response(req, res) {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')));
        res.end();
      });

      // but if we're in production, do this instead:
    } else {
      app.use('/public', express.static('public'));
      app.use(express.static(__dirname + '../dist'));
      app.get('/', function response(req, res) {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
      });
    }

    app.listen(port, '0.0.0.0', function onStart(err) {
      if (err) {
        console.log(err);
      }
      console.info('Listening on port %s.', port);
    });
};

main();

// import functions from other files as follows (which is good practice)
var multiply = require('../functions/multiply.js').multiply;
