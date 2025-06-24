import { body, param } from "express-validator";
import { findUser, findUsername, emailDuplicated, validRole } from "../helpers/db-validators.js";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

// ---------- DOES NOT NEED JWT NOR ROLES---------- //
export const loginValidator = [
    body("username").notEmpty().withMessage("username is required").custom(findUsername),
    body("password").notEmpty().withMessage("Password is required"),
    validateFields,
    handleErrors
];

// ---------- ADMINISTRATOR ROLE ---------- //
export const createUserForAdminValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR"),
    body("name").notEmpty().withMessage("Complete name is required").isString().withMessage("Your name must be a valid name").isLength({ max: 60 }).withMessage("Name cannot exceed 60 characters"),
    body("username").notEmpty().withMessage("Username is required"),
    body("dpi").notEmpty().withMessage("DPI is required for identification").isString().withMessage("DPI must be a valid string").isLength({ max: 13 }).withMessage("DPI must be 13 characters"),
    body("address").notEmpty().withMessage("Address is required"),
    body("phone").notEmpty().withMessage("Phone number is required").isLength({ max: 8 }).withMessage("Phone number must be 8 characters"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid").custom(emailDuplicated),
    body("password").notEmpty().withMessage("Password is required"),
    body("role").notEmpty().withMessage("Role is required").custom(validRole),
    body("job").notEmpty().withMessage("Job information is needed"),
    body("income").notEmpty().withMessage("Income must be specified"),
    validateFields,
    handleErrors
];

export const getUsersForAdminValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR"),
    validateFields,
    handleErrors
];

// ---------- ADMINISTRATOR ROLE AND WORKER ROLE ---------- //
export const findUsersValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    body("uid").optional().isMongoId().withMessage("User ID is invalid"),
    body("username").optional().isString().withMessage("Username must be a valid string"),
    body("name").optional().isString().withMessage("Name must be a valid string"),
    body("role").optional().custom(validRole),
    validateFields,
    handleErrors
];

export const editUserValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    param("uid").isMongoId().withMessage("User ID is invalid").notEmpty().withMessage("User ID is required").custom(findUser),
    body("name").optional().isString().withMessage("Name must be a valid string"),
    body("address").optional().isString().withMessage("Address must be a valid string"),
    body("job").optional().isString().withMessage("Job information must be a valid string"),
    body("income").optional().isString().withMessage("Income must be a valid string"),
    validateFields,
    handleErrors
];

export const deleteUserValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    param("uid").isMongoId().withMessage("User ID is invalid").notEmpty().withMessage("User ID is required").custom(findUser),
    validateFields,
    handleErrors
];

// ---------- CLIENT OR ALL ROLES ---------- //

export const showProfileValidator = [
    validateJWT,
    validateFields,
    handleErrors
];

export const editUserProfileValidator = [
    validateJWT,
    body("name").optional().isString().withMessage("Name must be a valid string"),
    body("address").optional().isString().withMessage("Address must be a valid string"),
    body("job").optional().isString().withMessage("Job information must be a valid string"),
    body("income").optional().isString().withMessage("Income must be a valid string"),
    validateFields,
    handleErrors
];

export const changeUserPasswordValidator = [
    validateJWT,
    param("uid").isMongoId().withMessage("User ID is invalid").notEmpty().withMessage("User ID is required").custom(findUser),
    body("password").notEmpty().withMessage("Password is required").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
    body("confirmation").notEmpty().withMessage("Confirmation is required").isString().withMessage("Confirmation must be a valid string"),
    validateFields,
    handleErrors
];