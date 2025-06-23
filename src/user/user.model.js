import { Schema, model } from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Complete name is needed for your account"],
        maxLength: [60, "Name cannot exceed 60 characters"]
    },
    username: {
        type: String,
        required: [true, "A username is required for your account"],
        unique: true
    },
    dpi: {
        type: String,
        required: [true, "DPI is required for identification"],
        unique: true,
        maxLength: [13, "DPI must be 13 characters"],
        unique: true
    },
    address: {
        type: String,
        required: [true, "Address is required"]
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        maxLength: [8, "Phone number must be 8 characters"]
    },
    email: {
        type: String,
        required: [true, "An email is required for your account"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "A password is required for your account"]
    },
    role: {
        type: String,
        enum: ["ADMINISTRATOR", "CLIENT", "WORKER"],
        default: "CLIENT"
    },
    job: {
        type: String,
        required: [true, "Job information is needed"]
    },
    income: {
        type: Number,
        required: [true, "Income must be specified"],
        min: [100, "Income must be at least 100"]
    },
    favorites: [{
        account: {
            type: Schema.Types.ObjectId,
            ref: "Account",
            required: [true, "Account reference is required"]
        },
        alias: {
            type: String,
            required: [true, "An alias is required for favorite accounts"]
        }
    }],
    status: {
        type: Boolean,
        default: true
    }
},
    {
        versionKey: false,
        timestamps: true
    });

userSchema.methods.toJSON = function () {
    const { __v, password, _id, ...userDb } = this.toObject();
    userDb.uid = _id;
    return userDb;
};

export default model("User", userSchema);
