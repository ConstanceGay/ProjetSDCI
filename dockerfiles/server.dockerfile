FROM node:latest

WORKDIR /
ADD . /

RUN	apt-get update && apt-get install -y \
      	net-tools \	
	tcpdump \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/server.js \
	&& cat cpulat.js > /home/cpulat.js

ENTRYPOINT node server.js --local_ip "10.0.0.203" --local_port 8080 --local_name "srv" && node cpulat.js --local_ip "10.0.0.203" --local_port 8080 --local_name "srv" --monitor_ip "10.0.0.204" --monitor_port 8383 --monitor_name "mon" ; tail -f /dev/null
