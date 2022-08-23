var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var indexRouter = require('./routes/index');
var productList = require('./routes/api/products/productList');
var searchPorduct= require('./routes/api/products/search');
var productDetails = require('./routes/api/products/details');
var createProduct = require('./routes/api/products/create');
var userSignUP = require('./routes/api/users/signup');
var userSignIN = require('./routes/api/users/signIn');
var getProfile = require('./routes/api/users/getProfile');
var checkoutOrders = require('./routes/api/orders/checkout');
var getOrderDara = require('./routes/api/orders/data');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { networkInterfaces } = require('os');
const nets = networkInterfaces();

var app = express();
require('dotenv').config()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/', indexRouter);

app.use(`/api/${process.env.API_VERISON}/products/search`,searchPorduct);
app.use(`/api/${process.env.API_VERISON}/products/details`,productDetails);
app.use(`/api/${process.env.API_VERISON}/products/create`,createProduct);
app.use(`/api/${process.env.API_VERISON}/products/`,productList);

app.use(`/api/${process.env.API_VERISON}/users`,getProfile);
app.use(`/api/${process.env.API_VERISON}/users/signup`,userSignUP);
app.use(`/api/${process.env.API_VERISON}/users/signin`,userSignIN);

app.use(`/api/${process.env.API_VERISON}/orders`,checkoutOrders);
app.use(`/api/${process.env.API_VERISON}/orders/data`,getOrderDara);

app.use(`/api/${process.env.API_VERISON}/ip`,(req, res,)=>{
  const results = Object.create(null);

  for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
          // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
          if (net.family === 'IPv4' && !net.internal) {
              if (!results[name]) {
                  results[name] = [];
              }
              results[name].push(net.address);
          }
      }
  }
  res.send(results["eth0"][0])
})
app.use('/api/public', express.static(path.join(__dirname, './static')));
app.use('/admin',express.static(path.join(__dirname, 'public')));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

module.exports = app;
