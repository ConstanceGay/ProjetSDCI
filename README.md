# Projet Software Defined Communication Infrastructure

Pierre Binet & Constance Gay  
5SDBD  
2019/2020 

Link to project presentation : [Click here](tiny.cc/Projet-SDCI)

## Repo details
- __Directory ___dockerfiles___ :__ javascript and dockerfile files to computer dockers that can be found on DockerHub at  [constancegay/projet_sdci](https://hub.docker.com/repository/docker/constancegay/projet_sdci)
  
- __Directory ___MAPE-K___ :__ java Maven project to implement Mape-k loop
- __File ___GCTRL.jar___ :__ jar output from MAPE-K
- __File ___script_docker.py___ :__ python script to deploy the system containing several dockers, switches and a datacenter
- __File ___reroute.sh___ :__  bash file containing traffic reroute flow rules
- __File ___deploy_GW.sh___ :__ bash file containing load balancer deployment REST request 
- __File ___deploy_LB.sh___ :__ bash file containing gateway deployment REST request
- __File ___displace_LB.sh___ :__ bash file containing REST requests to delete gateway & load balancer + delete generated flow rules
