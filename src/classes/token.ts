import jwt from 'jsonwebtoken';

export default class Token {

    private static secretKey = process.env.JWT_SECRET_KEY ? process.env.JWT_SECRET_KEY : '';
    private static expirationTime = process.env.JWT_EXPIRATION_TIME ? process.env.JWT_EXPIRATION_TIME : '';

    public static generateToken(payload: string | object | Buffer): string {
        return jwt.sign(payload, this.secretKey, { expiresIn: this.expirationTime });
    }

    public static verifyToken(token: string): Promise<string | object> {

        return new Promise((resolve, reject) => {

            jwt.verify(token, this.secretKey, (err, decoded) => {

                if (err) {
                    reject(err);
                }

                resolve(decoded);

            });

        });

    }

}
