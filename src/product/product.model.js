import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Service or product name is required"]
    },
    description: {
        type: String,
        required: [true, "Service product description is required"]
    },
    category: {
        type: String,
        enum: ["FOOD", "BEAUTY", "ENTERTAINMENT", "OTHER"],
        default: "OTHER"
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

productSchema.methods.toJSON = function () {
    const { __v, _id, ...productDb } = this.toObject();
    productDb.pid = _id;
    return productDb;
};

export default model("Product", productSchema);
