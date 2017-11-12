import { IMessage, TSendMessage } from "../Message"
import { MessageBuffer } from "./MessageBuffer"

export class BufferSubscription {
    private msgBuffer: MessageBuffer;
    private msgQueue: number[];
    private sendMessage: TSendMessage;
    private isMessageSending: boolean;

    constructor(msgBuffer: MessageBuffer, sendMessage: TSendMessage) {
        this.msgBuffer = msgBuffer;
        this.msgQueue = [];
        this.sendMessage = sendMessage;
        this.isMessageSending = false;
    }
    
    public onNewMessage = (msg: IMessage) => {
        this.msgQueue.push(msg.id);

        const next = () => {
            const nextMsgId = this.msgQueue.shift();
            if (typeof nextMsgId !== "undefined") {
                this.isMessageSending = true;
                const nextMsg = this.msgBuffer.getMessage(nextMsgId);
                this.sendMessage(nextMsg)
                    .then(() => {
                        this.isMessageSending = false;
                        next();
                    })
            }
        }

        if (!this.isMessageSending) {
            next()            
        }
    }
}