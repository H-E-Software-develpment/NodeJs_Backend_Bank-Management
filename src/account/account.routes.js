import { Router } from "express";
import {
    createClientWithAccount,
    createAccount,
    closeAccount,
    findAccounts,
    getAccountsForClient,
    addFavoriteAccount,
    removeFavoriteAccount
} from "./account.controller.js";

import {
    createClientWithAccountValidator,
    createAccountValidator,
    closeAccountValidator,
    findAccountsValidator,
    getAccountsForClientValidator,
    addFavoriteAccountValidator,
    removeFavoriteAccountValidator
} from "../middlewares/account-validators.js";

const router = Router();

/**
 * @swagger
 * /account/createClientWithAccount:
 *   post:
 *     tags:
 *       - Account
 *     summary: Create a client user and their first bank account
 *     description: Creates both client user and account in one operation.
 *     operationId: createClientWithAccount
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: User and account data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - username
 *               - dpi
 *               - address
 *               - phone
 *               - email
 *               - password
 *               - job
 *               - income
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               dpi:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               job:
 *                 type: string
 *               income:
 *                 type: number
 *               type:
 *                 type: string
 *                 enum: [CHEKING, SAVINGS]
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Client and account created successfully
 *       400:
 *         description: Invalid data
 *       500:
 *         description: Server error
 */
router.post("/createClientWithAccount", createClientWithAccountValidator, createClientWithAccount);

/**
 * @swagger
 * /account/createAccount:
 *   post:
 *     tags:
 *       - Account
 *     summary: Create an account for an existing client
 *     description: Creates a new bank account for an existing client identified by DPI.
 *     operationId: createAccount
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Account data including owner DPI.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - owner
 *             properties:
 *               owner:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [CHEKING, SAVINGS]
 *               balance:
 *                 type: number
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Client not found or invalid data
 *       500:
 *         description: Server error
 */
router.post("/createAccount", createAccountValidator, createAccount);

/**
 * @swagger
 * /account/closeAccount/{aid}:
 *   delete:
 *     tags:
 *       - Account
 *     summary: Close an account
 *     description: Soft deletes (closes) an account by ID.
 *     operationId: closeAccount
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         description: Account ID to close
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Account closed successfully
 *       400:
 *         description: Account not found or invalid ID
 *       500:
 *         description: Server error
 */
router.delete("/closeAccount/:aid", closeAccountValidator, closeAccount);

/**
 * @swagger
 * /account/findAccounts:
 *   post:
 *     tags:
 *       - Account
 *     summary: Find accounts based on filters
 *     description: Returns accounts matching filter criteria.
 *     operationId: findAccounts
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Filter parameters.
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aid:
 *                 type: string
 *               owner:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [CHEKING, SAVINGS]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results to return
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         description: Offset for results
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *       500:
 *         description: Server error
 */
router.post("/findAccounts", findAccountsValidator, findAccounts);

/**
 * @swagger
 * /account/getAccountsForClient:
 *   get:
 *     tags:
 *       - Account
 *     summary: Get all accounts for logged-in client
 *     description: Shows accounts owned by the logged-in client user.
 *     operationId: getAccountsForClient
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of accounts to return
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *         description: Offset for accounts
 *     responses:
 *       200:
 *         description: Accounts retrieved successfully
 *       403:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/getAccountsForClient", getAccountsForClientValidator, getAccountsForClient);

/**
 * @swagger
 * /account/addFavoriteAccount:
 *   post:
 *     tags:
 *       - Account
 *     summary: Add an account to favorites
 *     description: Adds a bank account to the logged-in user's favorites.
 *     operationId: addFavoriteAccount
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Account number and alias to add to favorites.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *               - alias
 *             properties:
 *               number:
 *                 type: string
 *               alias:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favorite added successfully
 *       400:
 *         description: Account already in favorites or invalid data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.post("/addFavoriteAccount", addFavoriteAccountValidator, addFavoriteAccount);

/**
 * @swagger
 * /account/removeFavoriteAccount:
 *   post:
 *     tags:
 *       - Account
 *     summary: Remove an account from favorites
 *     description: Removes a bank account from the logged-in user's favorites.
 *     operationId: removeFavoriteAccount
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Account ID to remove from favorites.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - aid
 *             properties:
 *               aid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Favorite removed successfully
 *       400:
 *         description: Account not in favorites or invalid data
 *       404:
 *         description: Account not found
 *       500:
 *         description: Server error
 */
router.post("/removeFavoriteAccount", removeFavoriteAccountValidator, removeFavoriteAccount);

export default router;
