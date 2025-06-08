import User from "./user.model.js";
import { hash, verify } from "argon2";

// ADMINISTRADORES Y TRABAJADORES
export const createUser = async (req, res) => {
    try {
        const account = req.userJwt;
        const data = req.body;

        if (account.role !== "ADMINISTRATOR") {
            data.role = "CLIENT";
        }

        const encryptedPassword = await hash(data.password);

        data.password = encryptedPassword;

        const user = await User.create(data);

        return res.status(201).json({
            message: "User registered succesfully",
            user
        });
    } catch (err) {
        return res.status(500).json({
            message: "User registration failed,check the information",
            error: err.message
        });
    }
};


//todos - general
export const findUser = async (req, res) => {
    try {
        const account = req.userJwt;
        const { uid } = req.params;

        const user = await User.findById(uid);

        if (!user || user.status === false) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Account found successfully",
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to find this account",
            error: err.message
        });
    }
};

export const findUserForAdmin = async (req, res) => {
    try {
        const account = req.userJwt;
        const { limit = 10, from = 0 } = req.query;
        const query = { status: true };
        const { uid, name, email, role } = req.body;

        let filterParameter = { ...query };

        if (uid) filterParameter._id = uid;
        if (name) filterParameter.name = { $regex: name, $options: "i" };
        if (email) filterParameter.email = email;
        if (role) filterParameter.role = role;

        let user = await User.find(filterParameter).skip(Number(from)).limit(Number(limit));

        const total = await User.countDocuments(filterParameter);

        return res.status(200).json({
            success: true,
            message: "Users found successfully",
            total,
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to find the Users you sought",
            error: err.message,
        });
    }
};

export const editUser = async (req, res) => {
    try {
        const { uid } = req.params;
        const newData = req.body;
        const account = req.userJwt;

        const found = await User.findById(uid);

        if (!found) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        };

        if (account.role !== "PLATFORM_ADMIN" && account.role !== "HOTEL_ADMIN") {
            if (account._id.toString() !== uid) {
                return res.status(401).json({
                    success: false,
                    message: "not allowed / user not found"
                });
            }
        }
        if (account.role === "HOTEL_ADMIN" && found.role === "PLATFORM_ADMIN") {
            return res.status(401).json({
                success: false,
                message: "not allowed - user not found"
            });
        }

        const user = await User.findByIdAndUpdate(uid, newData, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Profile changes updated succesfully',
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'failed to update profile changes for the employee',
            error: err.message
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const account = req.userJwt;
        const { uid } = req.params;

        const found = await User.findById(uid);
        if (!found) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        };

        if (account.role !== "PLATFORM_ADMIN" && account.role !== "HOTEL_ADMIN") {
            if (account._id.toString() !== uid) {
                return res.status(401).json({
                    success: false,
                    message: "not allowed / user not found"
                });
            }
        }

        if (account.role === "HOTEL_ADMIN" && found.role === "PLATFORM_ADMIN") {
            return res.status(401).json({
                success: false,
                message: "not allowed - user not found"
            });
        }

        await User.findByIdAndUpdate(uid, { status: false, name: `deleted: ${found.name}` }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully "
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "failed to delete account",
            error: err.message
        });
    }
};

//solo usuarios
export const changePassword = async (req, res) => {
    try {
        const { uid } = req.params;
        const { password, confirmation } = req.body;
        const account = req.userJwt;

        const user = await User.findById(uid);

        if (account._id.toString() !== uid) {
            return res.status(401).json({
                success: false,
                message: "not allowed / user not found"
            });
        }
        const checkOldNew = await verify(user.password, password);
        if (checkOldNew) {
            return res.status(400).json({
                success: false,
                message: "New password cannot be the same as the old one"
            });
        }

        if (password !== confirmation) {
            return res.status(400).json({
                success: false,
                message: "To confirm your password it needs to be the same as the new password"
            });
        }


        const encryptedPassword = await hash(password);

        await User.findByIdAndUpdate(uid, { password: encryptedPassword }, { new: true });

        return res.status(200).json({
            success: true,
            message: "Password changed succesfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to update password",
            error: err.message
        });
    }
};

//solo administradores

export const getUsers = async (req, res) => {
    try {
        const account = req.userJwt;
        const { limit = 10, from = 0 } = req.query;
        const query = { status: true };

        const [total, user] = await Promise.all([
            User.countDocuments(query),
            User.find(query)
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        return res.status(200).json({
            success: true,
            message: "users list got successfully",
            total,
            user
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: err.message
        });
    }
};

export const changeRole = async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        const found = await User.findById(uid);

        if (!found) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        };

        const user = await User.findByIdAndUpdate(uid, { role: role }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Profile role updated succesfully',
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'failed to update profile changes for this account',
            error: err.message
        });
    }
};
