const express = require("express");
const router = express.Router();

const {login, singup} = require("../controllers/Auth");
const {auth, isStudent, isAdmin} = require("../middleware/auth");

router.post("/login", login);
router.post("/signup", singup);

//testing protected routes for single middleware
router.get("/test", auth, (req,res) => {
    res.json({
        success:true,
        message:"Welcome to the protected route for Test"
    });

});

//Protected Route
router.get("/student", auth, isStudent, (req,res) => {
    res.json({
        success:true,
        message:"Welcome to the Protected route for Student"
    });
});

router.get("/admin", auth, isAdmin, (req,res) => {
    res,json({
        sucess:true,
        message:"Welcome to the Protected route for Admin"
    });
});