#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
echo -e "${GREEN} 1) Setup npm env: ${NC}" \
&& npm install \
&& echo -e "\n${GREEN} 2) Deploy subchain contracts:\n ${NC}" \
&& node deploy_contracts.js \
&& echo -e "${GREEN}" \
&& echo -e "---------------------------------" \
&& echo -e "" \
&& echo -e "Subchain is ready!" \
&& echo -e "vnode rpc: http://localhost:52159" \
&& echo -e "scs 1 rpc: http://localhost:52160" \
&& echo -e "scs 2 rpc: http://localhost:52161" \
&& echo -e "scs 3 rpc: http://localhost:52162" \
&& echo -e "scs monitor rpc: http://localhost:52163" \
&& echo -e "Have Fun! ${NC}"
