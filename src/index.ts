import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';

import Server from './classes/server';

import userRoutes from './routes/usuario';

import './db/mongoose';
import postRoutes from './routes/post';

const server = new Server();

server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

server.app.use(fileUpload());

server.app.use('/user', userRoutes);
server.app.use('/post', postRoutes);

server.start(() => console.log(`Servidor corriendo en puerto ${server.port}`));
