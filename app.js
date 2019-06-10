import express from 'express';
import bodyParser from 'body-parser';
import {createPoPayload, shipPayload} from './writePayload';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/api/po', (req, res) => {
    res.status(200).send({
      success: 'true',
      message: 'pos retrieved successfully',
      pos: "test"
    })
});

app.post('/api/create-po', (req, res) => {
    console.log(req.body.items);
    createPoPayload(req.body.poNumber, req.body.items)
    return res.status(201).send({
        success: 'true',
        message: 'po added successfully',
        data: req.body
    })

});

app.post('/api/ship-po', (req, res) => {
    console.log(req.body.poNumber);
    shipPayload(req.body.poNumber)
    return res.status(201).send({
        success: 'true',
        message: 'po added successfully',
        data: req.body
    })

});



const PORT = 5000;
  
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});


