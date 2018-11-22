FROM ubuntu:18.04
LABEL MAINTAINER="Yifan Wang <heavenstar@gmail.com>"

RUN apt-get update \
    && apt-get install -y iputils-ping \
    && apt-get install lsof -y \
    && apt-get install net-tools -y \
    && apt-get install curl -y

# setup /vnode_data directory
RUN mkdir -p /scs_data

# install moac-scs and moac ipfs-monkey
COPY moac-scs/build/bin/scsserver /usr/local/sbin/
COPY wait-for-it.sh /usr/local/sbin/