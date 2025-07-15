import { Router } from "express";
import { createProduct, editProduct, deleteProduct, findProducts } from "./product.controller.js";
import { createProductValidator, editProductValidator, deleteProductValidator, findProductsValidator } from "../middlewares/product-validators.js";

const router = Router();

/**
 * @swagger
 * /product/createProduct:
 *   post:
 *     tags:
 *       - Product
 *     summary: Create a new product or service
 *     description: Only administrators can create products.
 *     operationId: createProduct
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [FOOD, BEAUTY, ENTERTAINMENT, OTHER]
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
router.post("/createProduct", createProductValidator, createProduct);

/**
 * @swagger
 * /product/editProduct/{pid}:
 *   put:
 *     tags:
 *       - Product
 *     summary: Edit a product
 *     description: Only administrators can edit products.
 *     operationId: editProduct
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Product ID to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [FOOD, BEAUTY, ENTERTAINMENT, OTHER]
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid data or product not found
 *       500:
 *         description: Server error
 */
router.put("/editProduct/:pid", editProductValidator, editProduct);

/**
 * @swagger
 * /product/deleteProduct/{pid}:
 *   delete:
 *     tags:
 *       - Product
 *     summary: Delete (soft) a product
 *     description: Only administrators can delete products.
 *     operationId: deleteProduct
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pid
 *         required: true
 *         description: Product ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Product not found or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/deleteProduct/:pid", deleteProductValidator, deleteProduct);

/**
 * @swagger
 * /product/findProducts:
 *   post:
 *     tags:
 *       - Product
 *     summary: Search for products
 *     description: All authenticated users can filter products.
 *     operationId: findProducts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pid:
 *                 type: string
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [FOOD, BEAUTY, ENTERTAINMENT, OTHER]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Products retrieved successfully
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
 */
router.post("/findProducts", findProductsValidator, findProducts);

export default router;
