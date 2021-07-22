/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { Disposable } from "vscode-jsonrpc";
import type RAL from "vscode-jsonrpc/lib/common/ral";
import { IWebSocket } from "./socket";


export class WebSocketStreamWriter implements RAL.WritableStream {
    private _onEnd : () => void;

    constructor(protected readonly socket: IWebSocket) {
        this._onEnd = () => {};
    }

    onClose(listener: () => void): Disposable {
        this.socket.onClose(listener);
        return { dispose: () => {} };
    }
    onError(listener: (error: any) => void): Disposable {
        this.socket.onError(listener);
        return { dispose: () => {} };
    }
    onEnd(listener: () => void): Disposable {
        this._onEnd = listener;
        return { dispose: () => {} };
    }

    write(data: Uint8Array): Promise<void>;
    write(data: string, encoding: "ascii" | "utf-8"): Promise<void>;
    write(data: any, encoding?: any): Promise<void> {
        return new Promise<void>((resolve, reject) =>
        {
            try {
                this.socket.send(data);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    end(): void {
        this._onEnd();
    }
}
