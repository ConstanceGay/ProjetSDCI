FROM node:latest

WORKDIR /
ADD . /

RUN 	apt-get update \
	&& apt-get install -y net-tools tcpdump \
	net-tools \	
	tcpdump \
	supervisor \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/gateway.js

ENV	loc_ip="10.0.0.202"
ENV	loc_port="8181"
ENV	loc_name="GI"
ENV	rem_ip="10.0.0.203"
ENV	rem_port="8080"
ENV	rem_name="srv"

ENTRYPOINT node gateway.js --local_ip $loc_ip --local_port $loc_port --local_name $loc_name --remote_ip $rem_ip --remote_port $rem_port --remote_name $rem_name ; tail -f /dev/null


