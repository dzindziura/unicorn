const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const User = require('../model/User');

const SingUp = async(req, res) => {
    try {
        const password = req.body.password;

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        let email_or_number = '';

        if(req.body.login.indexOf('@') !== -1){
            email_or_number = 'email';
        }else{
            email_or_number = 'number';
        }
        const doc = new User({
            login: req.body.login,
            passwordHash: hash,
            id_type: email_or_number
        })
    
        const user = await doc.save();
    
        const token = await jwt.sign(
            {
                _id: user._id,
            }, 
            process.env.JWT_SECRET_TOKEN,
            {
                expiresIn: "10m",
            },
        );
    
        res.json({
            token
        })
    } catch (error) {
        res.json(error)
    }

}

const SingIn = async (req, res) => {
    try {
        const user = await User.findOne({login: req.body.login});
        if(!user){
            return res.status(404).json({
                message: "Not found"
            })
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass){
            return res.status(404).json({
                message: "Incorrect login or password"
            })
        }
        const token = await jwt.sign(
            {
                _id: user._id,
            },
            process.env.JWT_SECRET_TOKEN,
            {
                expiresIn: "10m",
            },
        );
        User.updateOne({login: req.body.login}, {token: token}, (err, result) => {
            if (err) {
                res.json(err);
              }
        })
        const {password, ...userData} = user._doc;
        res.json({
            ...userData,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            messae: "Login failed",
         });
    }
}

const LogOut = async(req, res) => {
    if(req.params.all === 'true'){
        const result = await User.updateMany({}, {token: ''});
        res.json(result);
    }else{
        const result = await User.updateOne({token: req.headers.authorization.replace(/Bearer\s?/, '')}, {token: ''});
        res.json(result);
    }
}

const Info = async(req, res) => {
    const result = await User.find({}).select('_id id_type')

        res.json({
            result
        })
}

module.exports = {SingIn, SingUp, LogOut, Info};