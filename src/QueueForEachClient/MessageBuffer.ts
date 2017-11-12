import { IMessage, TMergeFunction, TSendMessage } from "../Message";
import { BufferSubscription } from "./BufferSubscription";

export class MessageBuffer {
    private mergeMessage: TMergeFunction;
    private subscriptions: Set<BufferSubscription>;
    private messages: Map<number, IMessage>;

    constructor(merge: TMergeFunction) {
        this.mergeMessage = merge;
        this.subscriptions = new Set();
        this.messages = new Map();
    }

    public pushMessage(msg: IMessage) {
        if (this.messages.has(msg.id)) {
            console.log(`Message buffer -> update message ${msg.data}`)            
            const existMessage = this.messages.get(msg.id);
            this.mergeMessage(existMessage, msg)
        } else {
            console.log(`Message buffer -> add message ${msg.data}`)
            this.messages.set(msg.id, msg);
        }
        
        this.subscriptions.forEach(s => {
            s.onNewMessage(msg)
        })
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

    public getMessage = (key: number): IMessage => {        
        return this.messages.get(key)
    }
}