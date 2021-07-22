/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import {
    MessageConnection,
    createMessageConnection,
    Logger,
    ReadableStreamMessageReader,
    WriteableStreamMessageWriter } from "vscode-jsonrpc";
import { IWebSocket } from "./socket";
import { WebSocketStreamReader } from "./reader";
import { WebSocketStreamWriter } from "./writer";

export function createWebSocketConnection(socket: IWebSocket, logger: Logger): MessageConnection {
    const messageReader = new ReadableStreamMessageReader(new WebSocketStreamReader (socket));
    const messageWriter = new WriteableStreamMessageWriter(new WebSocketStreamWriter(socket));
    const connection = createMessageConnection(messageReader, messageWriter, logger);
    connection.onClose(() => connection.dispose());
    return connection;
}
