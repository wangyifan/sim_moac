FROM ubuntu:18.04
LABEL MAINTAINER="Yifan Wang <yifan.wang@moac.io>"

ARG version=1.0.6

RUN mkdir -p /scs/1 \
    && mkdir -p /scs/2 \
    && mkdir -p /scs/3 \
    && mkdir -p /scs/monitor

# install moac-scs and moac ipfs-monkey
COPY bin/$version/scs/scsserver /usr/local/sbin/
COPY bin/$version/scs/config/1 /scs/1
COPY bin/$version/scs/config/2 /scs/2
COPY bin/$version/scs/config/3 /scs/3
COPY bin/$version/scs/config/monitor /scs/monitor

WORKDIR /scs

#RUN scsserver --password

VOLUME /scs

CMD ["scsserver", "--userconfig", "userconfig.json", "--datadir", "/scs", "--password", "123456", "--rpcaddr", "0.0.0.0", "--rpcport", "",  "2>&1"]