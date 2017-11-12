import { IMessage, TMergeFunction, mergeMessages } from "../Message";
import { Client } from "./Client";
import { MessageBuffer } from "./MessageBuffer";

const msgBuffer: MessageBuffer = new MessageBuffer(mergeMessages);

const slowClient: Client = new Client("slow", 200, msgBuffer)
const fastClient: Client = new Client("fast", 100, msgBuffer)

let globalMessageId = 0;
function generateUniqueMassages(count: number, delay: number): Promise<void> {
    const i = globalMessageId + count;

    return new Promise((resolve, reject) => {
        (function generateNextMessage(delay: number) {
            setTimeout(() => {
                msgBuffer.pushMessage({
                    id: globalMessageId,
                    data: `Message #${globalMessageId}`
                })
        
                if (globalMessageId <= i) {
                    globalMessageId++;
                    generateNextMessage(delay);
                } else {
                    resolve();
                }
            }, delay);
        })(delay)
    })
}

generateUniqueMassages(20, 100);
