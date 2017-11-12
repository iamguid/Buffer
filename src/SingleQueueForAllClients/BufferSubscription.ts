import { IMessage, TSendMessage } from "../Message"
import { MessageBuffer } from "./MessageBuffer"

export class BufferSubscription {
    private msgIndex: number;
    private msgBuffer: MessageBuffer;
    private sendMessage: TSendMessage;
    private isMessageSending: boolean;

    constructor(msgBuffer: MessageBuffer, sendMessage: TSendMessage) {
        this.msgBuffer = msgBuffer;
        this.msgIndex = msgBuffer.getSlowIndex();
        this.sendMessage = sendMessage;
        this.isMessageSending = false;
    }

    public get index() {
        return this.msgIndex;
    }

    public onNewMessage = (msg: IMessage) => {
        const next = () => {
            if (!this.isMessageSending && this.hasNext()) {
                const nextMessage = this.getNext();
                this.isMessageSending = true;
                this.sendMessage(nextMessage)
                    .then(() => {
                        this.isMessageSending = false;
                        next();
                    })
            }
        }

        next()
    }

    private hasNext(): boolean {
        const nextMessage = this.msgBuffer.getMessage(this.msgIndex + 1);
        return typeof nextMessage !== "undefined";
    }

    private getNext(): IMessage {
        if (!this.hasNext()) {
            throw new Error("Buffer dont have next message")
        }

        return this.msgBuffer.getMessage(this.msgIndex++);
    }
}