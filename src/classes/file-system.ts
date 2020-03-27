import path from 'path';
import fs from 'fs';

import { UploadedFile } from 'express-fileupload';
import uniqid from 'uniqid';

export default class FileSystem {

    static saveTempImage(file: UploadedFile, userId: string): Promise<void> {

        const path = this.createUserFolder(userId);
        const filename = this.generateUniqueFilename(file.name);

        return new Promise((resolve, reject) => {

            file.mv(`${path}/${filename}`, (err) => {
    
                if (err) {
                    reject(err);
                }

                resolve();
    
            });

        });

    }

    static moveFilesFromTempToPosts(userId: string): string[] {

        const userTempPath = path.resolve(__dirname, '../uploads', userId, 'temp');
        const userPostsPath = path.resolve(__dirname, '../uploads', userId, 'posts');

        if (!fs.existsSync(userTempPath)) {
            return [];
        }

        if (!fs.existsSync(userPostsPath)) {
            fs.mkdirSync(userPostsPath);
        }

        const filenames = this.getFilenamesFromTemp(userTempPath);

        filenames.forEach((filename: string) => fs.renameSync(`${userTempPath}/${filename}`, `${userPostsPath}/${filename}`));

        return filenames;

    }

    private static getFilenamesFromTemp(tempDir: string): string[] {
        return fs.readdirSync(tempDir) || [];
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
