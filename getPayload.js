import  protobuf from 'protocol-buffers';
import  fs  from 'fs';


export const createPoPayload = (poNumber ,items ) => {
    var messages = protobuf(fs.readFileSync('./protos/payload.proto'))
    let today = new Date().toISOString().slice(0, 10)
    var buf = messages.POPayload.encode({
        action : messages.POPayload.Action.CREATE_PO,
        create_po : {
            poNumber : poNumber,
            orderDate :today,
            items : items
        }
    })
    console.log(buf)
    return buf;
}

export const shipPoPayload = (poNumber) => {
    var messages = protobuf(fs.readFileSync('./protos/payload.proto'))
    let today = new Date().toISOString().slice(0, 10)
    var buf = messages.POPayload.encode({
        action : messages.POPayload.Action.SHIP_PO,
        ship_po : {
            poNumber : poNumber,
            date :today,
        }
    })
    console.log(buf);
    return buf;
}

