FROM node:latest
RUN	apt-get update && apt-get install -y \
   	net-tools \
	tcpdump \
   	&& npm install express \
        && npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget  http://homepages.laas.fr/smedjiah/tmp/server.js 

ENTRYPOINT node server.js --local_ip "10.0.0.203" --local_port 8080 --local_name "srv" ; tail -f /dev/null
