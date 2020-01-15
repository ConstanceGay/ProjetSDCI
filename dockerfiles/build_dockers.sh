#!/bin/sh
sudo docker build -t constancegay/projet_sdci:gatewayD -f gatewayD.dockerfile .
sudo docker build -t constancegay/projet_sdci:lb -f load_balancer.dockerfile .
sudo docker build -t constancegay/projet_sdci:mon -f vnfmonitor.dockerfile .
sudo docker build -t constancegay/projet_sdci:gateway -f gateway.dockerfile .
sudo docker build -t constancegay/projet_sdci:dev -f device.dockerfile .
sudo docker build -t constancegay/projet_sdci:server -f server.dockerfile .

sudo docker push constancegay/projet_sdci:gatewayD
sudo docker push constancegay/projet_sdci:lb
sudo docker push constancegay/projet_sdci:mon
sudo docker push constancegay/projet_sdci:gateway
sudo docker push constancegay/projet_sdci:dev
sudo docker push constancegay/projet_sdci:server
