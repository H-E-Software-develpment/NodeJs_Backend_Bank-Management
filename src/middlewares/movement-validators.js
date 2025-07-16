import { body, param } from "express-validator";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { validMovementType, validMovementOrder, findAccount } from "../helpers/db-validators.js";
import { validateDailyLimit } from "./validateDailyLimit-validator.js";

// ---------- WORKER/ADMINISTRATOR ROLES ---------- //
export const createDepositValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    body("amount").notEmpty().isNumeric().withMessage("Amount is required and must be numeric"),
    body("destination").notEmpty().isString().withMessage("Destination account number is required"),
    body("description").optional().isString().withMessage("Description must be a valid string"),
    validateFields,
    handleErrors
];

export const findMovementsValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    body("mid").optional().isMongoId().withMessage("Invalid movement ID"),
    body("aid").optional().isMongoId().custom(findAccount),
    body("worker").optional().isString(),
    body("client").optional().isString(),
    body("type").optional().custom(validMovementType),
    body("date").optional().isISO8601().withMessage("Invalid date format"),
    body("origin").optional().isString(),
    body("destination").optional().isString(),
    validateFields,
    handleErrors
];

export const getAccountsByMovementsValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    body("order").notEmpty().custom(validMovementOrder),
    validateFields,
    handleErrors
];

// ---------- CLIENT ROLE ---------- //
export const createTransferValidator = [
    validateJWT,
    hasRoles("CLIENT"),
    body("origin").notEmpty().isString().withMessage("Origin account number is required"),
    body("destination").notEmpty().isString().withMessage("Destination account number is required"),
    body("amount").notEmpty().isNumeric().withMessage("Amount is required and must be numeric"),
    body("description").optional().isString().withMessage("Description must be a valid string"),
    validateDailyLimit,
    validateFields,
    handleErrors
];

export const findMovementsForClientValidator = [
    validateJWT,
    hasRoles("CLIENT"),
    body("aid").notEmpty().isMongoId().withMessage("Account ID is required and must be valid"),
    body("mid").optional().isMongoId(),
    body("type").optional().custom(validMovementType),
    body("date").optional().isISO8601().withMessage("Invalid date format"),
    validateFields,
    handleErrors
];
