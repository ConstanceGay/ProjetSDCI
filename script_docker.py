#!/usr/bin/python
"""
This is the most simple example to showcase Containernet.
"""
from mininet.net import Containernet
from mininet.node import Controller
from mininet.cli import CLI
from mininet.link import TCLink
from mininet.log import info, setLogLevel
setLogLevel('info')

net = Containernet(controller=Controller)
info('*** Adding controller\n')
net.addController('c0')

info('*** Adding docker containers\n')
GF = net.addDocker('dockerGF', ip='10.0.0.201', dimage="constancegay/projet_sdci:zone")
GI = net.addDocker('dockerGI', ip='10.0.0.202', dimage="constancegay/projet_sdci:GI")
Server = net.addDocker('dockerServer', ip='10.0.0.203', dimage="constancegay/projet_sdci:server")

info('*** Adding switches\n')
s1 = net.addSwitch('s1')
s2 = net.addSwitch('s2')

info('*** Creating links\n')
net.addLink(Server, s1)
net.addLink(s1, GI)
net.addLink(GI, s2)
net.addLink(s2, GF)

info('*** Starting network\n')
net.start()
info('*** Testing connectivity\n')
net.ping([Server, GF])
info('*** Running CLI\n')
CLI(net)
info('*** Stopping network')
net.stop()

