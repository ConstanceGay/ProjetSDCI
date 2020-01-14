FROM node:latest

WORKDIR /
ADD . /

RUN 	apt-get update \
	&& apt-get install -y net-tools tcpdump \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
	&& npm install url \
	&& npm install http-forward \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& cat load_balancer.js > /home/load_balancer.js

ENV	loc_ip="10.0.0.216"
ENV	loc_port="8181"
ENV	loc_name="lb"

ENV	rem_ip1="10.0.0.203"
ENV	rem_port1="8080"
ENV	rem_name1="GI"

ENV	rem_ip2="10.0.0.203"
ENV	rem_port2="8080"
ENV	rem_name2="GI2"

ENTRYPOINT node load_balancer.js --local_ip $loc_ip --local_port $loc_port --local_name $loc_name --remote_ip1 $rem_ip1 --remote_port1 $rem_port1 --remote_name1 $rem_name1 --remote_ip2 $rem_ip2 --remote_port2 $rem_port2 --remote_name2 $rem_name2 ; tail -f /dev/null

