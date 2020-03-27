import { Schema, model, Document } from 'mongoose';
import { NextFunction } from 'express';

const postSchema = new Schema<IPost>({

    created: {
        type: Date
    },

    mensaje: {
        type: String
    },

    img: [{
        type: String
    }],

    coords: {
        type: String
    },

    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Debe existir referencia a un usuario']
    }

});

postSchema.pre<IPost>('save', function(next: NextFunction) {

    const post = this;
    post.created = new Date();

    next();

});

interface IPost extends Document {
    created: Date;
    mensaje: string;
    img: string[];
    coords: string;
    usuario: string;
}

const Post = model<IPost>('Post', postSchema);

export default Post;
