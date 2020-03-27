import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

import Token from '../classes/token';

const usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },

    avatar: {
        type: String,
        default: 'av-1.png'
    },

    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },

    password: {
        type: String,
        required: [true, 'El password es necesario']
    }

});

usuarioSchema.methods.comparePasswords = async function(password: string): Promise<boolean> {
    const user = this;
    return await bcrypt.compare(password, user.password);
};

usuarioSchema.methods.generateToken = function(): string {

    const { _id, nombre, email, avatar } = this;
    const data = { _id, nombre, email, avatar };

    return Token.generateToken(data);

};

interface IUsuario extends Document {
    nombre: string;
    avatar: string;
    email: string;
    password: string;
    comparePasswords: (password: string) => Promise<boolean>;
    generateToken: () => string;
}

const Usuario = model<IUsuario>('Usuario', usuarioSchema);

export default Usuario;
