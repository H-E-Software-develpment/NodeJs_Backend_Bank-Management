import Movement from "../movement/movement.model.js";

export const validateDailyLimit = async (req, res, next) => {
    try {
        const { amount } = req.body;
        const log = req.userJwt;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Transfer amount must be greater than 0"
            });
        }

        if (amount > 2000) {
            return res.status(400).json({
                success: false,
                message: "Cannot transfer more than Q2,000 in a single transaction"
            });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayTransfers = await Movement.aggregate([
            {
                $match: {
                    type: "TRANSFER",
                    creator: log._id,
                    date: { $gte: startOfDay, $lte: endOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        const totalToday = todayTransfers[0]?.total || 0;
        const newTotal = totalToday + amount;

        if (newTotal > 10000) {
            return res.status(400).json({
                success: false,
                message: "You have reached your daily transfer limit of Q10,000"
            });
        }

        next();

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to validate daily transfer limit",
            error: err.message
        });
    }
};
