import express from 'express';
import bodyParser from 'body-parser';
import {createPoPayload, shipPayload} from './writePayload';
import { exec } from 'child_process';
import Promise from 'promise';
import axios from 'axios';
import {PO_CLI, SABRE_CLI, EXEC_COMMAND} from './constants'
import fs from 'fs';
import {sha512}from 'js-sha512';
import protobuf from 'protocol-buffers';
import {Base64} from 'js-base64'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/po', (req, res) => {
    var po = req.query.po;
    var address = "000008" + sha512(po).substring(0,64)
    axios.get("http://127.0.0.1:8008/state/"+address).then((response) => {

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
        res.status(500).send(error);
    });

    
});

app.post('/api/create-po', (req, res) => {
    console.log(req.body.items);
    createPoPayload(req.body.poNumber, req.body.items)
    // const command = SABRE_CLI+EXEC_COMMAND
    // execute(command).then((link) => {
    //     axios.get(link).then((response) => {
    //         res.status(200).send(response.data);
    //     }).catch((err) => {
    //         res.status(500).send(err);
    //     });
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
    res.status(200).send("payload created");
});

app.post('/api/ship-po', (req, res) => {
    console.log(req.body.poNumber);
    shipPayload(req.body.poNumber)
    // const command = SABRE_CLI+EXEC_COMMAND
    // execute(command).then((link) => {
    //     axios.get(link).then((response) => {
    //         res.status(200).send(response.data);
    //     }).catch((err) => {
    //         res.status(500).send(err);
    //     });
    // }).catch((error) => {
    //     res.status(500).send(error);
    // });
    res.status(200).send("payload created");
});

const PORT = 5001;
  
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

/**
 * run the command line and return a promise that includes the status link
 * @param {*} command command line to be executed
 */
function execute(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (stdout) {
                // let response = null;
                let responseLink = extractLink(stdout);
                if (responseLink != null) {
                    resolve(responseLink);
                } else {
                    reject("Did not get a link from sawtooth-rest-api");
                }
            }
            if (stderr) {
                console.log("stderr", stderr);
                reject(stderr);
            }
            if (err) {
                console.log("err", err);
                reject(err);
            }
        });
    });
}

/**
 * extract http link from the given string
 * @param {*} str 
 */
function extractLink(str) {
    const regex = /\"http(.*?)\"/;
    if (str && str.length !== 0) {
        return 'http'+str.match(regex)[1];
    }
    return null;
}