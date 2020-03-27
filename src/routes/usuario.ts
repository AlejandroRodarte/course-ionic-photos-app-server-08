import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import Usuario from '../models/usuario';

import Token from '../classes/token';

const userRoutes = Router();

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
    
    try {
        user.password = await bcrypt.hash(user.password, process.env.BCRYPT_ROUNDS ? +process.env.BCRYPT_ROUNDS : 8);
    } catch (err) {
        return res.status(400).send({
            ok: false,
            err
        });
    }

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

export default userRoutes;
