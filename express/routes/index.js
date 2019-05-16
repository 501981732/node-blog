var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.ejs',{tem:'ejs'});
});
router.get('/index.html', function(req, res, next) {
  res.render('index.ejs',{tem:'ejs'});
});
router.get('/edit.html', function(req, res, next) {
  res.render('edit.ejs',{tem:'ejs'});
});

router.get('/login.html', function(req, res, next) {
  res.render('login.ejs',{tem:'ejs'});
});

router.get('/admin.html', function(req, res, next) {
  res.render('admin.ejs',{tem:'ejs'});
});

router.get('/detail.html', function(req, res, next) {
  res.render('detail.ejs',{tem:'ejs'});
});
router.get('/new.html', function(req, res, next) {
  res.render('new.ejs',{tem:'ejs'});
});

module.exports = router;
