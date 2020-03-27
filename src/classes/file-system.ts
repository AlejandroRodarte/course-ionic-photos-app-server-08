import path from 'path';
import fs from 'fs';

import { UploadedFile } from 'express-fileupload';

export default class FileSystem {

    static saveTempImage(file: UploadedFile, userId: string) {
        const path = this.createUserFolder(userId);
    }

    static createUserFolder(userId: string) {

        const userPath = path.resolve(__dirname, '../uploads', userId);
        const userPathTemp = userPath + '/temp';

        const dirExists = fs.existsSync(userPath);

        if (!dirExists) {
            fs.mkdirSync(userPath);
            fs.mkdirSync(userPathTemp);
        }

        return userPathTemp;

    }

}
