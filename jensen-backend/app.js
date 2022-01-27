const credentials = {secretUser:"user" , secretPassword:"password"}

const cors = require("cors")
const express = require("express")
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const https = require ('https')
const path = require('path')
const fs = require('fs')
const mongoose = require ('mongoose')
const dotenv = require ('dotenv');

dotenv.config();

//db connect
mongoose.connect(
   process.env.DB_CONNECT,
   () => console.log('DB connectad iaf!')
);

//audit
// var mongoose = require('mongoose');
// var auditLog = require('audit-log');
// auditLog.addTransport("mongoose");
// mongoose.connect(
//    'mongodb+srv://koko:kluster1@kluster1.xx1gc.mongodb.net/Wthr5?retryWrites=true&w=majority' ,{ useNewUrlParser: true}, () => 
//    console.log('mongoDB funkar!'));
//    schema = new mongoose.Schema({ ... });
// // mongosh "mongodb+srv://kluster1.xx1gc.mongodb.net/myFirstDatabase" --username <username>
// // either or both -- up to you where your messages are sent!
// auditLog.addTransport("console");



 const app = express()
 const PORT = process.env.PORT || 5500
 app.listen(PORT , ()=>{
      console.log(`Lyssnar på port ${PORT}`)
 });



 //import routes
const authRoute = require ('./routes/auth');


//route middlewares
app.use('/api/user', authRoute);




//heroku
 app.use(function (req, res, next) {
   res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'");
    next();
 });

 app.use('/healthcheck', require('./routes/healthcheck.routes'));

 app.use(express.urlencoded({ extended: true }));
 app.use(cors())



// SSL
 const sslServer = https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem')),
    },
    app
 )
 sslServer.listen(5000,()=> console.log('Säker server på 5000'))
 app.use('/', (req,res,next)=>{
    res.send('Tjena från SSL')
 });
