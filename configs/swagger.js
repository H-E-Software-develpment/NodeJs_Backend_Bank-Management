import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Hotel Manager - API Web",
            version: "1.0.0",
            description:
                "una aplicación web que funcione como una plataforma centralizada para la gestión hotelera. Esta aplicación deberá ofrecer funcionalidades completas para la gestión de hotel es, habitaciones y eventos asociados.",
            contact: {
                name: " H.E - Software Development / Anthony Josue Escobar Ponce ",
                email: "anthonyescobarponce@Outlook.com",
            },
        },
        servers: [
            {
                url: "http://127.0.0.1:3001/hotelManager/v1",
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
        "./src/hotel/hotel.routes.js",
        "./src/room/room.routes.js",
        "./src/event/event.routes.js",
        "./src/reservation/reservation.routes.js",
        "./src/report/report.routes.js"
    ],
};

const swaggerDocs = swaggerJSDoc(options);

export { swaggerDocs, swaggerUi };
