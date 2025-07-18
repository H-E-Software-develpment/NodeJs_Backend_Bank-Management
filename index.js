import './configs/env.js'; // ⚠️ Se ejecuta primero y carga el .env correctamente

import ExpressServer from './configs/server.js';

const server = new ExpressServer();
server.listen();
