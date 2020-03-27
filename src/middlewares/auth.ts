import { Response, NextFunction } from 'express';

import Token from '../classes/token';

export default async (req: any, res: Response, next: NextFunction) => {

    const token = req.header('x-token') || '';

    try {

        const { usuario } = await Token.verifyToken(token);
        req.usuario = usuario;

        next();

    } catch (err) {
        return res.status(401).send({
            ok: false,
            mensaje: 'No autenticado'
        });
    }

}
