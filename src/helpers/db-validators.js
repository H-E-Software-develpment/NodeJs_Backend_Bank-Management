import User from "../user/user.model.js";
import Account from "../account/account.model.js";
import Product from "../product/product.model.js";
import Movement from "../movement/movement.model.js";

export const findUser = async (uid = " ") => {
    const user = await User.findById(uid);
    if (!user) {
        throw new Error(`The user provided couldn't be found or doesn't exist`);
    }
};

export const findUsername = async (username = " ") => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error(`The account provided couldn't be found or doesn't exist`);
    }
};

export const emailDuplicated = async (email = " ") => {
    const user = await User.findOne({ email });
    if (user) {
        throw new Error(`The email provided is already in use, Log in to your account`);
    }
};

export const validRole = async (role = " ") => {
    if (role !== "ADMINISTRATOR" && role !== "WORKER" && role !== "CLIENT") {
        throw new Error(`Unvalid role`);
    };
};

export const findUserByDPI = async (dpi = " ") => {
    const user = await User.findOne({ dpi });
    if (!user) {
        throw new Error(`The dpi provided couldn't be found or doesn't exist`);
    }
};

export const validAccountType = async (type = " ") => {
    if (type !== "CHECKING" && type !== "SAVINGS") {
        throw new Error(`Unvalid account type`);
    };
};

export const findAccount = async (aid = " ") => {
    const account = await Account.findById(aid);
    if (!account) {
        throw new Error(`The account provided couldn't be found or doesn't exist`);
    }
};

export const validNumber = async () => {
    while (true) {
        const number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
        const exists = await Account.exists({ number });
        if (!exists) return number;
    }
};

export const findProduct = async (pid = " ") => {
    const product = await Product.findById(pid);
    if (!product) {
        throw new Error(`The product provided couldn't be found or doesn't exist`);
    }
};

export const validProductCategory = async (category = " ") => {
    if (category !== "FOOD" && category !== "BEAUTY" && category !== "ENTERTAINMENT" && category !== "OTHER") {
        throw new Error(`Unvalid product category`);
    }
};

export const validMovementType = async (type = " ") => {
    if (type !== "DEPOSIT" && type !== "WITHDRAWAL" && type !== "TRANSFER") {
        throw new Error(`Unvalid movement type`); 
    }
};

export const validMovementOrder = async (order = " ") => {
    if (order !== "MORE" && order !== "LESS") {
        throw new Error(`Unvalid movement order`); 
    }
};