import Account from "../account/account.model.js";
import User from "../user/user.model.js";

export const deleteManyAccounts = async (user) => {
    try {
        const accounts = await Account.find({ owner: user._id, status: true });

        if (!accounts.length) {
            return { 
                success: false, 
                message: "No active accounts found" 
            };
        }

        for (const account of accounts) {
            await Account.findByIdAndUpdate(account._id, {
                status: false,
                number: `deleted account`,
                type: `deleted`,
                balance: 0
            });

            await User.updateMany(
                { "favorites.account": account._id },
                { $pull: { favorites: { account: account._id } } }
            );
        }

        return { 
            success: true,
            message: `${accounts.length} account(s) deleted` 
        };

    } catch (err) {
        throw new Error("Internal error deleting accounts");
    }
};

