import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import Usuario, { UsuarioUpdatableFields } from '../models/usuario';

import auth from '../middlewares/auth';

const userRoutes = Router();

userRoutes.get('/', auth, (req: any, res: Response) => res.send({
    ok: true,
    usuario: req.usuario
}));

userRoutes.post('/login', async (req: Request, res: Response) => {

    const { email, password } = req.body;

    try {

        const user = await Usuario.findOne({ email });

        if (!user) {
            return res.status(401).send({
                ok: false,
                mensaje: 'No autenticado'
            });
        }

        const passwordsMatch = await user.comparePasswords(password);

        if (!passwordsMatch) {
            return res.status(401).send({
                ok: false,
                mensaje: 'No autenticado'
            });
        }

        const token = user.generateToken();

        return res.json({
            ok: true,
            token
        });

    } catch (err) {
        return res.status(400).send({
            ok: false,
            err
        });
    }

});

userRoutes.post('/create', async (req: Request, res: Response) => {

    const { nombre, email, password, avatar = undefined } = req.body;

    const user = {
        nombre,
        email,
        password,
        avatar
    };

    const userDoc = new Usuario(user);

    try {
        await userDoc.save();
    } catch (err) {
        return res.status(400).send({
            ok: false,
            err
        });
    }

    const token = userDoc.generateToken();

    return res.json({
        ok: true,
        token
    });

});

userRoutes.post('/update', auth, async (req: any, res: Response) => {

    const updatableFields = ['nombre', 'email', 'avatar', 'password'];

    const requestBodyFields = Object.keys(req.body) as UsuarioUpdatableFields[];

    const isUpdatable = requestBodyFields.every((field: string) => updatableFields.includes(field));

    if (!isUpdatable) {
        return res.status(401).send({
            ok: false,
            mensaje: 'Send valid fields'
        });
    }

    try {

        const user = await Usuario.findOne({ _id: req.usuario._id });

        if (!user) {
            return res.status(404).send({
                ok: false,
                mensaje: 'User not found'
            });
        }



        requestBodyFields.forEach((field: UsuarioUpdatableFields) => user.updateField(field, req.body[field]));

        await user.save();

        const token = user.generateToken();

        return res.json({
            ok: true,
            token
        });    

    } catch (err) {
        return res.status(400).send({
            ok: false,
            err
        });
    }

});

export default userRoutes;
