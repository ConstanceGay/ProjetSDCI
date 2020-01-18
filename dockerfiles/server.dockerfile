FROM node:latest

WORKDIR /

ADD . /

RUN	apt-get update && apt-get install -y \
      	net-tools \	
	tcpdump \
	supervisor \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/server.js

ENV	loc_ip="10.0.0.203"
ENV	loc_port="8080"
ENV	loc_name="srv"

ENTRYPOINT  node server.js --local_ip $loc_ip --local_port $loc_port --local_name $loc_name ; tail -f /dev/null
