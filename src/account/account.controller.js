import User from "../user/user.model.js";
import Account from "./account.model.js"
import { hash, verify } from "argon2";


// ---------- ADMINISTRATOR AND WORKER ROLE ---------- //
//THIS METOD CREATES CLIENT USERS ONLY WITH THEIR FIRST ACCOUNT
export const createClient = async (req, res) => {
    try {
        const account = req.userJwt;
        const data = req.body;
        const encryptedPassword = await hash(data.password);

        data.password = encryptedPassword;

        const user = await User.create(data);

        return res.status(201).json({
            message: "User created succesfully",
            user
        });
    } catch (err) {
        return res.status(500).json({
            message: "User creation failed,check the information",
            error: err.message
        });
    }
};

export const createAccount = async (req, res) => {
    try {
        const logged = req.userJwt;
        const data = req.body;

        const user = await User.findOne({ username: data.owner, role: 'CLIENT' });
        if (!user || !data.owner || user.status === false) {
            return res.status(400).json({
                success: false,
                message: "owner not found"
            });
        };
        
        const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        account.number = number;

        const account = await Account.create(data);


        return res.status(201).json({
            message: "User created succesfully",
            account
        });
    } catch (err) {
        return res.status(500).json({
            message: "User creation failed,check the information",
            error: err.message
        });
    }
};
