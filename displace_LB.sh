#!/bin/bash

#reroute frames going to lb back to GI2
curl -X POST -d '{
   	"dpid": 2,
    	"cookie": 0,
    	"table_id": 0,
    	"priority": 1111,
    	"flags": 1,
    	"match":{
		"nw_dst": "10.0.0.202",
        	"dl_type": 2048
    	},
   	"actions":[{"type": "SET_FIELD",
   	        "field": "ipv4_dst",
   	        "value": "10.0.0.217"},
		{"type":"OUTPUT",
		"port":"NORMAL"}
    ]
 }' http://localhost:8080/stats/flowentry/delete

# stop making frames from lb look like frames from GI2
curl -X POST -d '{
   	 "dpid": 2,
    	"cookie": 0,
    	"table_id": 0,
    	"priority": 1111,
    	"flags": 1,
    	"match":{
		"nw_src": "10.0.0.217",
        	"dl_type": 2048
    	},
   	"actions":[{"type": "SET_FIELD",
   	        "field": "ipv4_src",
   	        "value": "10.0.0.202"},
		{"type":"OUTPUT",
		"port":"NORMAL"}
    ]
 }' http://localhost:8080/stats/flowentry/delete

# delete rule letting lb talk to GI2 with changing ipsrc
curl -X POST -d '{
   	 "dpid": 2,
    	"cookie": 0,
    	"table_id": 0,
    	"priority": 2000,
    	"flags": 1,
    	"match":{
		"nw_src": "10.0.0.217",
		"nw_dst": "10.0.0.202",
        	"dl_type": 2048
    	},
   	"actions":[{"type":"OUTPUT",
		"port":"NORMAL"}
    ]
 }' http://localhost:8080/stats/flowentry/delete


#delete load_balancer
curl -X DELETE http://127.0.0.1:5001/restapi/compute/dc1/lb

#delete second gateway
curl -X DELETE http://127.0.0.1:5001/restapi/compute/dc1/GI2
