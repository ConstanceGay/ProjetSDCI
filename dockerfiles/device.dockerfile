FROM node:latest

RUN 	apt-get update \
	&& apt-get install -y net-tools tcpdump \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/device.js

ENV	loc_ip="10.0.0.204"
ENV	loc_port="9001"
ENV	loc_name="dev1"
ENV	rem_ip="10.0.0.201"
ENV	rem_port="8282"
ENV	rem_name="GF1"

ENTRYPOINT  node device.js --local_ip $loc_ip --local_port $loc_port --local_name $loc_name --remote_ip $rem_ip --remote_port $rem_port --remote_name $rem_name --send_period 3000 ; tail -f /dev/null

