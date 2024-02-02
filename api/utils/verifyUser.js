import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
export const verifyToken = (req, res, next)=>{
    // extract token from cookie
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401, "You are not authenticated"))
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err) return next(errorHandler(403, "Token is not valid"))
        req.user = user;
        // console.log(req.user)
        // req.user looks like this { id: '65bc87fb2688f8397213d1aa', iat: 1706855191, exp: 1706941591 } because at the time of signing we provided only id
    })
    next();
}