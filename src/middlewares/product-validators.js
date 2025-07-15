import { body, param } from "express-validator";
import { validateFields } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { validProductCategory, findProduct } from "../helpers/db-validators.js";

// ---------- ADMINISTRATOR ROLE ---------- //
export const createProductValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR"),
    body("name").notEmpty().withMessage("Product name is required").isString(),
    body("description").notEmpty().withMessage("Product description is required").isString(),
    body("category").notEmpty().withMessage("Product category is required").custom(validProductCategory),
    validateFields,
    handleErrors
];

export const editProductValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR"),
    param("pid").notEmpty().withMessage("Product ID is required").isMongoId().withMessage("Product ID is invalid").custom(findProduct),
    body("name").optional().isString().withMessage("Name must be a valid string"),
    body("description").optional().isString().withMessage("Description must be a valid string"),
    body("category").optional().custom(validProductCategory),
    validateFields,
    handleErrors
];

export const deleteProductValidator = [
    validateJWT,
    hasRoles("ADMINISTRATOR"),
    param("pid").notEmpty().withMessage("Product ID is required").isMongoId().withMessage("Product ID is invalid").custom(findProduct),
    validateFields,
    handleErrors
];

// ---------- ALL ROLES ---------- //
export const findProductsValidator = [
    validateJWT,
    body("pid").optional().isMongoId().withMessage("Product ID is invalid").custom(findProduct),
    body("name").optional().isString().withMessage("Name must be a valid string"),
    body("category").optional().custom(validProductCategory),
    validateFields,
    handleErrors
];
