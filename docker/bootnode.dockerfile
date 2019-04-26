FROM frolvlad/alpine-glibc:alpine-3.8_glibc-2.28
MAINTAINER "Yifan Wang <yifan.wang@moac.io>"

RUN mkdir /bootnode

# install boot node
COPY config/vnode/bootnode.key /bootnode/bootnode.key
COPY bin/tools/bootnode /usr/local/sbin/
VOLUME /bootnode
EXPOSE 30333
