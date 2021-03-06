# Copyright (c) 2015 SONATA-NFV and Paderborn University
# ALL RIGHTS RESERVED.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
# Neither the name of the SONATA-NFV, Paderborn University
# nor the names of its contributors may be used to endorse or promote
# products derived from this software without specific prior written
# permission.
#
# This work has been performed in the framework of the SONATA project,
# funded by the European Commission under Grant number 671517 through
# the Horizon 2020 and 5G-PPP programmes. The authors would like to
# acknowledge the contributions of their colleagues of the SONATA
# partner consortium (www.sonata-nfv.eu).
import logging
import time
from mininet.log import setLogLevel
from mininet.net import Containernet
from mininet.node import Controller
from mininet.cli import CLI
from mininet.link import TCLink
from mininet.log import info, setLogLevel
from emuvim.dcemulator.net import DCNetwork
from emuvim.api.rest.rest_api_endpoint import RestApiEndpoint
from emuvim.api.openstack.openstack_api_endpoint import OpenstackApiEndpoint

logging.basicConfig(level=logging.INFO)
setLogLevel('info')  # set Mininet loglevel
logging.getLogger('werkzeug').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.base').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.compute').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.keystone').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.nova').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.neutron').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.heat').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.heat.parser').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.glance').setLevel(logging.DEBUG)
logging.getLogger('api.openstack.helper').setLevel(logging.DEBUG)

setLogLevel('info')


def create_topology():
    net = DCNetwork(monitor=False, enable_learning=True)

    dc1 = net.addDatacenter("dc1")
    # add OpenStack-like APIs to the emulated DC
    api1 = OpenstackApiEndpoint("0.0.0.0", 6001)
    api1.connect_datacenter(dc1)
    api1.start()
    api1.connect_dc_network(net)
    # add the command line interface endpoint to the emulated DC (REST API)
    rapi1 = RestApiEndpoint("0.0.0.0", 5001)
    rapi1.connectDCNetwork(net)
    rapi1.connectDatacenter(dc1)
    rapi1.start()

    info('*** Adding docker containers\n')
    srv = net.addDocker('srv', ip='10.0.0.203', dimage="constancegay/projet_sdci:server")

    time.sleep(5)
    GI = net.addDocker('GI', ip='10.0.0.202', dimage="constancegay/projet_sdci:gateway",
                       environment={"loc_ip": "10.0.0.202",
                                    "loc_port": "8181",
                                    "loc_name": "GI",
                                    "rem_ip": "10.0.0.203",
                                    "rem_port": "8080",
                                    "rem_name": "srv"})
    time.sleep(5)

    mon = net.addDocker('mon', ip='10.0.0.204', dimage="constancegay/projet_sdci:mon")

    # GFs
    gf1 = net.addDocker('GF1', ip='10.0.0.201', dimage="constancegay/projet_sdci:gateway",
                        environment={"loc_ip": "10.0.0.201",
                                     "loc_port": "8282",
                                     "loc_name": "GF1",
                                     "rem_ip": "10.0.0.202",
                                     "rem_port": "8181",
                                     "rem_name": "GI"})

    gf2 = net.addDocker('GF2', ip='10.0.0.208', dimage="constancegay/projet_sdci:gateway",
                        environment={"loc_ip": "10.0.0.208",
                        "loc_port": "9004",
                        "loc_name": "GF2",
                        "rem_ip": "10.0.0.202",
                        "rem_port": "8181",
                        "rem_name": "GI"})

    gf3 = net.addDocker('GF3', ip='10.0.0.212', dimage="constancegay/projet_sdci:gateway",
                        environment={"loc_ip": "10.0.0.212",
                        "loc_port": "9008",
                        "loc_name": "GF3",
                        "rem_ip": "10.0.0.202",
                        "rem_port": "8181",
                        "rem_name": "GI"})


    time.sleep(5)
    # ZONE 1 devices
    dev1 = net.addDocker('dev1', ip='10.0.0.205', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.205",
                                      "loc_port": "9001",
                                      "loc_name": "dev1",
                                      "rem_ip": "10.0.0.201",
                                      "rem_port": "8282",
                                      "rem_name": "GF1"})
    dev2 = net.addDocker('dev2', ip='10.0.0.206', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.206",
                                      "loc_port": "9002",
                                      "loc_name": "dev2",
                                      "rem_ip": "10.0.0.201",
                                      "rem_port": "8282",
                                      "rem_name": "GF1"})
    dev3 = net.addDocker('dev3', ip='10.0.0.207', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.207",
                                      "loc_port": "9003",
                                      "loc_name": "dev3",
                                      "rem_ip": "10.0.0.201",
                                      "rem_port": "8282",
                                      "rem_name": "GF1"})

    # ZONE 2 devices
    dev4 = net.addDocker('dev4', ip='10.0.0.209', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.209",
                                      "loc_port": "9005",
                                      "loc_name": "dev4",
                                      "rem_ip": "10.0.0.208",
                                      "rem_port": "9004",
                                      "rem_name": "GF2"})
    dev5 = net.addDocker('dev5', ip='10.0.0.210', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.210",
                                      "loc_port": "9006",
                                      "loc_name": "dev5",
                                      "rem_ip": "10.0.0.208",
                                      "rem_port": "9004",
                                      "rem_name": "GF2"})
    dev6 = net.addDocker('dev6', ip='10.0.0.211', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.211",
                                      "loc_port": "9007",
                                      "loc_name": "dev6",
                                      "rem_ip": "10.0.0.208",
                                      "rem_port": "9004",
                                      "rem_name": "GF2"})

    # ZONE 3 devices
    dev7 = net.addDocker('dev7', ip='10.0.0.213', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.213",
                                      "loc_port": "9009",
                                      "loc_name": "dev7",
                                      "rem_ip": "10.0.0.212",
                                      "rem_port": "9008",
                                      "rem_name": "GF3"})
    dev8 = net.addDocker('dev8', ip='10.0.0.214', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.214",
                                      "loc_port": "9010",
                                      "loc_name": "dev8",
                                      "rem_ip": "10.0.0.212",
                                      "rem_port": "9008",
                                      "rem_name": "GF3"})
    dev9 = net.addDocker('dev9', ip='10.0.0.215', dimage="constancegay/projet_sdci:dev",
                         environment={"loc_ip": "10.0.0.215",
                                      "loc_port": "9011",
                                      "loc_name": "dev9",
                                      "rem_ip": "10.0.0.212",
                                      "rem_port": "9008",
                                      "rem_name": "GF3"})


    info('*** Adding switches\n')
    s1 = net.addSwitch('s1')
    s2 = net.addSwitch('s2')
    s3 = net.addSwitch('s3')
    s4 = net.addSwitch('s4')
    s5 = net.addSwitch('s5')

    info('*** Creating links\n')
    net.addLink(s1, srv)
    net.addLink(s1, GI)
    net.addLink(s1, mon)

    net.addLink(s2, s1)
    net.addLink(s2, dc1)

    net.addLink(s3, s2)
    net.addLink(s4, s2)
    net.addLink(s5, s2)

    # ZONE 1
    net.addLink(s3, gf1)
    net.addLink(s3, dev1)
    net.addLink(s3, dev2)
    net.addLink(s3, dev3)

    # ZONE 2
    net.addLink(s4, gf2)
    net.addLink(s4, dev4)
    net.addLink(s4, dev5)
    net.addLink(s4, dev6)

    # ZONE 3
    net.addLink(s5, gf3)
    net.addLink(s5, dev7)
    net.addLink(s5, dev8)
    net.addLink(s5, dev9)


    info('*** Starting network\n')
    net.start()
    info('*** Testing connectivity\n')
    net.ping([srv, dev1])
    info('*** Running CLI\n')
    CLI(net)
    info('*** Stopping network')
    net.stop()


def main():
    create_topology()


if __name__ == '__main__':
    main()
