#!/bin/bash

#deploy second gateway
curl -X PUT http://127.0.0.1:5001/restapi/compute/dc1/GI2 -H 'Content-Type: application/json' -d '{"image":"constancegay/projet_sdci:gatewayD", "network":"(id=GI2-eth0,ip=10.0.0.216/24)"}'

