
import { Router } from "express";
import { createUserForAdmin, getUsersForAdmin, findUsers, editUser, deleteUser, showProfile, editUserProfile, changeUserPassword } from "./user.controller.js";
import { createUserForAdminValidator, getUsersForAdminValidator, findUsersValidator, editUserValidator, deleteUserValidator, showProfileValidator, editUserProfileValidator, changeUserPasswordValidator } from "../middlewares/user-validators.js";

const router = Router();

/**
 * @swagger
 * /user/createUserForAdmin:
 *   post:
 *     tags:
 *       - User
 *     summary: Create a new Worker or Administrator account
 *     description: Allows an administrator to create a new admin or worker (no client accounts allowed).
 *     operationId: createUserForAdmin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Account data to be created.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, WORKER]
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Invalid role or data.
 *       500:
 *         description: Internal server error.
 */
router.post("/createUserForAdmin", createUserForAdminValidator, createUserForAdmin);

/**
 * @swagger
 * /user/getUsersForAdmin:
 *   get:
 *     tags:
 *       - User
 *     summary: Get all active users
 *     description: Allows an admin to retrieve all active accounts regardless of role.
 *     operationId: getUsersForAdmin
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully.
 *       403:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get("/getUsersForAdmin", getUsersForAdminValidator, getUsersForAdmin);

/**
 * @swagger
 * /user/findUsers:
 *   post:
 *     tags:
 *       - User
 *     summary: Search for users by filters
 *     description: Admins can search by any role. Workers are limited to viewing only CLIENT accounts.
 *     operationId: findUsers
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Search parameters.
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Users found successfully.
 *       403:
 *         description: Access to roles restricted by user permissions.
 *       500:
 *         description: Internal server error.
 */
router.post("/findUsers", findUsersValidator, findUsers);

/**
 * @swagger
 * /user/editUser/{uid}:
 *   put:
 *     tags:
 *       - User
 *     summary: Edit user account
 *     description: Workers can only edit CLIENTs. Admins can't edit other Admins.
 *     operationId: editUser
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: The ID of the user to be edited.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Fields to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               job:
 *                 type: string
 *               income:
 *                 type: number
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: User not found or invalid data.
 *       403:
 *         description: Not allowed to edit this user.
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
 *     summary: Soft delete a user
 *     description: Workers can delete only CLIENTs. Admins can't delete other Admins.
 *     operationId: deleteUser
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       400:
 *         description: Invalid ID or user not found.
 *       403:
 *         description: Not allowed to delete this user.
 *       500:
 *         description: Internal server error.
 */
router.delete("/deleteUser/:uid", deleteUserValidator, deleteUser);

/**
 * @swagger
 * /user/showProfile:
 *   get:
 *     tags:
 *       - User
 *     summary: View own profile
 *     description: Any authenticated user can view their own account details.
 *     operationId: showProfile
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully.
 *       400:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/showProfile", showProfileValidator, showProfile);

/**
 * @swagger
 * /user/editUserProfile:
 *   put:
 *     tags:
 *       - User
 *     summary: Edit own profile
 *     description: Any user can update their own profile details.
 *     operationId: editUserProfile
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Profile fields to update.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               job:
 *                 type: string
 *               income:
 *                 type: number
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: User not found or invalid data.
 *       500:
 *         description: Internal server error.
 */
router.put("/editUserProfile", editUserProfileValidator, editUserProfile);

/**
 * @swagger
 * /user/changeUserPassword/{uid}:
 *   put:
 *     tags:
 *       - User
 *     summary: Change password
 *     description: Allows a logged-in user to change their password securely.
 *     operationId: changeUserPassword
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: ID of the user whose password is being changed.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New password details.
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
 *               confirmation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully.
 *       400:
 *         description: Validation failed or same as old password.
 *       401:
 *         description: Unauthorized action.
 *       500:
 *         description: Internal server error.
 */
router.put("/changeUserPassword/:uid", changeUserPasswordValidator, changeUserPassword);

export default router;

