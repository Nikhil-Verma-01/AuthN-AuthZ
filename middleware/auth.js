//auth, isStuden, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = () => {
    try {
        //extract JWT token
        const token = req.body.token;

        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        //verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECERT);
            console.log(payload);
            req.user = payload;
        } catch (error) {
            return res.status(401).json({
                success:false,
                message:'token is invalid'
            })
        }
        next();
        
    } catch (err) {
        return res.status(400).json({

        })
    }
}

exports.isStudent = (req, res, next) => {
    try{
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected route for Students"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User Role is not matching",
        })
    }
}

exports.isAdmin = (req, res, next) => {
    try{
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a Protected route for Admin"
            });
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:"User Role is not matching",
        })
    }
}