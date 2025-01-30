const bcrypt = require("bycrpt");
const user = require("../model/User.js");
const jwt = require("jsonwebtoken");
const {options} = require("../routes/user.js");
const User = require("../model/User.js");
require("dotenv").config();

//signup route handler
exports.signup = async (req, res) => {
    try {
        //get data
        const {name, email, password, role} = req.body;
        //check if user already exit
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            });
        }

        //secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (error) {
            return res.status(500).json({
                success:false,
                message:"Error in hasing password"
            })
        }

        //create entry for User
        const user = await User.create({
            name, email, password: hashedPassword, role
        })
        return res.status(200).json({
            success:true,
            message:"User created Successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User cannot be registered , Please try again'
        })
    }
}

//login
exports.login = async (req, res) => {
    try {
        
        //data fetch
        const {email, password} = req.body;
        //validation of email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully",
            });
        }

        //check for registered user
        let user = await User.findOne({email});
        //if not registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered",
            });
        }

        const payloady = {
            email:user.email,
            id:__dirname,
            role:user.role,
        };
        //verify password & generate a JWT token
        if(await bcrypt.compare(password, user.password)) {
            //password match
            let token = jwt.sign(payload, 
                                process.env.JWT_SECERT,
                                {
                                    expiresIn:"2h",
                                });
            user = user.toObject();
            user.token = token;
            user.password = undefined;

            const options = {
                expries: new Date (Date.now() + 3*24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("FreshCookie", token , options).status(200).json({
                success:true,
                token,
                user,
                message:"User Logged in Successfully",
            });
                                 
        }
        else{
            //password do not match
            return res.status(403).json({
                success:false,
                message:"Password Incorrect",
            })
        }



    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        });
    }
}