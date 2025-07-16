import { Schema, model } from "mongoose";

const movementSchema = new Schema({
    date: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        enum: ["DEPOSIT", "WITHDRAWAL", "TRANSFER"],
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0.01
    },
    comment: {
        type: String
    },
    origin: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    destination: {
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
    versionKey: false
});

movementSchema.methods.toJSON = function () {
    const { __v, _id, ...movementDb } = this.toObject();
    movementDb.mid = _id;
    return movementDb;
};


export default model("Movement", movementSchema);
