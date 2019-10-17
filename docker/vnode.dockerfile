FROM frolvlad/alpine-glibc:alpine-3.8_glibc-2.28
MAINTAINER "Yifan Wang <yifan.wang@moac.io>"

ARG version

RUN mkdir /vnode

# install tc
RUN apk add iproute2 && ln -s /usr/lib/tc /lib/tc
# install bash
RUN apk add bash

# install moac vnode
COPY config/vnode/vnodeconfig.json /vnode/vnodeconfig.json
COPY config/vnode/vnodeconfig-with-force-subnet-p2p.json /vnode/vnodeconfig-with-force-subnet-p2p.json
COPY config/vnode/vnode.genesis.json /vnode/genesis.json
COPY bin/$version/vnode/moac /usr/local/sbin/
COPY bin/tools/wait-for-it.sh  /usr/local/sbin/
COPY config/vnode/0.bootnode.key /vnode/0.bootnode.key
COPY config/vnode/1.bootnode.key /vnode/1.bootnode.key
COPY config/vnode/2.bootnode.key /vnode/2.bootnode.key
COPY config/vnode/3.bootnode.key /vnode/3.bootnode.key
COPY config/vnode/4.bootnode.key /vnode/4.bootnode.key
COPY config/vnode/5.bootnode.key /vnode/5.bootnode.key
COPY config/vnode/6.bootnode.key /vnode/6.bootnode.key
COPY config/vnode/7.bootnode.key /vnode/7.bootnode.key
COPY config/vnode/8.bootnode.key /vnode/8.bootnode.key
COPY config/vnode/9.bootnode.key /vnode/9.bootnode.key
COPY config/vnode/10.bootnode.key /vnode/10.bootnode.key
COPY config/vnode/11.bootnode.key /vnode/11.bootnode.key
COPY config/vnode/12.bootnode.key /vnode/12.bootnode.key
COPY config/vnode/13.bootnode.key /vnode/13.bootnode.key
COPY config/vnode/14.bootnode.key /vnode/14.bootnode.key
COPY config/vnode/15.bootnode.key /vnode/15.bootnode.key
COPY config/vnode/16.bootnode.key /vnode/16.bootnode.key
COPY config/vnode/17.bootnode.key /vnode/17.bootnode.key
COPY config/vnode/18.bootnode.key /vnode/18.bootnode.key
COPY config/vnode/19.bootnode.key /vnode/19.bootnode.key
COPY config/vnode/20.bootnode.key /vnode/20.bootnode.key


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
    && echo "995e94366b7857fc6e01cf435a13b25ab7daca83f2a8bfbc247138a4f45a35b2" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "23fbc9e11e4590f64726790f115e15203af784ca1f592355db7198fa55335d21" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "d05b79f3b0f87c5bdfe6b00a4c17e441f041085561deb680a880587a6822eb5c" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "dfc198699d1aaeaf23bd22c23091ec47fb01e8de67c54d4c4d00c4f4513a1229" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "de2d9b96cefbc1af5c23dcdcb33391f36607dd3b8e1b0e0d188b30ebc273e851" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "8d7a57898bc3b2d4eb83e0f5c7921d9500d795fd57b03ea90b1373a35d20c7fe" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "aa942ac2fc93b52c804556d2c1e936893477265ef713914ed66fc57ede5ad39a" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "e34ddedff402daab85a258875723a6d7898b070da7b7dd1fc8f2be39949ee703" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "3800ac58ca375f1275e45197eb4aae248a8f73fe30ac0281187e93a42cde4b6c" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && echo "2a69538e769adb80c7e34258f2d10fd4d607ab4c1e4d3bdc6d9fcc1b41a2631c" > pk \
    && moac account import pk --datadir=/vnode --password password \
    && rm password pk

VOLUME /vnode

CMD ["echo", "This is moac vnode."]

# rpc port
EXPOSE 8545
EXPOSE 50062
