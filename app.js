/* eslint-disable no-console */
import express from 'express';
import bodyParser from 'body-parser';
import Promise from 'promise';
import axios from 'axios';
import {
  sha512
} from 'js-sha512';
import request from 'request';
import cors from 'cors';
import {
  writeCreatePoPayload,
  writeShipPayload
} from './writePayload';
import {
  submitCreatePO,
  submitShipPO
} from './submitPayload';
import {
  SABRE_CLI_API,
  SAWTOOTH_REST_API,
  APPLICATION_PORT
} from './constants';
import decode from './decoder'

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(cors());

app.get('/api/po', (req, res) => {
  const {
    po
  } = req.query;
  const address = `000008${sha512(po).substring(0, 64)}`;
  axios
    .get(`${SAWTOOTH_REST_API}/state/${address}`)
    .then(response => {
      const {
        data
      } = response.data;
      const obj = decode(data)
      console.log(obj.purchaseOrders[0]);
      res.status(200).send(obj);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.get('/api/allpo', (req, res) => {
  axios
    .get(`${SAWTOOTH_REST_API}/state`)
    .then(response => {
      const {
        data
      } = response.data;
      const poList = [];
      data.forEach(state => {
        if (state.address.substring(0, 6) === '000008') {
          const po = decode(state.data);
          console.log(po)
          poList.push({
            poNumber: po.purchaseOrders[0].poNumber,
            dateShipped: po.purchaseOrders[0].dateShipped
          })
        }
      });
      console.log(poList);
      res.status(200).send(poList);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.post('/api/sabre/create-po', (req, res) => {
  console.log(req.body.items);
  writeCreatePoPayload(req.body.poNumber, req.body.items);
  // eslint-disable-next-line no-use-before-define
  sabreExec().then(
    response => {
      res.status(200).send(response);
    },
    error => {
      res.status(500).send(error);
    },
  );
});

app.post('/api/sabre/ship-po', (req, res) => {
  console.log(req.body.poNumber);
  writeShipPayload(req.body.poNumber);
  // eslint-disable-next-line no-use-before-define
  sabreExec().then(
    response => {
      res.status(200).send(response);
    },
    error => {
      res.status(500).send(error);
    },
  );
});

app.post('/api/sawtooth/create-po', (req, res) => {
  console.log(req.body.items);
  submitCreatePO(req.body.poNumber, req.body.items).then(
    response => {
      res.status(200).send(response);
    },
    error => {
      res.status(500).send(error);
    },
  );
});

app.post('/api/sawtooth/ship-po', (req, res) => {
  console.log(req.body.poNumber);
  submitShipPO(req.body.poNumber).then(
    response => {
      res.status(200).send(response);
    },
    error => {
      res.status(500).send(error);
    },
  );
});

const PORT = APPLICATION_PORT;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

function sabreExec() {
  const options = {
    method: 'POST',
    url: `${SABRE_CLI_API}/sabre/exec`,
    headers: {
      'postman-token': '09f85679-20c5-d410-e6a9-e006f78b667b',
      'cache-control': 'no-cache',
      'content-type': 'application/json',
    },
    body: {
      contract: 'purchase-order:1.0',
      inputs: '000008',
      outputs: '000008',
    },
    json: true,
  };
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) reject(error);
      resolve(body);
    });
  });
}
