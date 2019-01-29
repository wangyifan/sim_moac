FROM frolvlad/alpine-glibc:alpine-3.8_glibc-2.28
LABEL MAINTAINER="Yifan Wang <yifan.wang@moac.io>"

ARG version=dev

# install tc
RUN apk add iproute2 && ln -s /usr/lib/tc /lib/tc && apk add bash

RUN mkdir -p /scs/1 \
    && mkdir -p /scs/2 \
    && mkdir -p /scs/3 \
    && mkdir -p /scs/monitor

# install scsserver and its config
COPY bin/tools/wait-for-it.sh  /usr/local/sbin/
COPY bin/$version/scs/scsserver /usr/local/sbin/
COPY bin/$version/scs/config/1 /scs/1
COPY bin/$version/scs/config/2 /scs/2
COPY bin/$version/scs/config/3 /scs/3
COPY bin/$version/scs/config/monitor /scs/monitor

WORKDIR /scs
VOLUME /scs

CMD ["echo", "This is moac scs server."]
