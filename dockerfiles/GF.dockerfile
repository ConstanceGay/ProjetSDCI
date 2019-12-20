FROM node:latest
RUN 	apt-get update && apt-get install -y \
      	net-tools \	
	tcpdump \
	&& npm install express \
	&& npm install yargs \
        && npm install systeminformation 

ENV VIM_EMU_CMD wget  	http://homepages.laas.fr/smedjiah/tmp/gateway.js \ 
		&& node gateway.js --local_ip "10.0.0.201" --local_port 8282 --local_name "gwf1" --remote_ip "10.0.0.202" --remote_port 8181 --remote_name "gwi"


ENV VIM_EMU_CMD_STOP "echo 'Stopping the container now.'"

CMD /bin/bash
