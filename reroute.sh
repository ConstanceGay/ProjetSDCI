#!/bin/bash

#reroute requests going to GI to load_balancer 
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
 }' http://localhost:8080/stats/flowentry/add

# make frames coming from load_balancer look like they're from GI
# so the ACK/SYN-ACK/ACK part of tcp works with the GFi
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
 }' http://localhost:8080/stats/flowentry/add

# allow frames coming from load_balancer to go to GI
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
 }' http://localhost:8080/stats/flowentry/add


