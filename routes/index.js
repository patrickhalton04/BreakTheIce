var http = require('http');
var express = require('express');
var router = express.Router();
var url = require('url');

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

router.get('/', function(req, res, next) {

  res.render('index',{title: 'Home | Mountain Reports',
                      classname: 'home',
                      page: 'home'})

});

router.get('/mtn',function(req,res){


   res.render('index',{title: 'Mountain Info',
                       classname: 'mountain'
                       });

   res.render('mountain',{title: 'Mountain Info',
                       classname: 'mountain',
                       page: 'mountain',
                       obj:req.params.mountainpage});


});

router.get('/loginForm',function(req,res){

   res.render('login',{title: 'Mountain Info',
                       classname: 'search',
                       page: 'login'});
                       //obj:req.params.mountainpage});

});

module.exports = router;

