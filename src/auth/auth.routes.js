import { Router } from "express";
import { login } from "./auth.controller.js";
import { loginValidator } from "../middlewares/user-validators.js";

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login to the system
 *     description: Authenticates a user and returns a JWT token.
 *     operationId: login
 *     requestBody:
 *       description: Login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful. Returns a JWT.
 *       400:
 *         description: Invalid credentials or missing fields.
 *       500:
 *         description: Internal server error.
 */
router.post("/login", loginValidator, login);

export default router;
