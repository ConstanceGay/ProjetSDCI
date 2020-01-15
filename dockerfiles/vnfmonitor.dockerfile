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
	&& cat scriptJS/monitor.js > /home/monitor.js

ENTRYPOINT node monitor.js --local_ip "10.0.0.204" --local_port 8383 --local_name "mon" --srv_ip "10.0.0.203" --srv_port 8080 --srv_cpu_port 8081 --srv_name "srv" --gi_ip "10.0.0.202" --gi_port 8181 --gi_cpu_port 8182 --gi_name "GI" ; tail -f /dev/null
