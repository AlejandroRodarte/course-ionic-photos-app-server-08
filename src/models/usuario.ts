import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

import Token from '../classes/token';
import { NextFunction } from 'express';

const usuarioSchema = new Schema<IUsuario>({

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

    return Token.generateToken({ usuario: data });

};

usuarioSchema.methods.updateField = function(key: UsuarioUpdatableFields, value: any): void {
    const user = this;
    user[key] = value;
};

usuarioSchema.pre<IUsuario>('save', async function(next: NextFunction) {

    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, process.env.BCRYPT_ROUNDS ? +process.env.BCRYPT_ROUNDS : 8);
    }

    next();

});

interface IUsuario extends Document {
    nombre: string;
    avatar: string;
    email: string;
    password: string;
    comparePasswords: (password: string) => Promise<boolean>;
    generateToken: () => string;
    updateField: (key: UsuarioUpdatableFields, value: any) => void;
}

export type UsuarioUpdatableFields = 'nombre' | 'avatar' | 'email' | 'password';

const Usuario = model<IUsuario>('Usuario', usuarioSchema);

export default Usuario;
