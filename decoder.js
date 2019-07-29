import fs from 'fs';
import protobuf from 'protocol-buffers';
import {
  Base64
} from 'js-base64';


const decode = (data) => {
  // eslint-disable-next-line no-undef
  const decoded = Base64.decode(data);
  const str = decoded;
  // eslint-disable-next-line no-buffer-constructor
  const buffer = new Buffer(str);
  const messages = protobuf(fs.readFileSync('./protos/po.proto'));
  const obj = messages.POList.decode(buffer);
  return obj
}

export default decode;
