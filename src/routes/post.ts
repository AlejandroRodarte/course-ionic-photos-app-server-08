import { Router, Response } from 'express';
import auth from '../middlewares/auth';
import Post from '../models/post';

const postRoutes = Router();

postRoutes.post('/', auth, async (req: any, res: Response) => {

    const post = req.body;

    post.usuario = req.usuario._id;

    const postDoc = new Post(post);

    try {
        await postDoc.save();
        await postDoc.populate('usuario').execPopulate();
    } catch (err) {
        return res.status(400).send({
            ok: false,
            err
        });
    }

    return res.json({
        ok: true,
        post: postDoc
    });

});

export default postRoutes;
