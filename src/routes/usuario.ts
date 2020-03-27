import { Router, Request, Response } from 'express';

import Usuario from '../models/usuario';

const userRoutes = Router();

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

    return res.json({
        ok: true,
        user: userDoc
    });

});

export default userRoutes;
