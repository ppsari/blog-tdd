var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
const mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var articles = require('./routes/articles');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/users', users);
app.use('/api/articles', articles);

var env = app.settings.env;
var db_config = {
  development: 'mongodb://localhost/article',
  test:'mongodb://localhost/article-test'
}

mongoose.connect(db_config[env],(err,res)=>{
  console.log(err?err:'Berhasil connect ke '+db_config[env]);
})

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.listen(3000,()=>{console.log('server is listening at port 3000')});
module.exports = app;
