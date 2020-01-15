FROM node:latest

WORKDIR /
ADD . /

RUN 	apt-get update \
	&& apt-get install -y net-tools tcpdump \
	net-tools \	
	tcpdump \
	supervisor \
	&& npm install express \
	&& npm install request \
	&& npm install yargs \
        && npm install systeminformation \
	&& mv /usr/sbin/tcpdump /usr/bin/tcpdump \
	&& wget http://homepages.laas.fr/smedjiah/tmp/gateway.js \
	&& cat scriptJS/cpulat.js > /home/cpulat.js

ADD supervisord/supervisord_gateway.conf /etc/supervisor/conf.d/supervisord.conf

ENV	loc_ip="10.0.0.201"
ENV	loc_port="8282"
ENV	loc_name="GF1"
ENV	rem_ip="10.0.0.202"
ENV	rem_port="8181"
ENV	rem_name="GI"

ENTRYPOINT ["/usr/bin/supervisord"] ; tail -f /dev/null


