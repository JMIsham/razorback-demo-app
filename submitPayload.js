import {createPoPayload, shipPoPayload} from './getPayload'
import { submitBatch } from './submitBatch';

export const submitCreatePO = (poNumber ,items ) => {
    let buf = createPoPayload(poNumber,items);
    return submitBatch(buf);
}

export const submitShipPO = (poNumber) => {
    let buf = shipPoPayload(poNumber);
    return submitBatch(buf);
}