import { Schema, model } from "mongoose";

const accountSchema = Schema({
    number: {
        type: String,
        required: [true, "A account number is required for your account"],
        unique: true,
        maxLength: [10, "Account number must be 10 characters"]
    },
    type: {
        type: String,
        enum: ["CHEKING", "SAVINGS"],
        default: "CHEKING"
    },
    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        versionKey: false,
        timestamps: true
    });

accountSchema.methods.toJSON = function () {
    const { __v, _id, ...accountDb } = this.toObject();
    accountDb.aid = _id;
    return accountDb;
};

export default model("Account", accountSchema);
