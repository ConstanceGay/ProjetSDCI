FROM node:latest
RUN 	apt-get update && apt-get install -y \
      	net-tools \
	&& npm install express \
	&& npm install yargs \
        && npm install systeminformation 

ENV VIM_EMU_CMD wget  	http://homepages.laas.fr/smedjiah/tmp/gateway.js \  
 			&& wget  http://homepages.laas.fr/smedjiah/tmp/device.js \
&& node device.js --local_ip "10.0.0.201" --local_port 9001 --local_name "dev1" --remote_ip "10.0.0.201" --remote_port 8282 --remote_name "gwf1" --send_period 3000 \
     && node device.js --local_ip "10.0.0.201" --local_port 9002 --local_name "dev2" --remote_ip "10.0.0.201" --remote_port 8282 --remote_name "gwf1" --send_period 3000 \
     && node device.js --local_ip "10.0.0.201" --local_port 9003 --local_name "dev3" --remote_ip "10.0.0.201" --remote_port 8282 --remote_name "gwf1" --send_period 3000 \
     && node gateway.js --local_ip "10.0.0.201" --local_port 8282 --local_name "gwf1" --remote_ip "10.0.0.202" --remote_port 8181 --remote_name "gwi"


ENV VIM_EMU_CMD_STOP "echo 'Stopping the container now.'"

CMD /bin/bash
