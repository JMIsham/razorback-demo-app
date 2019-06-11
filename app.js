import express from 'express';
import bodyParser from 'body-parser';
import {createPoPayload, shipPayload} from './writePayload';
import { exec } from 'child_process';
import Promise from 'promise';
import axios from 'axios';
import {PO_CLI, SABRE_CLI} from './constants'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/po', (req, res) => {
    const command = PO_CLI+" po show "+req.query.po
    exec(command, (err, stdout, stderr) => {
        if (stdout) {
            res.status(200).send({
                success: 'true',
                message: 'pos retrieved successfully',
                pos: stdout
            })           
        }
        if (stderr) {
            res.status(500).send({
                success: 'true',
                message: 'pos retrieved failed',
                pos: stderr
            })    
        }
        if (err) {
            res.status(500).send({
                success: 'true',
                message: 'pos retrieved failed',
                pos: err
            })  
        }
    });
});

app.post('/api/create-po', (req, res) => {
    console.log(req.body.items);
    createPoPayload(req.body.poNumber, req.body.items)
    const command = SABRE_CLI+` exec --contract purchase-order:1.0 --payload payload --inputs  000008 --outputs  000008 --url http://127.0.0.1:8008`
    execute(command).then((link) => {
        axios.get(link).then((response) => {
            res.status(200).send(response.data);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
});

app.post('/api/ship-po', (req, res) => {
    console.log(req.body.poNumber);
    shipPayload(req.body.poNumber)
    const command = SABRE_CLI+` exec --contract purchase-order:1.0 --payload payload --inputs  000008 --outputs  000008 --url http://127.0.0.1:8008`
    execute(command).then((link) => {
        axios.get(link).then((response) => {
            res.status(200).send(response.data);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }).catch((error) => {
        res.status(500).send(error);
    });
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
                    reject("Not a correct Response");
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