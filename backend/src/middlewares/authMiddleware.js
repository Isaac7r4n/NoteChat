import jwt from 'jsonwebtoken';
import User from '../models/User.js';

//user authorisation
export const protectedRoute = (req, res, next) => {
    try {
        //take token from header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

        if (!token) {
            return res.status(401).json({ message: "access token not found" });
        }

        //check if token is valid
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedUser) => {
        if (err) {
            console.error(err);

            return res
            .status(403)
            .json({ message: "Access token has expired or is not correct" });
        }

        //find user
        const user = await User.findById(decodedUser.userId).select('-hashedPassword');

        if(!user) {
            return res.status(404).json({message: 'user not found'})
        }

        //return user info in req
        req.user = user;
        next();
        });

    } catch (error) {
        console.error('error while authenticate JWT in authMiddleware', error);
        return res.status(500).json({message: 'internal server error'});
    }
}