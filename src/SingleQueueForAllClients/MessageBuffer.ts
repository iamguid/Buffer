import { IMessage, TMergeFunction, TSendMessage, mergeMessages } from "../Message";
import { BufferSubscription } from "./BufferSubscription";

export class MessageBuffer {
    private mergeMessage: TMergeFunction;
    private subscriptions: Set<BufferSubscription>;
    private messages: Map<number, IMessage>;
    private buffer: number[];

    constructor(merge: TMergeFunction) {
        this.mergeMessage = merge;
        this.subscriptions = new Set();
        this.messages = new Map();
        this.buffer = [];
    }

    public pushMessage(msg: IMessage) {        
        if (this.messages.has(msg.id)) {
            console.log(`Message buffer -> update message ${msg.data}`)
            const existMessage = this.messages.get(msg.id);
            this.mergeMessage(existMessage, msg)
        } else {
            console.log(`Message buffer -> add message ${msg.data}`)
            this.messages.set(msg.id, msg);
            this.buffer.push(msg.id);
        }
        
        this.subscriptions.forEach(s => {
            s.onNewMessage(msg)
        })
    }

    public removeReadedMessages() {
        const slowIndex = this.getSlowIndex();
        const bufferFirstIndex = this.buffer.
    }

    public subscribe(sendMessage: TSendMessage): BufferSubscription {
        const newSubscription = new BufferSubscription(this, sendMessage);
        this.subscriptions.add(newSubscription)
        return newSubscription;
    }

    public unsubscribe(subscription: BufferSubscription) {
        if (this.subscriptions.has(subscription)) {
            this.subscriptions.delete(subscription)
        }
    }

    public getMessage = (index: number): IMessage => {        
        return this.messages.get(this.buffer[index])
    }

    public getSlowIndex(): number {
        const subscriptions = Array.from(this.subscriptions.values())
        return subscriptions.reduce((accum, value) => {
            return Math.min(accum, value.index);
        }, subscriptions.length ? subscriptions[0].index : 0)
    }

    public getFastIndex(): number {
        const subscriptions = Array.from(this.subscriptions.values())
        return subscriptions.reduce((accum, value) => {
            return Math.max(accum, value.index);
        }, subscriptions.length ? subscriptions[0].index : 0)
    }
}