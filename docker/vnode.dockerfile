FROM frolvlad/alpine-glibc:alpine-3.8_glibc-2.28
MAINTAINER "Yifan Wang <yifan.wang@moac.io>"

ARG version=dev

RUN mkdir /vnode

# install tc
# RUN apk add iproute2 && ln -s /usr/lib/tc /lib/tc

# install moac vnode
COPY config/vnode/vnodeconfig.json /vnode/vnodeconfig.json
COPY config/vnode/vnode.genesis.json /vnode/genesis.json
COPY bin/$version/vnode/moac /usr/local/sbin/
WORKDIR /vnode
RUN moac init genesis.json --datadir=/vnode \
    && echo "123456" > password \
    && echo "393873d6bbc61b9d83ba923e08375b7bf8210a12bed4ea2016d96021e9378cc9" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "797d1b94bf8e7df4f81428950c1ab8c5067e8163c20f7d20d217f51fbb363987" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "c0f21b2a6f4e2a8d43bc915e660dcacc13a76876151208d4c67cd5cc6120fa34" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "5042894502ee04d1aa9f7ec9ac2c7722f3df095c5520f69d235ae7f29659f6c4" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "fb0f0c79d16ed967dc1e346c2863edd25a611860d7a2723d87c4c8f490212a74" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "311335a8ea375cbb33659efb955ab9f400557e74f56216ec4192bba7d806204a" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "21afe6edda0dd2005736d1d0a58867a8a16ebe402af9f883f3e20586841d40fe" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "50a6c30f527db0413d8187c843962a29fec156ce3947cbd0864f95a06830f3c9" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "8fe93b1ee0b7a4a32315e6caddaf9a85f6af797b9e8c4daa274fc3e4243a1959" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "2cdbd03f8c7dda48232712c9d0655014663c175dc17f4e0325fba0988755ae22" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && rm password pk

VOLUME /vnode

CMD ["echo", "This is moac vnode."]

# rpc port
EXPOSE 8545
EXPOSE 50062
