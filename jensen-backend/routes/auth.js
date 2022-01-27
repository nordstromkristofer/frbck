const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const {registerValidation} = require('../validation');



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







module.exports = router;