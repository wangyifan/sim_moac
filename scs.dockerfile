FROM ubuntu:18.04
LABEL MAINTAINER="Yifan Wang <yifan.wang@moac.io>"

ARG version=1.0.6

VOLUME /scs

# install editor
RUN apt-get update \
    && apt-get install -y vim-tiny \
    && apt-get install -y iputils-ping \
    && apt-get install lsof -y \
    && apt-get install net-tools -y \
    && apt-get install curl -y

# install moac-scs and moac ipfs-monkey
COPY bin/$version/scs/scsserver /usr/local/sbin/
COPY bin/$version/scs/userconfig.json /scs/userconfig.json

WORKDIR /scs
