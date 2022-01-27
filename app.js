const express = require('express');
const app = express();
var mongoose = require('mongoose');
const bodyParser = require('body-parser')

app.use(bodyParser.json())

const postsRoute = require('./routes/posts');

app.use('/posts', postsRoute)

app.get('/' ,(req,res) => {
    res.send('homepage');
});

mongoose.connect(
    'mongodb+srv://koko:kluster@kluster.xx1gc.mongodb.net/Wthr5?retryWrites=true&w=majority' ,{ useNewUrlParser: true}, () => 
    console.log('mongoDB funkar!')
);

app.listen(8080)