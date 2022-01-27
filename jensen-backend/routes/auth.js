const router = require('express').Router();
const User = require('../model/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidation, loginValidation} = require('../validation');



router.post('/register', async (req, res) => {

    //validering av data

    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //kollar om redan reggad

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send ('Email finns redan');

    //Hash lösenord

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Ny användare
     const user = new User({
         name: req.body.name,
        email: req.body.email,
         password: hashedPassword
     });
     try {
        const savedUser = await user.save();
         res.send({ user: user._id});
     }   catch (err){
         res.status(400).send(err);
     }
});

//LOGIN

router.post('/login', async (req, res) => {
    //validering av data

    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    // kollar om den redan finns
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send ('Email hittas ej');
    //Lösenord check
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Fel lösenord')

    //JWT assign token

    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
    res.header('auth-token', token).send(token);

  
});






module.exports = router;