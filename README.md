# razorback-demo-app
`npm install`

`npm run start`

## Create po curl request
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

## Ship Po curl request

```
curl -X POST \
  http://localhost:5000/api/ship-po \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -d '{
	"poNumber" : "po-v1-12"
}'
```

