FROM node:latest

RUN 	apt-get update && apt-get install -y \
      	net-tools \	
	tcpdump \
	&& npm install express \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/gateway.js 

ENTRYPOINT node gateway.js --local_ip "10.0.0.201" --local_port 8282 --local_name "GF" --remote_ip "10.0.0.202" --remote_port 8181 --remote_name "GI" ; tail -f /dev/null

