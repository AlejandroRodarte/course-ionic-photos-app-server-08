import Server from './classes/server';

import userRoutes from './routes/usuario';

import './db/mongoose';

const server = new Server();

server.app.use('/user', userRoutes);

server.start(() => console.log(`Servidor corriendo en puerto ${server.port}`));
