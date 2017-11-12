import { IMessage } from "../Message";
import { MessageBuffer } from "./MessageBuffer";
import { BufferSubscription } from "./BufferSubscription"

export class Client {
    private clientName: string;
    private sendDelay: number;
    private msgBuffer: MessageBuffer;
    private bufferSubscription: BufferSubscription;

    constructor(name: string, sendDelay: number, msgBuffer: MessageBuffer) {
        this.clientName = name;
        this.sendDelay = sendDelay;
        this.msgBuffer = msgBuffer;
        this.bufferSubscription = msgBuffer.subscribe(this.sendMessage);
    }

    public dispose() {
        this.msgBuffer.unsubscribe(this.bufferSubscription);
    }

    public sendMessage = (msg: IMessage): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log(`Client "${this.clientName}" -> Message "${msg.data}" sent`)
                resolve();
            }, this.sendDelay)
        })
    }
}