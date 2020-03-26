import express from 'express';

export default class Server {

    private _app: express.Application;
    private _port: number = process.env.PORT ? +process.env.PORT : 3000;

    constructor() {
        this._app = express();
    }

    start(cb: () => void): void {
        this._app.listen(this._port, cb)
    }

    get app(): express.Application {
        return this._app;
    }

    get port(): number {
        return this._port;
    }

}
