import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Bank Manager API Web",
            version: "1.0.0",
            description:
                "El objetivo de esta aplicación es construir un sistema bancario completo que permita la gestión segura y dinámica de usuarios, cuentas, movimientos financieros, y servicios exclusivos.",
            contact: {
                name: " H.E - Software Development / Anthony Josue Escobar Ponce ",
                email: "anthonyescobarponce@Outlook.com",
            },
        },
        servers: [
            {
                url: "http://127.0.0.1:3001/bankManagement/v1",
            },
        ],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
    },
    apis: [
        "./src/auth/auth.routes.js", 
        "./src/user/user.routes.js",
        "./src/account/account.routes.js",
        "./src/product/product.routes.js",
        "./src/movement/movement.routes.js"
    ],
};

const swaggerDocs = swaggerJSDoc(options);

export { swaggerDocs, swaggerUi };
