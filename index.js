const cron = require('node-cron');
const moment = require('moment');
var mongoose = require('mongoose');

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
const http = require('http');
var mime = require('mime-types');
// const https = require('https');
var app = express();
var ErrorManagement = require('./Server/Handling/ErrorHandling.js');
var LogManagement = require('./Server/Handling/LogHandling.js');   


// var PaymentManagement = require('../../Models/PaymentManagement.model');

// var PaymentReminderFunction = require('./Server/helper/pushNotification').PushNotification.PaymentReminderFunction();
// var MondayNotificationFunction = require('./Server/helper/pushNotification').PushNotification.MondayNotificationFunction();
// var BuyerCreditLimitUnitizedFunction = require('./Server/helper/pushNotification').PushNotification.BuyerCreditLimitUnitizedFunction();
// var SellerCreditLimitUnitizedFunction = require('./Server/helper/pushNotification').PushNotification.SellerCreditLimitUnitizedFunction();
// var TopFiveHundiScoreFunction = require('./Server/helper/pushNotification').PushNotification.TopFiveHundiScoreFunction();
// var ReminderForInvoiceAcceptanceFunction = require('./Server/helper/pushNotification').PushNotification.ReminderForInvoiceAcceptanceFunction();

var SellerMonthlyReportsFunction = require('./Server/helper/monthlyReports').MonthlyReports.SellerMonthlyReportsFunction();
var BuyerMonthlyReportsFunction = require('./Server/helper/monthlyReports').MonthlyReports.BuyerMonthlyReportsFunction();
var multer = require('multer');
fs = require('fs-extra');
var server = require('http').Server(app);
global.io = require('socket.io')(server);
// var fileName =express();
app.use('Uploads/Customer_Profile/',express.static('profile_image'))
app.use('/Uploads/Customer_Profile', express.static(path.join(__dirname, 'Uploads/Customer_Profile')));
// app.use('/APP_API/Customer_Image', express.static('Uploads/Customer_Profile/'));
// Certificate
   // const privateKey = fs.readFileSync('privkey.pem', 'utf8');
   // const certificate = fs.readFileSync('cert.pem', 'utf8');
   // const ca = fs.readFileSync('chain.pem', 'utf8');

   // const credentials = {
   // 	key: privateKey,
   // 	cert: certificate,
   // 	ca: ca
   // };
// Http/Https Config and Redirect 
   const httpServer = http.createServer(app);
   // const httpsServer = https.createServer(credentials, app);

   // http.createServer(function (req, res) {
   //    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
   //    res.end();
   // }).listen(80);
// var SocketHandling = require('./Server/helper/socket-handling');


// Invoice And Payment Auto accept 

// var InvoiceAutoAccept = require('./Server/InvoiceAutoAccept.js').InvoiceAutoAccept;
// var PaymentAutoAccept = require('./Server/PaymentAutoAccept.js').PaymentAutoAccept;

// Process On Every Error
   process.setMaxListeners(0);
   process.on('unhandledRejection', (reason, promise) => {
      console.error('Un Handled Rejection');    
      // console.log(reason);  
      ErrorManagement.ErrorHandling.ErrorLogCreation('', 'Un Handled Rejection', '', reason);
   });
   process.on('uncaughtException', function (err) {
      console.log(err);
       
      console.error('Un Caught Exception');
      ErrorManagement.ErrorHandling.ErrorLogCreation('', 'Un Caught Exception', '', err.toString());
   });

   
// DB Connection
   // const uri = "mongodb://localhost:27017/Aquila-Local";
   // const uri = "mongodb://10.10.20.210:27017/Aquila-Stage-Temp";
   // const uri = "mongodb://10.10.20.210:27017/Aquila-Stage";
   const uri = "mongodb://10.10.20.210:27017/Aquila-Hundi-Global-Stage";

   mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
   
   mongoose.connection.on('error', function (err) {
      console.log('Mongodb Connection Error');
      // console.log(err); 
   });
   mongoose.connection.once('open', function () {
      console.log('DB Connectivity, Success!');
   });

// Middleware 
   app.use(cors());
   app.use(bodyParser.urlencoded({ limit: '15mb', extended: true, parameterLimit: 100000 }));
   app.use(bodyParser.json({ limit: '15mb' }));

// Socket IO Connection
var numClients = 0;
io.on('connection', (socket) => {
   numClients++;
   console.log('Connected clients:', numClients);

   socket.on('join',function(random){
      socket.join(random);
      socket.emit('res', {mes: "you are added namespace in " + random});
   });

   socket.on('disconnect', function() {
      numClients--;
      console.log('Connected clients:', numClients);
  });
});

// console log all api hits

app.use((req, res, next) => {
   // console.log('Time:', Date.now());
   // console.log('Request Type:', req.method);
   // console.log('Request URL:', req.originalUrl);
   next();
}
);

 
// Every request Log Creation 
   app.use('/APP_API/', function (req, res, next) { 
      LogManagement.LogHandling.LogCreation('APP', req); 
      return next();
   }); 
   app.use('/Web_API/', function (req, res, next) { 
      LogManagement.LogHandling.LogCreation('Web', req); 
      return next();
   }); 
   app.use('/Admin_API/', function (req, res, next) { 
      LogManagement.LogHandling.LogCreation('Admin', req); 
      return next();
   }); 


// Static URL
   app.use('/APP_API/Customer_Image', express.static('Uploads/Customer_Profile/'));
   app.use('/APP_API/Invoice', express.static('Uploads/Invoice/'));
   app.use('/APP_API/Payment', express.static('Uploads/Payment/'));
   app.use('/APP_API/BuyerPdfFiles', express.static('Uploads/BuyerPDF/'));
   app.use('/APP_API/SellerPdfFiles', express.static('Uploads/SellerPDF/'));
// Admin URL
   require('./Server/Routes/Admin/industryManagement.routes')(app);
   require('./Server/Routes/Admin/userManagement.routes')(app);
   require('./Server/Routes/Admin/SupportManagement.routes')(app);
   require('./Server/Routes/Admin/customer.routes')(app);
// Web URL
   require('./Server/Routes/Web/Registration.routes')(app);
   require('./Server/Routes/Web/BusinessAndBranches.routes')(app);
   require('./Server/Routes/Web/Invite.routes')(app);
   require('./Server/Routes/Web/Invoice.routes')(app);
   require('./Server/Routes/Web/Payment.routes')(app);
   require('./Server/Routes/Web/HundiScore.routes')(app);
   require('./Server/Routes/Web/supportManagement.routes')(app);
   require('./Server/Routes/Web/TemporaryCredit.routes')(app);
// App URL
   require('./Server/Routes/App/Common.routes')(app);
   require('./Server/Routes/App/Customer.routes')(app);
   require('./Server/Routes/App/BusinessAndBranchManagement.routes')(app);
   require('./Server/Routes/App/InviteManagement.routes')(app);
   require('./Server/Routes/App/InvoiceManagement.routes')(app);
   require('./Server/Routes/App/Payment.routes')(app);
   require('./Server/Routes/App/SupportManagement.routes')(app);
   require('./Server/Routes/App/DeviceManagement.routes')(app);
   require('./Server/Routes/App/TemporaryCredit.routes')(app);
   require('./Server/Routes/App/LocationManagement.routes')(app);
   require('./Server/Routes/App/HundiScoreManagement.routes')(app);   
   require('./Server/Routes/App/SocketIo.routes')(app);



// Web Access
   app.use('/*.html|/*.js|/*.css|/*.png|/*.jpg|/*.svg|/*.ico|/*.ttf|/*.woff|/*.txt|/*.eot|/*.json', function (req, res, next) {
      if (req.headers['accept-encoding'] && req.headers.host === 'aquila-admin.pptsglobal.com') {
         const cond = req.headers['accept-encoding'].includes('gzip');
         if (cond) {
            const contentType = mime.lookup(req.originalUrl);
            req.url = req.url + '.gz';
            res.set('Content-Encoding', 'gzip');
            res.set('Content-Type', contentType);
         }
      }
      next();
   });

   app.use(express.static(__dirname + '/Admin/dist/Admin/'));
   app.use(express.static(__dirname + '/Client/dist/Client/'));
   app.use(function(req, res) {
      res.sendFile(path.join(__dirname, '/Admin/dist/Admin', 'index.html'));
   });
  // Set up the middleware stack
   // app.use('/', function(req, res, next) {
      // if (req.headers.host === 'aquila-client.pptssolutions.com') {
      //    express.static(__dirname + '/Client/dist/Client/')(req, res, next);
      // }
      // if (req.headers.host === 'aquila.pptssolutions.com.com') {
      //    express.static(__dirname + '/Admin/dist/Admin/')(req, res, next);
      // }
   // });
   // app.use('/', function(req, res, next) {
   //    if (req.headers.host === 'aquila-client.pptssolutions.com') {
   //       res.sendFile(path.join(__dirname, '/Client/dist/Client', 'index.html'));
   //    }
   //    if (req.headers.host === 'aquila-admin.pptssolutions.com') {
   //       res.sendFile(path.join(__dirname, '/Admin/dist/Admin', 'index.html'));
   //    }
   // });


// 404 
   app.use('*', function (req, res) {
      res.sendFile(path.join(__dirname+'/404-Error.html'));
   });
   
// Connect Http
   httpServer.listen(3003, () => {
      console.log('HTTP Server running on port 3003');
   });


  
  