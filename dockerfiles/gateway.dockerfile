FROM node:latest

WORKDIR /
ADD . /

RUN 	apt-get update \
	&& apt-get install -y net-tools tcpdump \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/gateway.js \
	&& cat cpulat.js > /home/cpulat.js

ENV	loc_ip="10.0.0.201"
ENV	loc_port="8282"
ENV	loc_name="GF1"
ENV	rem_ip="10.0.0.202"
ENV	rem_port="8181"
ENV	rem_name="GI"

ENTRYPOINT node cpulat.js --local_ip "10.0.0.202" --local_port 8181 --local_name "GI" --monitor_ip "10.0.0.204" --monitor_port 8383 --monitor_name "mon" ; tail -f /dev/null

#node gateway.js --local_ip $loc_ip --local_port $loc_port --local_name $loc_name --remote_ip $rem_ip --remote_port $rem_port --remote_name $rem_name 

