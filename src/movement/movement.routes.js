import { Router } from "express";
import { createDeposit, createTransfer, findMovements, findMovementsForClient, getAccountsByMovements } from "./movement.controller.js";
import { createDepositValidator, createTransferValidator, findMovementsValidator, findMovementsForClientValidator, getAccountsByMovementsValidator } from "../middlewares/movement-validators.js";

const router = Router();

/**
 * @swagger
 * /movement/createDeposit:
 *   post:
 *     tags: [Movement]
 *     summary: Create a deposit into an account
 *     description: Only ADMINISTRATOR or WORKER roles can make deposits.
 *     operationId: createDeposit
 *     security: [ BearerAuth: [] ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, destination]
 *             properties:
 *               amount: { type: number }
 *               destination: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Deposit completed }
 *       404: { description: Account not found }
 *       500: { description: Server error }
 */
router.post("/createDeposit", createDepositValidator, createDeposit);

/**
 * @swagger
 * /movement/createTransfer:
 *   post:
 *     tags: [Movement]
 *     summary: Make a transfer from one account to another
 *     description: Only CLIENT role can perform transfers from their own account.
 *     operationId: createTransfer
 *     security: [ BearerAuth: [] ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [origin, destination, amount]
 *             properties:
 *               origin: { type: string }
 *               destination: { type: string }
 *               amount: { type: number }
 *               description: { type: string }
 *     responses:
 *       201: { description: Transfer completed }
 *       403: { description: Unauthorized }
 *       404: { description: Account not found }
 *       500: { description: Server error }
 */
router.post("/createTransfer", createTransferValidator, createTransfer);

/**
 * @swagger
 * /movement/findMovements:
 *   post:
 *     tags: [Movement]
 *     summary: Search movements with multiple filters
 *     description: ADMINISTRATOR and WORKER roles can search all movement history.
 *     operationId: findMovements
 *     security: [ BearerAuth: [] ]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mid: { type: string }
 *               aid: { type: string }
 *               type: { type: string, enum: [DEPOSIT, WITHDRAWAL, TRANSFER] }
 *               worker: { type: string }
 *               client: { type: string }
 *               origin: { type: string }
 *               destination: { type: string }
 *               date: { type: string, format: date }
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: from
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Movements retrieved }
 *       404: { description: No results }
 *       500: { description: Server error }
 */
router.post("/findMovements", findMovementsValidator, findMovements);

/**
 * @swagger
 * /movement/getAccountsByMovements:
 *   post:
 *     tags: [Movement]
 *     summary: Get accounts sorted by number of movements
 *     description: ADMINISTRATOR can sort accounts by "MORE" or "LESS" movements.
 *     operationId: getAccountsByMovements
 *     security: [ BearerAuth: [] ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order]
 *             properties:
 *               order:
 *                 type: string
 *                 enum: [MORE, LESS]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: from
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Accounts found }
 *       404: { description: No accounts found }
 *       500: { description: Server error }
 */
router.post("/getAccountsByMovements", getAccountsByMovementsValidator, getAccountsByMovements);

/**
 * @swagger
 * /movement/findMovementsForClient:
 *   post:
 *     tags: [Movement]
 *     summary: Get movement history by account for a client
 *     description: CLIENT users can view their own account movement history.
 *     operationId: findMovementsForClient
 *     security: [ BearerAuth: [] ]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [aid]
 *             properties:
 *               aid: { type: string }
 *               mid: { type: string }
 *               type: { type: string }
 *               date: { type: string, format: date }
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: from
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Movements retrieved }
 *       404: { description: No results }
 *       500: { description: Server error }
 */
router.post("/findMovementsForClient", findMovementsForClientValidator, findMovementsForClient);

export default router;
