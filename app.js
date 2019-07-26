import express from 'express';
import bodyParser from 'body-parser';
import {writeCreatePoPayload, writeShipPayload} from './writePayload';
import {submitCreatePO, submitShipPO} from './submitPayload'
import Promise from 'promise';
import axios from 'axios';
import fs from 'fs';
import {sha512}from 'js-sha512';
import protobuf from 'protocol-buffers';
import {Base64} from 'js-base64'
import request from 'request';
import {SABRE_CLI_API, SAWTOOTH_REST_API, APPLICATION_PORT} from './constants'
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors())

app.get('/api/po', (req, res) => {
    var po = req.query.po;
    var address = "000008" + sha512(po).substring(0,64)
    axios.get(SAWTOOTH_REST_API+"/state/"+address).then((response) => {
        var data = response.data.data
        var decoded = Base64.decode(data)
        var str = decoded;
        var buffer = new Buffer(str);
        console.log(buffer)
        var messages = protobuf(fs.readFileSync('./protos/po.proto'));
        var obj = messages.POList.decode(buffer)
        console.log(obj.purchaseOrders[0])
        res.status(200).send(obj);

    }).catch((err) => {
        res.status(500).send(err);
    });

    
});

app.post('/api/sabre/create-po', (req, res) => {
    console.log(req.body.items);
    writeCreatePoPayload(req.body.poNumber, req.body.items)
    sabreExec().then(function( response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(500).send(error);
    })
});

app.post('/api/sabre/ship-po', (req, res) => {
    console.log(req.body.poNumber);
    writeShipPayload(req.body.poNumber)
    sabreExec().then(function( response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(500).send(error);
    })
    
});

app.post('/api/sawtooth/create-po', (req, res) => {
    console.log(req.body.items);
    submitCreatePO(req.body.poNumber, req.body.items)
    .then(function( response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(500).send(error);
    })
});

app.post('/api/sawtooth/ship-po', (req, res) => {
    console.log(req.body.poNumber);
    submitShipPO(req.body.poNumber)
    .then(function( response) {
        res.status(200).send(response);
    }, function (error) {
        res.status(500).send(error);
    })
    
});

const PORT = APPLICATION_PORT;
  
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

function sabreExec () {
    var options = { method: 'POST',
    url: SABRE_CLI_API + '/sabre/exec',
    headers: 
    { 'postman-token': '09f85679-20c5-d410-e6a9-e006f78b667b',
        'cache-control': 'no-cache',
        'content-type': 'application/json' },
    body: 
    { contract: 'purchase-order:1.0',
        inputs: '000008',
        outputs: '000008' },
    json: true };
    return new Promise(function(resolve, reject){
        request(options, function (error, response, body) {
            if (error) reject(error);
            resolve(body);
        });
    })
}