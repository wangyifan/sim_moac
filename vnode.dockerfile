FROM ubuntu:18.04
MAINTAINER Yifan Wang <yifan.wang@moac.io>

ARG version=1.0.6

RUN mkdir /vnode

# install editor
#RUN apt-get update \
#    && apt-get install -y vim-tiny \
#    && apt-get install -y iputils-ping \
#    && apt-get install lsof -y \
#    && apt-get install net-tools -y \
#    && apt-get install curl -y

# install moac-vnode
COPY bin/$version/vnode/moac /usr/local/sbin/
COPY bin/$version/vnode/vnodeconfig.json /vnode/vnodeconfig.json
COPY config/vnode.genesis.json /vnode/genesis.json

WORKDIR /vnode

RUN moac init genesis.json --datadir=/vnode \
        && echo "123456" > password \
        && echo "393873d6bbc61b9d83ba923e08375b7bf8210a12bed4ea2016d96021e9378cc9" > pk \
        && moac account import pk --datadir=/vnode --password password \
        && rm password pk

VOLUME /vnode

# moac --networkid 95125 --vnodeconfig vnodeconfig.json --datadir=/vnode --ethash.dagdir /vnode/.ethash  --verbosity 3 --rpc --rpccorsdomain "http://wallet.moac.io" --mine --minerthreads 1 --rpcapi "chain3,mc,net,vnode,personal" --ipcpath=/root/.moac/moac.ipc 2>&1

# rpc port
EXPOSE 8545
EXPOSE 50062

