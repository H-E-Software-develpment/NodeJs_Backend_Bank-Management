'use strict'
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { hash } from "argon2";
import { dbConnection } from './mongo.js';
import User from "../src/user/user.model.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import accountRoutes from "../src/account/account.routes.js";
import productRoutes from "../src/product/product.routes.js";
import { swaggerDocs, swaggerUi } from "./swagger.js";

class ExpressServer {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = http.createServer(this.app);
        this.middlewares();
        this.conectarDB().then(async () => {
            await this.defaultAdministratorAccount();
        });
        this.routes();
    }

    async conectarDB() {
        try {
            await dbConnection();
        } catch (err) {
            console.log(`Database connection failed: ${err}`);
            process.exit(1);
        }
    }

    defaultAdministratorAccount = async () => {
        try {
            const admin = await User.findOne({ role: "ADMINISTRATOR" });
            if (admin) return;

            const defaultAdmin = {
                name: "Braulio Jose Echeverria Montufar",
                username: "ADMINB",
                dpi:"1234567890123",
                address:"Zona 10 Guatemala Plaza Española",
                phone: "12345678",
                email:"braulio@gmail.com",
                password: await hash("ADMINB", 10),
                role: "ADMINISTRATOR",
                job:"Maestro",
                income:"8000",
            };

            await User.create(defaultAdmin);

        } catch (err) {
            throw new Error('Failed to create default admin account');
        }
    };

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes() {
        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
        this.app.use("/bankManagement/v1/auth", authRoutes);
        this.app.use("/bankManagement/v1/user", userRoutes);
        this.app.use("/bankManagement/v1/account", accountRoutes);
        this.app.use("/bankManagement/v1/product", productRoutes);
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default ExpressServer;

