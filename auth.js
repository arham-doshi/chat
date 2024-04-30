const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = async (req, res, next) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"];
    if(!token) {
        res.status(403).send("A token is required for authentication");
    }
    try{
        const decoded = await jwt.verify(token, process.env.JWT_KEY);
        req.user = decoded;
    }
    catch(err){
        return res.status(401).send("Invalid token");
    }
    return next();
    

} 
module.exports = verifyToken;