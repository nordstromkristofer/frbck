const express = require('express');
const app = express();
const bp = require('body-parser')
const router = express.Router();
const bcrypt = require('bcryptjs');
router.use(express.json());
router.use(bp.json());
router.use(bp.urlencoded({ extended: true }))

const User = require('../model/User');


//Login
router.get('/login', (req,res) => res.render('login'));

//Register
router.get('/register', (req,res) => res.render('register'));

//Reg handle

router.post('/register', (req, res) => {
    const {name, email, password } = req.body;
    let errors = []; 

    if (!name || !email || !password ) {
        errors.push({ msg: 'Fyll i alla fälten, är du snäll.' });
      }
      if (password.length < 6) {
        errors.push({ msg: 'Minst 6 tecken' });
      }

    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password

        });
    }else {
        User.findOne({ email: email }).then(user => {
          if (user) {
            errors.push({ msg: 'Email already exists' });
            res.render('register', {
              errors,
              name,
              email,
              password
            });
          } else {
            const newUser = new User({
              name,
              email,
              password
            });

            //hash pass

            bcrypt.genSalt(10, (err, salt) => 
            bcrypt.hash(newUser.password, salt, (err, hash)  => {
                if (err) throw err;

                newUser.password = hash;

                newUser.save()
                .then(user => {res.redirect('/users/login');
                })
                .catch(err => console.log(err))
                
            
            

            }))
                
              
            }
          });
        }
      });

module.exports = router;


// const express = require('express')
 
// const app = express()
// const port = 3000

// app.use(bp.json())
// app.use(bp.urlencoded({ extended: true }))

// app.get('/', (req, res) => {
// 	res.send('Hello World!')
// })

// app.post('/apple', (req, res) => {
// 	console.log(req.body)
// 	res.send('Hello World!')
// })

// app.listen(port, () => {
// 	console.log(`Example app listening at http://localhost:${port}`)
// })