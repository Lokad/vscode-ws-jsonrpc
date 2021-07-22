/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { Disposable } from "vscode-jsonrpc";
import { IWebSocket } from "./socket";
import type RAL from "vscode-jsonrpc/lib/common/ral";

export class WebSocketStreamReader implements RAL.ReadableStream {
    private errorCallback: ((a: any) => void) | undefined;
    private closeCallback : (() => void) | undefined;

    constructor(private readonly socket: IWebSocket) { }

    onData(listener: (data: Uint8Array) => void): Disposable {
        this.socket.onMessage(listener);
        return { dispose: () => {} };
    }

    onClose(listener: () => void): Disposable {
        this.closeCallback = listener;
        this.socket.onClose((code, reason) => {
            if (code !== 1000) {
                const error: Error = {
                    name: '' + code,
                    message: `Error during socket reconnect: code = ${code}, reason = ${reason}`
                };
                if (this.errorCallback)
                    this.errorCallback(error);
            }

            if (this.closeCallback)
                this.closeCallback();
        });
        return { dispose: () => {} };
    }

    onError(listener: (error: any) => void): Disposable {
        this.socket.onError(listener);
        this.errorCallback = listener;
        return { dispose: () => {} };
    }

    onEnd(listener: () => void): Disposable {
        return { dispose: () => {} };
    }
}
