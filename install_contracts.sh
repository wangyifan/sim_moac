#!/bin/bash
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'
echo -e "${GREEN} 1) Setup npm env: ${NC}"
npm install
echo -e "\n${GREEN} 2) Setup subchain contracts:\n ${NC}"
node

