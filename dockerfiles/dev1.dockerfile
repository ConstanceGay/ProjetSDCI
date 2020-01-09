FROM node:latest

RUN 	apt-get update && apt-get install -y \
      	net-tools \	
	tcpdump \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget  http://homepages.laas.fr/smedjiah/tmp/device.js 

RUN	node device.js --local_ip "10.0.0.204" --local_port 9001 --local_name "dev1" --remote_ip "10.0.0.201" --remote_port 8282 --remote_name "gwf1" --send_period 3000 &

ENV VIM_EMU_CMD "echo 'Starting container'"


ENV VIM_EMU_CMD_STOP "echo 'Stopping the container now.'"

CMD /bin/bash
