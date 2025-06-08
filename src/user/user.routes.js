import { Router } from "express";
import { findUser,findUserForAdmin, getUsers, editUser, deleteUser, changePassword, changeRole } from "./user.controller.js";
import { findUserValidator,findUserForAdminValidator, getUsersValidator, editUserValidator, deleteUserValidator, changePasswordValidator, changeRoleValidator } from "../middlewares/user-validators.js";

const router = Router();

/**
 * @swagger
 * /user/findUser/{uid}:
 *   get:
 *     tags:
 *       - User
 *     summary: Find a user by ID
 *     description: Retrieves a specific user's details using their unique ID.
 *     operationId: findUser
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found successfully.
 *       400:
 *         description: Invalid ID or user not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/findUser/:uid", findUserValidator, findUser);

/**
 * @swagger
 * /user/findUserForAdmin:
 *   post:
 *     tags:
 *       - User
 *     summary: Find users with filters (Admin Only)
 *     description: Allows PLATFORM_ADMIN users to search for users using filters like ID, name, email, or role.
 *     operationId: findUserForAdmin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Filters for user search (optional)
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *                 description: User ID
 *               name:
 *                 type: string
 *                 description: Name (search by text)
 *               email:
 *                 type: string
 *                 description: Email address
 *               role:
 *                 type: string
 *                 enum: ["USER", "PLATFORM_ADMIN", "HOTEL_ADMIN"]
 *                 description: Role of the user
 *     responses:
 *       200:
 *         description: Users found successfully.
 *       403:
 *         description: Unauthorized request (only PLATFORM_ADMIN can use this endpoint).
 *       400:
 *         description: Invalid request parameters.
 *       500:
 *         description: Internal server error.
 */
router.post("/findUserForAdmin", findUserForAdminValidator, findUserForAdmin);


/**
 * @swagger
 * /user/getUsers:
 *   get:
 *     tags:
 *       - User
 *     summary: Retrieve all users
 *     description: Returns a paginated list of all users. Only accessible by administrators.
 *     operationId: getUsers
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved users.
 *       403:
 *         description: Unauthorized request.
 *       500:
 *         description: Internal server error.
 */
router.get("/getUsers", getUsersValidator, getUsers);

/**
 * @swagger
 * /user/editUser/{uid}:
 *   put:
 *     tags:
 *       - User
 *     summary: Edit a user's information
 *     description: Allows users to update their profile data or administrators to modify user accounts.
 *     operationId: editUser
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: The ID of the user to modify.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: User data to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid request.
 *       500:
 *         description: Internal server error.
 */
router.put("/editUser/:uid", editUserValidator, editUser);

/**
 * @swagger
 * /user/deleteUser/{uid}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete a user account
 *     description: Allows users to delete their own accounts or administrators to manage user removal.
 *     operationId: deleteUser
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Invalid ID or unauthorized deletion.
 *       500:
 *         description: Internal server error.
 */
router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser);

/**
 * @swagger
 * /user/changePassword/{uid}:
 *   put:
 *     tags:
 *       - User
 *     summary: Change a user's password
 *     description: Allows users to update their password securely.
 *     operationId: changePassword
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: The ID of the user updating their password.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Password update data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmation
 *             properties:
 *               password:
 *                 type: string
 *                 description: New password (must meet security requirements).
 *               confirmation:
 *                 type: string
 *                 description: Confirmation of the new password.
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Invalid request or mismatched confirmation.
 *       500:
 *         description: Internal server error.
 */
router.put("/changePassword/:uid", changePasswordValidator, changePassword);

/**
 * @swagger
 * /user/changeRole/{uid}:
 *   put:
 *     tags:
 *       - User
 *     summary: Change a user's role
 *     description: Allows administrators to modify the role of a user.
 *     operationId: changeRole
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: The ID of the user whose role is being updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Role update data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ["USER", "PLATFORM_ADMIN", "HOTEL_ADMIN"]
 *                 description: The new role assigned to the user.
 *     responses:
 *       200:
 *         description: Role updated successfully.
 *       400:
 *         description: Invalid request or unauthorized role update.
 *       500:
 *         description: Internal server error.
 */
router.put("/changeRole/:uid", changeRoleValidator, changeRole);

export default router;
