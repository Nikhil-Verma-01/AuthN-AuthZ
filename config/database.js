const mongoose = require("mongoose");

require("dotenv").config();

exports.connect = () => {
    mongoose.connect(process.env.MONOGO_URL, {
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(() => {console.log("DB connected Successfully")})
    .catch((err) => {
        console.error(err);
        console.log("DB Connection Issues");
        process.exit(1);
    });
}