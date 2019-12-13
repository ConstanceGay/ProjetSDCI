FROM node:latest
RUN   apt-get update && apt-get install -y \
      net-tools \
      && npm install express \
          && npm install yargs \
          && npm install systeminformation 

ENV VIM_EMU_CMD wget  http://homepages.laas.fr/smedjiah/tmp/gateway.js \
&& node gateway.js --local_ip "127.0.0.1" --local_port 8181 --local_name "gwi" --remote_ip "127.0.0.1" --remote_port 8080 --remote_name "srv"

ENV VIM_EMU_CMD_STOP "echo 'Stopping the container now.'"

CMD /bin/bash
