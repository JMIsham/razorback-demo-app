import {
  createPoPayload,
  shipPoPayload
} from './getPayload';
import {
  submitBatch
} from './submitBatch';

export const submitCreatePO = (poNumber, items) => {
  const buf = createPoPayload(poNumber, items);
  return submitBatch(buf);
};

export const submitShipPO = poNumber => {
  const buf = shipPoPayload(poNumber);
  return submitBatch(buf);
};
