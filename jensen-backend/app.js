const credentials = {secretUser:"user" , secretPassword:"password"}

const cors = require("cors")
const express = require("express")
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const https = require ('https')
const path = require('path')
const fs = require('fs')



const app = express()
// const PORT = process.env.PORT || 5500

app.use(function (req, res, next) {
   res.setHeader('Content-Security-Policy', "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'");
   next();
});

app.use('/healthcheck', require('./routes/healthcheck.routes'));

app.use(express.urlencoded({ extended: true }));
app.use(cors())


const sslServer = https.createServer({
   key: fs.readFileSync(path.join(__dirname, 'certificates', 'key.pem')),
   cert: fs.readFileSync(path.join(__dirname, 'certificates', 'cert.pem')),
   },
   app
)

sslServer.listen(5500,()=> console.log('Säker server på 5500'))
// SSL


app.use('/', (req,res,next)=>{
   res.send('Tjena från SSL')
})


app.get("/", (req ,res)=>{
   headers={"http_status":200, "cache-control":  "no-cache"}
   body={"status": "available"}
   res.status(200).send(body)
})

app.get("/health", (req ,res)=>{
   headers={"http_status":200, "cache-control":  "no-cache"}
   body={"status": "framgång"}
   res.status(200).send(body)
})


app.post('/authorize', (req, res) => {
   // Insert Login Code Here
   let user = req.body.user;
   let password = req.body.password;
   console.log(`User ${user}`)
   console.log(`Password ${password}`)

   if(user===credentials.secretUser && password===credentials.secretPassword){
      console.log("Authorized")
      const token = jwt.sign({
            data: 'foobar'
      }, 'your-secret-key-here', { expiresIn: 60 * 60 }); 

      console.log(token)
      res.status(200).send(token)
  }else{
      console.log("Not authorized")
      res.status(200).send({"STATUS":"FAILURE"})
   }
});

// app.listen(PORT , ()=>{
//      console.log(`Lyssnar på port ${PORT}`)
// });