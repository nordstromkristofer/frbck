const app = require ('express')
const app = express();

//import routes
const authRoute = requre ('/routes.auth');


//route middlewares
app.use('/api/user', authRoute);


app.listen(5500, ()=> console.log('API-routing igång på 5500'))


