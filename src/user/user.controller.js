import User from "./user.model.js";
import { hash, verify } from "argon2";


// ---------- ADMINISTRATOR ROLE ---------- //
// (CAN ONLY SELECT EITHER ADMINISTRATOR OR WORKER ROLE ALONE )
//THIS IS only TO CREATE WORKER OR ADMINISTRATOR ACCOUNTS, NO CLIENTS
export const createUserForAdmin = async (req, res) => {
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
// Show all active accounts existent (shows all roles)
export const getUsersForAdmin = async (req, res) => {
    try {
        const admin = req.userJwt;
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

// ---------- ADMINISTRATOR ROLE AND WORKER ROLE ---------- //
//Filtered search to find users or getUsers Clients For role workers only
// role as filter has the role employees and administrator not available for workers only administrators
export const findUsers = async (req, res) => {
    try {
        const account = req.userJwt;
        const { limit = 10, from = 0 } = req.query;
        const query = { status: true };
        const { uid, username, name, role } = req.body;

        let filterParameter = { ...query };

        if (uid) filterParameter._id = uid;
        if (username) filterParameter.username = username;
        if (name) filterParameter.name = { $regex: name, $options: "i" };

        if (account.role === 'WORKER') {
            filterParameter.role = 'CLIENT';
        } else {
            if (role) filterParameter.role = role;
        }

        let user = await User.find(filterParameter).skip(Number(from)).limit(Number(limit));

        if (!user || user.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Failed to find the Users you sought"
            });
        }

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
            error: err.message
        });
    }
};

// FOR WORKERS IT ONLY SHOWS THEM CLIENT ACCOUNTS TO EDIT, BUT FOR ADMINS IT SHOWS ALL ACCOUNTS EXCEPT OTHER ADMINISTRATORS
export const editUser = async (req, res) => {
    try {
        const account = req.userJwt;
        const { uid } = req.params;
        const { name, address, job, income } = req.body;

        const found = await User.findById(uid);

        if (!found || !uid || found.status === false) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        };

        if (account.role === 'WORKER' && found.role !== 'CLIENT') {
            return res.status(403).json({
                success: false,
                message: "Not allowed to edit this account"
            });
        }

        if (account.role === 'ADMINISTRATOR' && found.role === 'ADMINISTRATOR') {
            if (account._id.toString() !== found._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: "Admins are not allowed to edit other Admins"
                });
            }
        }

        const newData = {
            name: name || found.name,
            address: address || found.address,
            job: job || found.job,
            income: income || found.income
        };

        const user = await User.findByIdAndUpdate(uid, newData, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Profile changes updated succesfully',
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'failed to update profile changes',
            error: err.message
        });
    }
};

//to delete an account for workers only clients and for admins all except other admins
export const deleteUser = async (req, res) => {
    try {
        const account = req.userJwt;
        const { uid } = req.params;

        const found = await User.findById(uid);

        if (!found || !uid || found.status === false) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        };

        if (account.role === 'WORKER' && found.role !== 'CLIENT') {
            return res.status(403).json({
                success: false,
                message: "Not allowed to delete this account"
            });
        }

        if (account.role === 'ADMINISTRATOR' && found.role === 'ADMINISTRATOR' && account.uid !== found._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Admins are not allowed to delete other Admins"
            });
        }

        await User.findByIdAndUpdate(uid, { status: false, 
            name: `deleted: ${found.name}`,
            username: `deleted: ${found.username}`,
            email: `deleted: ${found.email}`,
            dpi: `deleted: ${found.dpi}`}, { new: true });

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

// ---------- CLIENT OR ALL ROLES ---------- //
//Shows the profile of the user logged in
export const showProfile = async (req, res) => {
    try {
        const find = req.userJwt._id;
        const user = await User.findById(find);

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

//edits the profile of the user logged in
export const editUserProfile = async (req, res) => {
    try {
        const account = req.userJwt._id;
        const { name, address, job, income } = req.body;

        const found = await User.findById(account);

        if (!found) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        };
        const newData = {
            name: name || found.name,
            address: address || found.address,
            job: job || found.job,
            income: income || found.income
        };

        const user = await User.findByIdAndUpdate(account, newData, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Profile changes updated succesfully',
            user
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'failed to update profile changes',
            error: err.message
        });
    }
};

// change password for user logged in
export const changeUserPassword = async (req, res) => {
    try {
        const account = req.userJwt._id;
        const { password, confirmation } = req.body;

        const found = await User.findById(account);

        if (!found) {
            return res.status(400).json({
                success: false,
                message: "user not found"
            });
        };

        const checkOldNew = await verify(found.password, password);
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

        const newEncryptedPassword = await hash(password);

        await User.findByIdAndUpdate(account, { password: newEncryptedPassword }, { new: true });

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