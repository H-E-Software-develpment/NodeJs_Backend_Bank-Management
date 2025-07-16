import Movement from "./movement.model.js";
import Account from "../account/account.model.js";
import User from "../user/user.model.js";

// ---------- WORKER ROLE OR ADMIN ---------- //
// Uses account number to find the account
export const createDeposit = async (req, res) => {
    try {
        const log = req.userJwt;
        const { amount, description, destination } = req.body;

        const destinationAccount = await Account.findOne({ number: destination });
        if (!destinationAccount || destinationAccount.status === false || !destination) {
            return res.status(404).json({
                success: false,
                message: "Account to deposit to not found"
            });
        }

        destinationAccount.balance += amount;
        await destinationAccount.save();

        const movement = await Movement.create({
            type: "DEPOSIT",
            amount,
            description,
            destination: destinationAccount._id,
            creator: log._id
        });

        return res.status(201).json({
            success: true,
            message: "Deposit completed successfully",
            movement
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to complete deposit",
            error: err.message
        });
    }
};

//Gets all movements from an account by number of account then gets the id (aid)
// get movements by the creator/user (dpi) and finds the uid
//Shows all information about an espcific movement (mid)
//Shows history of movements by account (aid) dependin if ti was origin or destination, just every momvement by that
//Shows all movements by type (type)
export const findMovements = async (req, res) => {
    try {
        const log = req.userJwt;
        const { limit = 15, from = 0 } = req.query;
        const { mid, aid, worker, client, type, date, origin, destination } = req.body;

        let filterParameter = {};

        if (mid) filterParameter._id = mid;
        if (type) filterParameter.type = type;

        if (aid) {
            filterParameter.$or = [{ origin: aid }, { destination: aid }];
        }

        if (origin) {
            const account = await Account.findOne({ number: origin, status: true });
            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: "Origin account number not found"
                });
            }
            filterParameter.origin = account._id;
        }

        if (destination) {
            const account = await Account.findOne({ number: destination, status: true });
            if (!account) {
                return res.status(404).json({
                    success: false,
                    message: "Destination account number not found"
                });
            }
            filterParameter.destination = account._id;
        }

        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            filterParameter.date = { $gte: start, $lte: end };
        }

        if (worker) {
            const user = await User.findOne({ dpi: worker, role: 'WORKER', status: true });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Failed to find this client account"
                });
            }
            filterParameter.creator = user._id;
        }
        if (client) {
            const user = await User.findOne({ dpi: client, role: 'CLIENT', status: true });
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: "Failed to find this client account"
                });
            }
            filterParameter.creator = user._id;
        }

        const [total, movements] = await Promise.all([
            Movement.countDocuments(filterParameter),
            Movement.find(filterParameter)
                .sort({ date: -1 })
                .skip(Number(from))
                .limit(Number(limit))
                .populate({
                    path: 'origin',
                    select: 'number type',
                    populate: {
                        path: 'owner',
                        select: 'name dpi'
                    }
                })
                .populate({
                    path: 'destination',
                    select: 'number type',
                    populate: {
                        path: 'owner',
                        select: 'name dpi'
                    }
                })
                .populate('creator', 'username role')
        ]);

        if (!movements.length) {
            return res.status(404).json({
                success: false,
                message: "No movements found for the given filters"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Movements found successfully",
            total,
            movements
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to movements",
            error: err.message
        });
    }
};

//RECEIVES THE PARAMETER OF "MORE" OR "LESS" IN THE BODY AS VARIABLE "order" TO SORT IT OUT
//SHOWS ALL ACCOUNTS WITH number,type and balance, and for the owner it name,username and dpi, also a count of the movements on variable: movements
//COUNTS ALL TYPE OF MOVEMENTS BY ACCOUNT
export const getAccountsByMovements = async (req, res) => {
    try {
        const log = req.userJwt;
        const { limit = 6, from = 0 } = req.query;
        const { order } = req.body;

        let filterParameter = { "account.status": true };

        const moreOrLess = order === 'MORE' ? -1 : 1;

        const accounts = await Movement.aggregate([
            {
                $project: {
                    account: ["$origin", "$destination"]
                }
            },
            { $unwind: "$account" },
            {
                $group: {
                    _id: "$account",
                    movements: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "accounts",
                    localField: "_id",
                    foreignField: "_id",
                    as: "account"
                }
            },
            { $unwind: "$account" },
            { $match: filterParameter },
            {
                $lookup: {
                    from: "users",
                    localField: "account.owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            { $unwind: "$owner" },
            {
                $project: {
                    number: "$account.number",
                    type: "$account.type",
                    balance: "$account.balance",
                    movements: 1,
                    owner: {
                        name: "$owner.name",
                        username: "$owner.username",
                        dpi: "$owner.dpi"
                    }
                }
            },
            { $sort: { movements: moreOrLess } },
            { $skip: Number(from) },
            { $limit: Number(limit) }
        ]);

        if (!accounts.length) {
            return res.status(404).json({
                success: false,
                message: "No accounts with movements found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Accounts found successfully",
            accounts
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to find the accounts you sought",
            error: err.message
        });
    }
};




// ---------- CLIENT ROLES ---------- //
export const createTransfer = async (req, res) => {
    try {
        const log = req.userJwt;
        const { origin, destination, amount, description } = req.body;

        const originAccount = await Account.findOne({ number: origin }).populate('owner', 'name dpi');
        const destinationAccount = await Account.findOne({ number: destination }).populate('owner', 'name dpi');

        if (!origin || !destination || originAccount.status === false || destinationAccount.status === false || !originAccount || !destinationAccount) {
            return res.status(404).json({
                success: false,
                message: "One or both accounts not found or inactive"
            });
        }

        if (originAccount.owner._id.toString() !== log._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to use this account"
            });
        }

        if (originAccount.balance < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient funds for this transfer"
            });
        }

        originAccount.balance -= amount;
        destinationAccount.balance += amount;

        await originAccount.save();
        await destinationAccount.save();

        const movement = await Movement.create({
            type: "TRANSFER",
            amount,
            description,
            origin: originAccount._id,
            destination: destinationAccount._id,
            creator: log._id
        });

        return res.status(201).json({
            success: true,
            message: "Transfer completed successfully",
            movement,
            originAccount,
            destinationAccount
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to complete transfer",
            error: err.message
        });
    }
};

//Gets history of all movements from an account by its id (aid) when its selected in the frontend
// The aid or account id is passed in the body OBLIGATORILY, the rest if opcional 
// get movements created by the client (log._id) 
//Shows all information about an espeficic movement (mid)
//Shows all movements by account and filtered by type or date(type)
export const findMovementsForClient = async (req, res) => {
    try {
        const log = req.userJwt;
        const { limit = 15, from = 0 } = req.query;
        const { mid, aid, type, date } = req.body;

        let filterParameter = {};

        if (mid) filterParameter._id = mid;
        if (type) filterParameter.type = type;

        if (aid) {
            filterParameter.$or = [{ origin: aid }, { destination: aid }];
        }

        if (date) {
            const start = new Date(date);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            filterParameter.date = { $gte: start, $lte: end };
        }

        const [total, movements] = await Promise.all([
            Movement.countDocuments(filterParameter),
            Movement.find(filterParameter)
                .sort({ date: -1 })
                .skip(Number(from))
                .limit(Number(limit))
                .populate({
                    path: 'origin',
                    select: 'number',
                    populate: { path: 'owner', select: 'name dpi' }
                })
                .populate({
                    path: 'destination',
                    select: 'number',
                    populate: { path: 'owner', select: 'name dpi' }
                })
        ]);

        if (!movements.length) {
            return res.status(404).json({
                success: false,
                message: "No movements found for the given filters"
            });
        }

        return res.status(200).json({
            success: true,
            message: "history of movements found successfully",
            total,
            movements
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to get history ofmovements",
            error: err.message
        });
    }
};

