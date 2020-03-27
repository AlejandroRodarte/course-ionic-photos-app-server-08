import path from 'path';
import fs from 'fs';

import { UploadedFile } from 'express-fileupload';
import uniqid from 'uniqid';

export default class FileSystem {

    static saveTempImage(file: UploadedFile, userId: string) {

        const path = this.createUserFolder(userId);
        const filename = this.generateUniqueFilename(file.name);

        console.log(filename);

    }

    private static createUserFolder(userId: string): string {

        const userPath = path.resolve(__dirname, '../uploads', userId);
        const userPathTemp = userPath + '/temp';

        const dirExists = fs.existsSync(userPath);

        if (!dirExists) {
            fs.mkdirSync(userPath);
            fs.mkdirSync(userPathTemp);
        }

        return userPathTemp;

    }

    private static generateUniqueFilename(originalFilename: string) {

        const originalFilenameArr = originalFilename.split('.');
        const extension = originalFilenameArr[originalFilenameArr.length - 1];

        const uniqueId = uniqid();

        return `${uniqueId}.${extension}`;

    }

}
