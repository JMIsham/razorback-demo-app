# razorback-demo-app

#### Update the correct paths for sabre-cli and po-cli binaries from constants.js

## Start the server

`npm install`

`npm run start`

## Create Purchase Order curl request
```
curl -X POST \
  http://localhost:5000/api/create-po \
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
  http://localhost:5000/api/ship-po \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"poNumber" : "po-v1-12"
}'
```
## View Purchase Order curl request
```
curl -X GET \
  'http://10.133.96.102:5001/api/po?po=po-v1-13' \
  -H 'cache-control: no-cache' 
  ```
