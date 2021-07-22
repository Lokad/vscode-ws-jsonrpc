/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import { Message } from "vscode-jsonrpc/lib/common/messages";
import { AbstractMessageWriter } from "vscode-jsonrpc/lib/common/messageWriter";
import { IWebSocket } from "./socket";

export class WebSocketMessageWriter extends AbstractMessageWriter {

    protected errorCount = 0;

    constructor(protected readonly socket: IWebSocket) {
        super();
    }

    end() :void {}
    write(msg: Message) {
        return new Promise<void>((resolve, reject) =>
        {
            try {
                const content = JSON.stringify(msg);
                this.socket.send(content);
                resolve();
            } catch (e) {
                this.errorCount++;
                this.fireError(e, msg, this.errorCount);
                reject(e);
            }
        });
    }
}
