import express from 'express';
import bodyParser from 'body-parser';
import {createPoPayload, shipPayload} from './writePayload';
import { exec } from 'child_process';
import Promise from 'promise';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/po', (req, res) => {
    const command = "xo create game --username jack --url http://rest-api:8008"
    //to do: extract poNumber from request.
    //const poNumber = req.***;
    //const command = `po-cli po show ${poNumber}`;
    execute(command).then((link) => {
        axios.get(link).then((response) => {
            res.status(200).send(response.data);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
    // res.status(200).send({
    //   success: 'true',
    //   message: 'pos retrieved successfully',
    //   pos: "test"
    // })
});

app.post('/api/create-po', (req, res) => {
    console.log(req.body.items);
    createPoPayload(req.body.poNumber, req.body.items)
    const command = `~/sabre-cli/sabre exec --contract purchase-order:1.0 --payload payload --inputs  000008 --outputs  000008 --url http://127.0.0.1:8008`
    execute(command).then((resolve) => {

    });
    // return res.status(201).send({
    //     success: 'true',
    //     message: 'po added successfully',
    //     data: req.body
    // })

});

app.post('/api/ship-po', (req, res) => {
    console.log(req.body.poNumber);
    shipPayload(req.body.poNumber)
    const command = `~/sabre-cli/sabre exec --contract purchase-order:1.0 --payload payload --inputs  000008 --outputs  000008 --url http://127.0.0.1:8008`
    execute(command).then((resolve) => {

    });
    // return res.status(201).send({
    //     success: 'true',
    //     message: 'po added successfully',
    //     data: req.body
    // })

});

const PORT = 5000;
  
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
                    console.log("responseLink", responseLink);
                    resolve(responseLink);
                } else {
                    reject("Not a correct Response");
                }
            }
            if (err) {
                console.log("err", err);
                reject(err);
            }
            if (stderr) {
                console.log("stderr", stderr);
                reject(stderr);
            }
        });
    });
}

function extractLink(str) {
    const regex = /\"http(.*?)\"/;
    if (str && str.length !== 0) {
        return 'http'+str.match(regex)[1];
    }
    return null;
}