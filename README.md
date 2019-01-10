## 前提条件
系统已经安装了:
 - git
 - npm
 - docker
 - docker-compose


## 墨客Dapp开发环境的一键发链(私链)步骤


利用docker-compose来启动vnode与scs的容器

```sh
docker-compose -f docker/docker-compose.yaml up
```
检查各个scs容器是否运行正常。容器日志应该依次输出liveinfo。
替换 **{cid}** 为相应的某个scs容器名称: scs1, scs2, scs3, scs_monitor。
```sh
docker-compose -f docker/docker-compose.yaml logs -f {cid} | grep "liveinfo"
```
如果某个容器运行不正常(上述命令长时间没有liveinfo输出)，可重启容器
```sh
docker-compose -f docker/docker-compose.yaml restart {cid}
```

部署子链
```sh
cd contracts
./deploy_contracts.sh
```

部署完成后，检查子链是否正常出块。scs容器日志应该依次输出子链的区块。
```sh
docker-compose -f docker/docker-compose.yaml logs -f {cid} | grep "Block Number"
```

## 子链账户信息

所有账户的解锁密码：123456

Vnode:

所有账户都有起始资金2000000 moac
```sh
Address: a35add395b804c3faacf7c7829638e42ffa1d051  # vnode beneficiary
Address: f34c3a04099a76dda80517373b21409391540b82  # scs1 beneficiary
Address: 903ee4f9753b3717aa6a295b02095aa0c94036d0  # scs2 beneficiary
Address: f084d898a6329d0d9159ddccca0380d651ee1c17  # scs3 beneficiary
Address: 3563e38cc436bd6835da191228115fe7869a382c  # scsm beneficiary
Address: a221d547d2e3821f24924d7bd89e443045d81f6e
Address: 7ac799d9fb930fafc3d50937b10ea30f0c1c30ce
Address: b544fd6b593807b864998836db91ab0d81626745
Address: b94b69cc0fb38a6b1be2cd5466f0676b7d5be7f8
Address: da8ad06b2a20c6f92641d185c22f0479b00a90f3
```

SCS:

```sh
scs 1 id: a63a7764d01a6b11ba628f06b00a1828e5955a7f
scs 2 id: 43c375d09e8a528770c6e1c76014cc9f4f9139a3
scs 3 id: 8d26cd8257288a9f3fcb3c7a4b15ade3cf932925
scs monitor id: 0b52dde836cb80a5d13c68784c338f42e1860922
```

## 节点的RPC服务信息

```sh
vnode rpc: http://localhost:52159
scs 1 rpc: http://localhost:52160
scs 2 rpc: http://localhost:52161
scs 3 rpc: http://localhost:52162
scs monitor rpc: http://localhost:52163
```