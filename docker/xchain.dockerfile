FROM frolvlad/alpine-glibc:alpine-3.8_glibc-2.28
MAINTAINER "Yifan Wang <yifan.wang@moac.io>"

ARG version

RUN mkdir /xchain
RUN mkdir /xchain/keystore
RUN mkdir /xchain/config
RUN mkdir /xchain/data

# install tc
RUN apk add iproute2 && ln -s /usr/lib/tc /lib/tc
# install bash
RUN apk add bash

# install moac vnode and copy config file over
#COPY config/xchain/miner.config /xchain/xchainconfig.json
#COPY config/xchain/miner.config /vnode/config/vnodeconfig.json
COPY config/xchain/xchainconfig.json /xchain/xchainconfig.json
COPY config/xchain/xchain.genesis.json /xchain/genesis.json

# copy key files over
COPY config/xchain/0.bootnode.key /xchain/0.bootnode.key
COPY config/xchain/1.bootnode.key /xchain/1.bootnode.key
COPY config/xchain/2.bootnode.key /xchain/2.bootnode.key
COPY config/xchain/3.bootnode.key /xchain/3.bootnode.key
COPY config/xchain/4.bootnode.key /xchain/4.bootnode.key
COPY config/xchain/5.bootnode.key /xchain/5.bootnode.key
COPY config/xchain/6.bootnode.key /xchain/6.bootnode.key
COPY config/xchain/7.bootnode.key /xchain/7.bootnode.key
COPY config/xchain/8.bootnode.key /xchain/8.bootnode.key
COPY config/xchain/9.bootnode.key /xchain/9.bootnode.key
COPY config/xchain/10.bootnode.key /xchain/10.bootnode.key
COPY config/xchain/11.bootnode.key /xchain/11.bootnode.key
COPY config/xchain/12.bootnode.key /xchain/12.bootnode.key
COPY config/xchain/13.bootnode.key /xchain/13.bootnode.key
COPY config/xchain/14.bootnode.key /xchain/14.bootnode.key
COPY config/xchain/15.bootnode.key /xchain/15.bootnode.key
COPY config/xchain/16.bootnode.key /xchain/16.bootnode.key
COPY config/xchain/17.bootnode.key /xchain/17.bootnode.key
COPY config/xchain/18.bootnode.key /xchain/18.bootnode.key
COPY config/xchain/19.bootnode.key /xchain/19.bootnode.key
COPY config/xchain/20.bootnode.key /xchain/20.bootnode.key

# install executables
COPY bin/$version/xchain/xchain /usr/local/sbin/xchain
COPY bin/tools/wait-for-it.sh  /usr/local/sbin/
COPY bin/tools/disable_network.sh /usr/local/sbin/
COPY bin/tools/resume_network.sh /usr/local/sbin/

WORKDIR /xchain

#Address: {a35add395b804c3faacf7c7829638e42ffa1d051}
#Address: {da8ad06b2a20c6f92641d185c22f0479b00a90f3}
#Address: {f34c3a04099a76dda80517373b21409391540b82}
#Address: {903ee4f9753b3717aa6a295b02095aa0c94036d0}
#Address: {f084d898a6329d0d9159ddccca0380d651ee1c17}
#Address: {3563e38cc436bd6835da191228115fe7869a382c}
#Address: {a221d547d2e3821f24924d7bd89e443045d81f6e}
#Address: {7ac799d9fb930fafc3d50937b10ea30f0c1c30ce}
#Address: {b544fd6b593807b864998836db91ab0d81626745}
#Address: {b94b69cc0fb38a6b1be2cd5466f0676b7d5be7f8}
#Address: {0fcdc2ec292878c15449d02d4e4928694f9a5baf}
#Address: {9526b1366d5328d8a3bb0eca0489deff7282a5fb}
#Address: {6586f8ad114271c2c84287a1b2e2b4794aee3868}
#Address: {1be6959a8498c91fe2599cf54d084fdd347e3929}
#Address: {cececba5e000d0b2c63de7e2f862be5c9d1e6123}
#Address: {0ae5b3913922eca2d781a9bc56d517987bdb9176}
#Address: {ad2139c3c35e61e11fbc880780accffb14c367e2}
#Address: {a6eca2a8b0109aefe1c4f6e9041c641cf79a76b3}
#Address: {b639f28531e832e7c90362f883f4a82bc5bab5ee}
#Address: {ec6234cbaae7ee4fd85d8c288054f89f3be29c81}

RUN xchain init genesis.json --datadir=/xchain \
   && echo "123456" > password \
   && echo "393873d6bbc61b9d83ba923e08375b7bf8210a12bed4ea2016d96021e9378cc9" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "797d1b94bf8e7df4f81428950c1ab8c5067e8163c20f7d20d217f51fbb363987" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "c0f21b2a6f4e2a8d43bc915e660dcacc13a76876151208d4c67cd5cc6120fa34" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "5042894502ee04d1aa9f7ec9ac2c7722f3df095c5520f69d235ae7f29659f6c4" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "fb0f0c79d16ed967dc1e346c2863edd25a611860d7a2723d87c4c8f490212a74" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "311335a8ea375cbb33659efb955ab9f400557e74f56216ec4192bba7d806204a" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "21afe6edda0dd2005736d1d0a58867a8a16ebe402af9f883f3e20586841d40fe" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "50a6c30f527db0413d8187c843962a29fec156ce3947cbd0864f95a06830f3c9" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "8fe93b1ee0b7a4a32315e6caddaf9a85f6af797b9e8c4daa274fc3e4243a1959" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "2cdbd03f8c7dda48232712c9d0655014663c175dc17f4e0325fba0988755ae22" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "995e94366b7857fc6e01cf435a13b25ab7daca83f2a8bfbc247138a4f45a35b2" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "23fbc9e11e4590f64726790f115e15203af784ca1f592355db7198fa55335d21" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "d05b79f3b0f87c5bdfe6b00a4c17e441f041085561deb680a880587a6822eb5c" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "dfc198699d1aaeaf23bd22c23091ec47fb01e8de67c54d4c4d00c4f4513a1229" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "de2d9b96cefbc1af5c23dcdcb33391f36607dd3b8e1b0e0d188b30ebc273e851" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "8d7a57898bc3b2d4eb83e0f5c7921d9500d795fd57b03ea90b1373a35d20c7fe" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "aa942ac2fc93b52c804556d2c1e936893477265ef713914ed66fc57ede5ad39a" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "e34ddedff402daab85a258875723a6d7898b070da7b7dd1fc8f2be39949ee703" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "3800ac58ca375f1275e45197eb4aae248a8f73fe30ac0281187e93a42cde4b6c" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && echo "2a69538e769adb80c7e34258f2d10fd4d607ab4c1e4d3bdc6d9fcc1b41a2631c" > pk \
   && xchain account import pk --datadir=/xchain --password password \
   && rm password pk

VOLUME /xchain

CMD ["echo", "This is xchain."]

# rpc port
EXPOSE 8545
EXPOSE 50062
