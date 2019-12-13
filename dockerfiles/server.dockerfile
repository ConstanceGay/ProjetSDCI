FROM node:latest
RUN   apt-get update && apt-get install -y \
      net-tools \
      && npm install express \
           && npm install yargs \
          && npm install systeminformation 

ENV VIM_EMU_CMD wget  http://homepages.laas.fr/smedjiah/tmp/server.js \
&& node server.js --local_ip "127.0.0.1" --local_port 8080 --local_name "srv"
ENV VIM_EMU_CMD_STOP "echo 'Stopping the container now.'"

CMD /bin/bash
