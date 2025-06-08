import { body, param } from "express-validator";
import { findUser, findUsername, emailDuplicated, validRole} from "../helpers/db-validators.js";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const loginValidator = [
    body("username").notEmpty().withMessage("username is required").custom(findUsername),
    body("password").notEmpty().withMessage("Password is required"),
    validateFields,
    handleErrors
];

export const createUserValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR", "WORKER"),
    body("name").notEmpty().withMessage("Complete name is required").isString().withMessage("Your name must be a valid name").isLength({ max: 60 }).withMessage("Name cannot exceed 60 characters"),
    body("username").notEmpty().withMessage("Username is required").custom(findUsername),
    body("dpi").notEmpty().withMessage("DPI is required for identification").isString().withMessage("DPI must be a valid string").isLength({ max: 13 }).withMessage("DPI must be 13 characters").custom(dpiDuplicated),
    body("address").notEmpty().withMessage("Address is required"),
    body("phone").notEmpty().withMessage("Phone number is required").isLength({ max: 8 }).withMessage("Phone number must be 8 characters"),
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid").custom(emailDuplicated),
    body("password").notEmpty().withMessage("Password is required").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }),
    body("role").notEmpty().withMessage("Role is required").custom(validRole),
    body("job").notEmpty().withMessage("Job information is needed"),
    body("income").notEmpty().withMessage("Income must be specified"),
    validateFields,
    handleErrors
];
