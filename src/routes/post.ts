import { Router, Response, Request } from 'express';
import auth from '../middlewares/auth';
import Post from '../models/post';

const postRoutes = Router();

postRoutes.get('/', async (req: Request, res: Response) => {

    const pagina = req.query.pagina ? +req.query.pagina : 1;
    const skip = 10 * (pagina - 1);

    const posts = 
        await Post
                .find({})
                .sort({ _id: -1 })
                .skip(skip)
                .limit(10)
                .populate({
                    path: 'usuario',
                    select: '-password'
                });

    return res.json({
        ok: true,
        pagina,
        posts
    });

});

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
