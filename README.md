# razorback-demo-app

#### Update the correct paths for sabre-cli and po-cli binaries in constants.js

## Start the server

`npm install`

`npm run start`

## Create Purchase Order curl request
```
curl -X POST \
  http://localhost:5000/api/sabre/create-po \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"poNumber" : "po-v1-12",
	"items" : [{
        "gtin" : "some_gtin",
        "quantityReceived" : 100
    },
    {
        "gtin" : "another_gtin",
        "quantityReceived" : 89
    }]
}'
```

## Ship Purhcase Order curl request

```
curl -X POST \
  http://localhost:5000/api/sabre/ship-po \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"poNumber" : "po-v1-12"
}'
```
## View a PO
```
curl -X GET \
  'http://127.0.0.1:5001/api/po?po=po-v1-12' \
  -H 'Postman-Token: 5dcedb7c-1f6c-4987-86c1-16c1024f5fa2' \
  -H 'cache-control: no-cache'
 
 ```
 
## Use Sawtooth/Splinter TP
Instead of `api/sabre` use `api/sawtooth` in order to use sawtooth/splinter client. Configure the proper url in the constants file to connect to the right endpoint.

