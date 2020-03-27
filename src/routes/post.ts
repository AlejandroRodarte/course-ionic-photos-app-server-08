import { Router, Response, Request } from 'express';
import auth from '../middlewares/auth';
import Post from '../models/post';
import { UploadedFile } from 'express-fileupload';
import FileSystem from '../classes/file-system';

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

    const filenames = FileSystem.moveFilesFromTempToPosts(req.usuario._id);
    post.img = filenames;

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

postRoutes.post('/upload', auth, async (req: any, res: Response) => {

    if (!req.files) {
        return res.status(400).send({
            ok: false,
            mensaje: 'No file uploaded'
        });
    }

    const file = req.files.image as UploadedFile;

    if (!file) {
        return res.status(400).send({
            ok: false,
            mensaje: 'No file uploaded named image'
        });
    }

    if (!file.mimetype.includes('image')) {
        return res.status(400).send({
            ok: false,
            mensaje: 'What was uploaded is not an image'
        });
    }

    await FileSystem.saveTempImage(file, req.usuario._id);

    return res.status(200).send({
        ok: true,
        file: file.mimetype
    });

});

export default postRoutes;
