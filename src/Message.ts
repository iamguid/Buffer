export type TMergeFunction = (a: IMessage, b: IMessage) => IMessage;
export type TSendMessage = (msg: IMessage) => Promise<void>;

export interface IMessage {
    id: number;
    data: string;
}


export function mergeMessages(a: IMessage, b: IMessage): IMessage {
    if (a.id !== b.id) {
        throw new Error("Invalid message id")
    }

    return {
        id: b.id,
        data: b.data,
    }
}
