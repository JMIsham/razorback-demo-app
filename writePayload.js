import  fs  from 'fs';
import {PAYLOAD_PATH} from './constants'
import {createPoPayload, shipPoPayload} from './getPayload'



export const writeCreatePoPayload = (poNumber ,items ) => {
    let buf = createPoPayload(poNumber, items);
    fs.writeFileSync(PAYLOAD_PATH, buf);
}

export const writeShipPayload = (poNumber) => {
    let buf = shipPoPayload(poNumber);
    fs.writeFileSync(PAYLOAD_PATH, buf);
}
