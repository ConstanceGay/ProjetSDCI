FROM node:latest

RUN 	apt-get update && apt-get install -y \
      	net-tools \	
	tcpdump \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/device.js 

ENTRYPOINT  node device.js --local_ip "10.0.0.205" --local_port 9001 --local_name "dev1" --remote_ip "10.0.0.201" --remote_port 8282 --remote_name "GF" --send_period 3000 ; tail -f /dev/null
