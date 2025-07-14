import User from "../user/user.model.js";
import Account from "./account.model.js";
import { validNumber } from "../helpers/db-validators.js";
import { hash, verify } from "argon2";


// ---------- ADMINISTRATOR AND WORKER ROLE ---------- //
//THIS METOD CREATES CLIENT USERS ONLY, WITH THEIR FIRST BANK ACCOUNT
// THIS RECEIVES BOTH THE USER AND THE ACCOUNT INFORMATION TO CREATE THEM ALTOGETHER
export const createClientWithAccount = async (req, res) => {
    try {
        const log = req.userJwt;
        const { name, username, dpi, address, phone, email, password,
            job, income, type, balance } = req.body;

        const encryptedPassword = await hash(password);
        const user = await User.create({ name, username, dpi, address, phone, email, password: encryptedPassword, job, income });


        const number = await validNumber();
        const account = await Account.create({ number, type, balance, owner: user._id });

        return res.status(201).json({
            message: "Client user created succesfully",
            user,
            account
        });
    } catch (err) {
        return res.status(500).json({
            message: "Client and account creation failed,check the information",
            error: err.message
        });
    }
};

//THIS METHOD CREATES ONLY A BANK ACCOUNT FOR A CLIENT
//THIS RECEIVES THE CLIENT DPI AND FIND THE ID USING IT
export const createAccount = async (req, res) => {
    try {
        const log = req.userJwt;
        const {owner,...data} = req.body;

        const user = await User.findOne({ dpi: owner, role: 'CLIENT', status: true });
        if (!user || !owner) {
            return res.status(400).json({
                success: false,
                message: "the user could not be found"
            });
        };

        const number = await validNumber();

        const account = new Account({
            number,
            owner: user._id,
            ...data
        });

        await account.save();

        return res.status(201).json({
            message: "Bank account created succesfully",
            account
        });
    } catch (err) {
        return res.status(500).json({
            message: "Bank account creation failed,check the information",
            error: err.message
        });
    }
};

//Deletes of closes an account with its id in params, then deletes al its ital information
export const closeAccount = async (req, res) => {
    try {
        const log = req.userJwt;
        const { aid } = req.params;

        const found = await Account.findById(aid);

        if (!found || !aid || found.status === false) {
            return res.status(400).json({
                success: false,
                message: "account not found"
            });
        };

        await Account.findByIdAndUpdate(aid, {
            status: false,
            number: `deleted account`,
            type: `deleted`,
            balance: 0
        }, { new: true });

        // deletes from other users favorites the account closed
        await User.updateMany(
            { "favorites.account": aid },
            { $pull: { favorites: { account: aid } } }
        );


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

// ---------- ALL ROLE ---------- //
//This methos finds accounts based on their owner DPI and/or account type, but also can show a individual information for account (aid), works for Wrokers and administrators
//Shows a list of accounts or a single account complete information based on the filter parameters
//this returns all accounts infromation and user/owner of the accounts data also
// for clients it shows all his accounts (log), all the individual information by account he choses(aid) or list by type of account (type)
export const findAccounts = async (req, res) => {
    try {
        const log = req.userJwt;
        const { limit = 5, from = 0 } = req.query;
        const query = { status: true };
        const { aid, owner, type, } = req.body;

        let filterParameter = { ...query };
        let user = null;

        if (log.role === 'CLIENT') {
            filterParameter.owner = log._id;
            user = log;
        }
        if (owner) {
            user = await User.findOne({ dpi: owner, role: 'CLIENT', status: true });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Failed to find the accounts of the client you sought"
                });
            }
            filterParameter.owner = user._id;
        }
        if (aid) filterParameter._id = aid;
        if (type) filterParameter.type = type;

        let account = await Account.find(filterParameter).skip(Number(from)).limit(Number(limit));

        const total = await Account.countDocuments(filterParameter);

        return res.status(200).json({
            success: true,
            message: "Client accounts found successfully",
            total,
            user,
            account
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to find the accounts you sought",
            error: err.message
        });
    }
}; 

// ---------- CLIENT ROLE ---------- //
// Shows all active accounts owned by the client loged in
//This shows all acounts for the client dashboard in frontend so later when someone clicks in show them their history of movements and balance
export const getAccountsForClient = async (req, res) => {
    try {
        const client = req.userJwt._id;
        const { limit = 5, from = 0 } = req.query;
        const query = { status: true, owner: client };

        const [total, account] = await Promise.all([
            Account.countDocuments(query),
            Account.find(query)
                .skip(Number(from))
                .limit(Number(limit))
        ]);

        return res.status(200).json({
            success: true,
            message: "user bank accounts got successfully",
            total,
            account
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: err.message
        });
    }
};

//adds favorites accounts to the users profile
export const addFavoriteAccount = async (req, res) => {
    try {
        const log = req.userJwt._id;
        const { number, alias } = req.body;

        const user = await User.findById(log);

        const account = await Account.findOne({ number: number });
        if (!account || account.status === false) {
            return res.status(404).json({
                success: false,
                message: "Account to add as favorite not found"
            });
        }

        const favoriteDuplicated = user.favorites.some(fav => fav.account.toString() === account._id.toString());
        if (favoriteDuplicated) {
            return res.status(400).json({
                success: false,
                message: "This account is already in your favorites"
            });
        }

        user.favorites.push({ account: account._id, alias });
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Account addead as favorite succesfully',
            user,
            account
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'failed to add this account to favorites',
            error: err.message
        });
    }
};

// Removes a favorite account from the user's profile
export const removeFavoriteAccount = async (req, res) => {
    try {
        const log = req.userJwt._id;
        const { aid } = req.body;

        const user = await User.findById(log);

        const account = await Account.findById(aid);
        if (!account || account.status === false) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        const index = user.favorites.findIndex(
            fav => fav.account.toString() === aid
        );

        if (index === -1) {
            return res.status(400).json({
                success: false,
                message: "Account is not in your favorites"
            });
        }

        user.favorites.splice(index, 1);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Favorite account removed successfully",
            user,
            account
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to remove favorite account",
            error: err.message
        });
    }
};
