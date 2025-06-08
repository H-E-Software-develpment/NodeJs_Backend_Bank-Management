import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

export const validateJWT = async (req, res, next) => {
    try {
        let token = req.headers["authorization"] || req.query.token || req.body.token ;
        if (!token) {
            return res.status(400).json({
                succes: false,
                message: "There is no token in your request"
            });
        }

        token = token?.replace(/^Bearer\s+/, "");

        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const userFound = await User.findById(uid);

        if (!userFound) {
            return res.status(400).json({
                succes: false,
                message: "User not found"
            });
        }

        if (!userFound.status) {
            return res.status(400).json({
                succes: false,
                message: "User disabled or unavailable"
            });
        }
        req.userJwt = userFound;
        next();

    } catch (err) {
        return res.status(500).json({
            succes: false,
            message: "Invalid token",
            error: err.message
        });
    }
};
