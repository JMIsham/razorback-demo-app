import {CryptoFactory, createContext} from 'sawtooth-sdk/signing';
import {createHash} from 'crypto';
import {protobuf} from 'sawtooth-sdk';
import request from 'request';
import {SAWTOOTH_REST_API} from './constants';

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()
const cryptoFactory = new CryptoFactory(context)
const signer = cryptoFactory.newSigner(privateKey)


export const submitBatch = (payloadBytes) => {
    //create transaction header
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: 'purchase-order',
        familyVersion: '0.1',
        inputs: ['000008'],
        outputs: ['000008'],
        signerPublicKey: signer.getPublicKey().asHex(),
        batcherPublicKey: signer.getPublicKey().asHex(),
        dependencies: [],
        payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
    }).finish()


    //create transaction
    const signature = signer.sign(transactionHeaderBytes)

    const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes
    })

    // create batcHeader
    const transactions = [transaction]

    const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()


    //create batch
    const signature2 = signer.sign(batchHeaderBytes)

    const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: signature2,
        transactions: transactions
    })

    //Encode the Batch(es) in a BatchList
    const batchListBytes = protobuf.BatchList.encode({
        batches: [batch]
    }).finish()
    console.log(batchListBytes);

    return new Promise(function(resolve, reject){
        request.post({
            url: SAWTOOTH_REST_API+'/batches',
            body: batchListBytes,
            headers: {'Content-Type': 'application/octet-stream'}
        }, (err, response) => {
            if (err) reject(err);
            resolve(response.body);
        })
    })
}

