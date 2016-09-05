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

    const passport = require('passport');
    const LocalStrategy = require('passport-local').Strategy;
    const User = require('../models/User.js');
    const bodyParser = require('body-parser');

    const mongoose = require('mongoose');

    // dev mode (hot reload etc) is default, unless you set the environment variable
    // (it is set for you by default when you run npm run build, which builds the production app)
    const isDeveloping = process.env.NODE_ENV !== 'production';

    // connect to the mongo database
    const mongoAddress = isDeveloping ? 'mongodb://localhost/tomgrek_com' : 'mongodb://devMongo:27017/tomgrek_com';
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

    /* some sample db functions
      db.once('open', function() {
      User.find({}).then(function(data) { console.log(data); });
      User.findById(new mongoose.Types.ObjectId('57cc9cc8a14964733c889966')).then(function(data) {
        console.log(data);
      });
      // the first time you run, uncomment this (or create user in mongo console)
      //var newuser = new User({username:'y'});
      //newuser.password = newuser.generateHash('y');
      //newuser.save(function(err,data) { console.log(err,data); });
    });*/

    // default port is 3000, unless you've set an environment variable
    const port = isDeveloping ? 3000 : process.env.PORT;
    // create the app (Express server)
    const app = express();

    // serve static files - JS, CSS, fonts etc - from the public directory
    // e.g. on the filesystem /home/app/public/jquery.js would become http://localhost:3000/jquery.js
    app.use(express.static('public'));

    // all this code is for mongo session store for express, and passport.js for users/login
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(require('cookie-parser')());
    const expressSession = require('express-session');
    const MongoStore = require('connect-mongo')(expressSession);
    app.use(expressSession({ secret: 'mysecret', resave:true, saveUninitialized:true, store: new MongoStore({mongooseConnection:db, collection:'session'})}));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });
    passport.deserializeUser(function(id, done) {
      User.findById(mongoose.mongo.ObjectId(id), function(err, user) {
        done(null, user);
      });
    });
    passport.use(new LocalStrategy(function(username, password, done) {
      User.findOne({ username: username }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        if (!user.validPassword(password)) { return done(null, false); }
        return done(null, user);
      });
    }));

    // an example route
    app.get('/example_rest_endpoint/:id', function response(req, res) {
      res.write(`hello ${req.params.id}`); // or you can use res.json({some object})
      res.end();
    });

    // this route is called asynchronously from the React App component, it then saves the logged-in user's username to the store
    app.get('/getLoggedInUsername', function response(req, res) {
      res.write(req.user ? req.user.username : 'Not Logged In');
      res.end();
    });
    app.post('/login',
    passport.authenticate('local', { failureRedirect: '/tryLogin/failed' }),
    function(req, res) {
      res.redirect('/');
    });

    // be sure to specify all React routes (see app/main.js) (at least to their first /) here.
    // they must not be used by a name in the filesystem, i.e. anything in the 'public' dir.
    // set auth = true if the route requires being logged in
    const reactRoutes = [{path: '/abc', auth: true}, {path: '/tryLogin', auth: false}];

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
      // if the routes above didn't do anything, then just pass it to React Router
      app.get('*', function response(req, res) {
        res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '../dist/index.html')));
        res.end();
      });
    } else {
      app.use(express.static(__dirname + '../dist'));
      app.get('*', function response(req, res) {
          var routeFound = false;
          for (var rt of reactRoutes) {
            if (rt.path === req.url.slice(0, rt.path.length)) {
              routeFound = true;
              if (rt.auth === false || req.isAuthenticated()) {
                res.sendFile(path.join(__dirname, '../dist/index.html'));
              } else {
                res.status(401).sendFile(path.join(__dirname, '../public', 'unauth.html'));
              }
              break;
            }
          }
          if (!routeFound) res.sendFile(path.join(__dirname, '../dist', req.url));
      });
    }

    // if all else fails, send a 404 error using the React 404 component
    app.use(function(err, req, res, next) {
      console.log(err);
      res.status(404).sendFile(path.join(__dirname, '../dist/index.html'));
    });

    app.listen(port, '0.0.0.0', function onStart(err) {
      if (err) {
        console.log(err);
      }
      console.info('Listening on port %s.', port);
    });
};

main();
