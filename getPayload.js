import protobuf from 'protocol-buffers';
import fs from 'fs';


export const createPoPayload = (poNumber, items) => {
  const messages = protobuf(fs.readFileSync('./protos/payload.proto'))
  const today = new Date().toISOString().slice(0, 10)
  const buf = messages.POPayload.encode({
    action: messages.POPayload.Action.CREATE_PO,
    create_po: {
      poNumber,
      orderDate: today,
      items
    }
  })
  console.log(buf)
  return buf;
}

export const shipPoPayload = (poNumber) => {
  const messages = protobuf(fs.readFileSync('./protos/payload.proto'))
  const today = new Date().toISOString().slice(0, 10)
  const buf = messages.POPayload.encode({
    action: messages.POPayload.Action.SHIP_PO,
    ship_po: {
      poNumber,
      date: today,
    }
  })
  console.log(buf);
  return buf;
}
