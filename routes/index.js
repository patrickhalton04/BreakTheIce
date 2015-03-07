var httpAdapter = require('http');
var https = require('https');
var geocoderProvider = 'google';
var request = require('request');
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var url = require('url');
var mysql = require('mysql');
var liftie = require('liftie');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var geolocation = require('geolocation');

var connection = mysql.createConnection({
    user     : 'root',
    password : 'root',
    host     : 'localhost',
    port: '8889',
    database : 'asl_node'
});

connection.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index',{title: 'Home | Mountain Reports',
        classname: 'home',
        page: 'home'})

});


// var geocoderProvider = 'google';
// var extra = {
//     apiKey: 'AIzaSyCeCU2QmSLPuQyTckS0K-bzbHtC8sIcziM',
//     formatter: null
// };
// var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter, extra);

// geocoder.geocode('29 champs elysée paris', function(err, res) {
//     console.log(res);
// });

router.get('/powderlines',function(req,res){
    request('http://api.powderlin.es/station/791:WA:SNTL?start_date=2013-01-15&end_date=2013-01-15', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Show the HTML for the Google homepage.
        }

    });
});

router.get('/locate',function(req,res){

  navigator.geolocation.getCurrentPosition(function (err, position) {
        if (err) throw err;
        console.log(position);
    });

});

router.get('/mountain',function(req,res){
    var plAPI = 'http://api.powderlin.es/station/791:WA:SNTL?start_date=2013-01-15&end_date=2013-01-15';
    request(plAPI, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var parsedJSON = JSON.parse(body);
            res.render('mountain',{title: 'Mountain Info',
                classname: 'mountain',
                page: 'mountain',
                name: parsedJSON.station_information.name

            });
        }

    });


});

// router.get('/test',function(req,res){
//     geocoder.geocode('29 champs elysée paris')
//         .then(function(res) {
//             console.log(res);
//         })
//         .catch(function(err) {
//             console.log(err);
//         });

// });

router.get('/processSearch',function(req,res){

    console.log('work mother fucker');
});





router.get('/loginForm',function(req,res){

    res.render('login',{title: 'Mountain Info',
        classname: 'search',
        page: 'login'});

});

router.post('/processLogin',function(req,res){

    passport.use(new LocalStrategy({
        usernameInput = 'username',//req.body.username,
        passwordInput = 'password'//req.body.password
    },
      function(username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) { return done(err); }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect password.' });
          }
          return done(null, user);
        });
      }
    ));

    

    var checkUser = 'SELECT username, password from users where username = '+usernameInput+' and password = '+passwordInput;
    connection.query(checkUser, function(err,rows,fields){
        res.render('user',{title: 'User Page',
            classname: 'user',
            page: 'user',
            username: req.body.username,
            password: req.body.password
        });
    });
});

router.post('/addUser',function(req,res){

    emailInput = req.body.email;
    usernameInput = req.body.username;
    passwordInput = req.body.password;

    var post = {email:emailInput,username:usernameInput,password:passwordInput};

    var query = connection.query('INSERT INTO users SET?',post,function(err,result){

    });

    console.log(query.sql);

    res.redirect('/');

});

router.get('/checkUsers',function(req,res){
    var check = 'SELECT * FROM users';
    connection.query(check, function(err,rows,fields){
        if(err) throw err;

        for(var i in rows){
            res.render('user',{title: 'User Page',
                classname: 'user',
                page: 'user',
                username: rows[i].username,
                password: rows[i].password
            });
            console.log(rows[i].username);
            console.log(rows[i].password);
        }
    });

});


//connection.end();

module.exports = router;

