FROM node:latest

WORKDIR /
ADD . /

RUN	apt-get update && apt-get install -y \
      	net-tools \	
	tcpdump \
	supervisor \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/server.js \
	&& cat scriptJS/cpulat.js > /home/cpulat.js

ADD supervisord/supervisord_server.conf /etc/supervisor/conf.d/supervisord.conf

ENTRYPOINT  ["/usr/bin/supervisord"] ; tail -f /dev/null
