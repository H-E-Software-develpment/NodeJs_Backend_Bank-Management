import { verify } from "argon2";
import User from "../user/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.js";

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });

        if (!user || user.status === false) {
            return res.status(400).json({
                message: "Information incorrect",
                error: "check the information"
            });
        };

        const correctPassword = await verify(user.password, password);

        if (!correctPassword) {
            return res.status(400).json({
                message: "Information incorrect",
                error: "check the information"
            });
        }
        const token = await generateJWT(user._id);

        return res.status(200).json({
            message: "Login successful",
            token,
            user
        });

    } catch (err) {
        return res.status(500).json({
            message: "login failed, server error",
            error: err.message
        });
    }
};
