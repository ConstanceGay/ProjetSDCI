#!/bin/bash

#deploy load_balancer
curl -X PUT http://127.0.0.1:5001/restapi/compute/dc1/lb -H 'Content-Type: application/json' -d '{"image":"constancegay/projet_sdci:lb", "network":"(id=lb-eth0,ip=10.0.0.217/24)"}'

