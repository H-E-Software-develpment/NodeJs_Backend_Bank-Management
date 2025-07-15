import Product from "./account.model.js";


// ---------- ADMINISTRATOR ROLE ---------- //
export const createProduct = async (req, res) => {
    try {
        const log = req.userJwt;
        const data = req.body;

        const product = await Product.create(data);

        return res.status(201).json({
            message: "Product created succesfully",
            product
        });
    } catch (err) {
        return res.status(500).json({
            message: "Product creation failed,check the information",
            error: err.message
        });
    }
};

export const editProduct = async (req, res) => {
    try {
        const log = req.userJwt;
        const { pid } = req.params;
        const newData = req.body;

        const found = await Product.findById(pid);

        if (!found || !pid || found.status === false) {
            return res.status(400).json({
                success: false,
                message: "product not found"
            });
        };

        const product = await User.findByIdAndUpdate(pid, newData, { new: true }); 

        res.status(200).json({
            success: true,
            msg: 'product changes updated succesfully',
            product
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: 'failed to update product changes',
            error: err.message
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const account = req.userJwt;
        const { pid } = req.params;

        const found = await Product.findById(pid);

        if (!found || !pid || found.status === false) {
            return res.status(400).json({
                success: false,
                message: "product not found"
            });
        };

        const tag = Math.floor(Math.random() * 10) + 1;

        await Product.findByIdAndUpdate(pid, { status: false, 
            name: `deleted${tag}: ${found.name} `}, { new: true });

        return res.status(200).json({
            success: true,
            message: "product deleted successfully "
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "failed to delete product",
            error: err.message
        });
    }
};


// ---------- ALL ROLEs ---------- //
//Filtered search to find products, all listed,individual,and by category or name
export const findProducts = async (req, res) => {
    try {
        const account = req.userJwt;
        const { limit = 10, from = 0 } = req.query;
        const query = { status: true };
        const { pid,name,category } = req.body;

        let filterParameter = { ...query };

        if (pid) filterParameter._id = pid;
        if (name) filterParameter.name = { $regex: name, $options: "i" };
        if (category) filterParameter.category = category;

        let product = await Product.find(filterParameter).skip(Number(from)).limit(Number(limit));

        if (!product || product.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Failed to find the products you sought"
            });
        }

        const total = await Product.countDocuments(filterParameter);

        return res.status(200).json({
            success: true,
            message: "Users found successfully",
            total,
            product
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Failed to find the products you sought",
            error: err.message
        });
    }
};