FROM frolvlad/alpine-glibc:alpine-3.8_glibc-2.28
LABEL MAINTAINER="Yifan Wang <yifan.wang@moac.io>"

ARG version

# install tc
# RUN apk add iproute2 && ln -s /usr/lib/tc /lib/tc

RUN apk add bash
RUN mkdir -p /scs/data

# RUN mkdir -p /scs/1 \
#    && mkdir -p /scs/2 \
#    && mkdir -p /scs/3 \
#    && mkdir -p /scs/monitor

# install scsserver and its config
COPY bin/tools/wait-for-it.sh  /usr/local/sbin/
# COPY config/scs/1 /scs/1
# COPY config/scs/2 /scs/2
# COPY config/scs/3 /scs/3
# COPY config/scs/4 /scs/4
# COPY config/scs/5 /scs/5
# COPY config/scs/6 /scs/6
# COPY config/scs/7 /scs/7
# COPY config/scs/8 /scs/8
# COPY config/scs/9 /scs/9
# COPY config/scs/10 /scs/10
# COPY config/scs/11 /scs/11
# COPY config/scs/12 /scs/12
# COPY config/scs/13 /scs/13
# COPY config/scs/14 /scs/14
# COPY config/scs/15 /scs/15
# COPY config/scs/monitor /scs/monitor
COPY bin/$version/scs/scsserver /usr/local/sbin/

WORKDIR /scs/data

CMD ["echo", "This is moac scs server."]
