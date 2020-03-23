var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connect = require('./dbConnect')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();
var http = require('http').Server(app)
var io = require('socket.io')(http)


io.on('connection',function(socket){  
  console.log("A user is connected");
  socket.on('status added',function(status){
    add_status(status,function(res){
      if(res){
          io.emit('refresh feed',status);
      } else {
          io.emit('error');
      }
    });
  });
});


var add_status = function (status,callback) {
  
  connect.getConnection(function(err,connection){
      if (err) {
        callback(false);
        return;
      }
  connection.query("INSERT INTO `employee` (`name`) VALUES ('"+status+"')",function(err,rows){
          connection.release();
          if(!err) {
            callback(true);
          }
      });
   connection.on('error', function(err) {
            callback(false);
            return;
      });
  });
}


connect.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log(process.env,'testttttt');
  console.log('Connection established');
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
