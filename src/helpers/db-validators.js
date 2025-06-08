import User from "../user/user.model.js";

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
