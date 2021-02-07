#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
echo -e "${GREEN} 1) Setup npm env: ${NC}" \
&& npm install \
&& echo -e "\n${GREEN} 2) Deploy subchain contracts:\n ${NC}" \
&& node deploy_contracts_rng.js \
&& echo -e "${GREEN}" \
&& echo -e "---------------------------------" \
&& echo -e "" \
&& echo -e "Subchain is ready!" \
&& echo -e "vnode rpc: http://172.20.0.11:8545" \
&& echo -e "scs 1 rpc: http://172.20.0.21:12345" \
&& echo -e "scs 2 rpc: http://172.20.0.22:12345" \
&& echo -e "scs 3 rpc: http://172.20.0.23:12345" \
&& echo -e "scs monitor rpc: http://172.20.0.27:12345" \

