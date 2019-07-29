import protobuf from 'protocol-buffers';
import fs from 'fs';
import {
  submitBatch
} from './submitBatch';


const messages = protobuf(fs.readFileSync('./protos/payload.proto'));
const today = new Date().toISOString().slice(0, 10);
const buf = messages.POPayload.encode({
  action: messages.POPayload.Action.CREATE_PO,
  create_po: {
    poNumber: '12',
    orderDate: today,
    items: [],
  },
});
console.log(buf);
submitBatch(buf);
