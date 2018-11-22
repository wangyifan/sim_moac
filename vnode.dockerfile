FROM ubuntu:18.04
MAINTAINER Yifan Wang <yifan.wang@gmail.com>

VOLUME /vnode

# install editor
RUN apt-get update && apt-get install -y vim-tiny

# install moac-scs
COPY moac-vnode/build/bin/moac /usr/local/sbin/
COPY vnode.config.json /vnode/vnodeconfig.json
COPY vnode.genesis.json /vnode/genesis.json
COPY vnode.sh /usr/local/bin/vnode.sh
RUN ["chmod", "a+x", "/usr/local/bin/vnode.sh"]
WORKDIR /vnode

# rpc port
EXPOSE 8545

CMD ["/bin/bash", "-c", "/usr/local/bin/vnode.sh"]
