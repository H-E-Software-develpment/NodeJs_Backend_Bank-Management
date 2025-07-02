import { body, param, query } from "express-validator";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { validAccountType, findAccount, findUserByDPI } from "../helpers/db-validators.js";

// ---------- ADMINISTRATOR AND WORKER ---------- //
export const createClientWithAccountValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    body("name").notEmpty().withMessage("Complete name is required").isString().withMessage("Name must be a valid string"),
    body("username").notEmpty().withMessage("Username is required").isString(),
    body("dpi").notEmpty().withMessage("DPI is required").isString().isLength({ max: 13 }).withMessage("DPI must be 13 characters"),
    body("address").notEmpty().withMessage("Address is required").isString(),
    body("phone").notEmpty().withMessage("Phone number is required").isLength({ max: 8 }).withMessage("Phone number must be 8 characters"),
    body("email").notEmpty().withMessage("Email is required").isEmail(),
    body("password").notEmpty().withMessage("Password is required"),
    body("job").notEmpty().withMessage("Job information is required").isString(),
    body("income").notEmpty().withMessage("Income must be specified").isNumeric(),
    body("type").notEmpty().withMessage("Account type must be CHEKING or SAVINGS").custom(validAccountType),
    body("balance").optional().isNumeric().withMessage("Balance must be a number"),
    validateFields,
    handleErrors
];

export const createAccountValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    body("owner").notEmpty().withMessage("Owner DPI is required").isString().custom(findUserByDPI),
    body("type").notEmpty().withMessage("Account type must be CHEKING or SAVINGS").custom(validAccountType),
    body("balance").optional().isNumeric().withMessage("Balance must be a number"),
    validateFields,
    handleErrors
];

export const closeAccountValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    param("aid").notEmpty().withMessage("Account ID is required").isMongoId().withMessage("Account ID is invalid").custom(findAccount),
    validateFields,
    handleErrors
];

// ---------- ALL ROLES ---------- //
export const findAccountsValidator = [
    validateJWT,
    body("aid").optional().isMongoId().withMessage("Account ID is invalid").custom(findAccount),
    body("owner").optional().isString().withMessage("Owner DPI must be a valid string").custom(findUserByDPI),
    body("type").optional().custom(validAccountType),
    handleErrors
];

// ---------- CLIENT ROLE ---------- //
export const getAccountsForClientValidator = [
    validateJWT,
    hasRoles("CLIENT"),
    validateFields,
    handleErrors
];

export const addFavoriteAccountValidator = [
    validateJWT,
    hasRoles("CLIENT"),
    body("number").notEmpty().withMessage("Account number is required").isString(),
    body("alias").notEmpty().withMessage("Alias is required").isString(),
    validateFields,
    handleErrors
];

export const removeFavoriteAccountValidator = [
    validateJWT,
    hasRoles("CLIENT"),
    body("aid").notEmpty().withMessage("Account ID is required").isMongoId().withMessage("Account ID is invalid").custom(findAccount),
    validateFields,
    handleErrors
];
