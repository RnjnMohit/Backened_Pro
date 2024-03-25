const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = async(req,res,next) => {

    const authorization = req.headers.authorization;  //Authorization: Bearer <
    if(!authorization){
        return res.status(401).json({message: 'Invalid Token'});
    }

    const token = req.headers.authorization.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Unauthorized'});
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decode
        next();
    }catch(error){
        console.log(err);
        res.status(401).json({ error: 'Invalid token' });
    }
}

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET, {expiresIn: 30000});
}

module.exports = {jwtAuthMiddleware, generateToken};