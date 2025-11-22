# 安全连接

Watchtower 能够连接到通过 SSL/TLS 保护的 Docker 端点。如果你使用 _docker-machine_ 预配远程 Docker 主机，只需将 _docker-machine_ 生成的证书挂载到 watchtower 容器中，并可选地指定 `--tlsverify` 标志。

可以通过为目标主机执行 `docker-machine env` 命令来找到对应的 _docker-machine_ 证书位置（注意该命令返回的 `DOCKER_HOST` 与 `DOCKER_CERT_PATH` 环境变量的值）。需要将远程主机对应的证书目录挂载到 watchtower 容器的 _/etc/ssl/docker_。

在将证书挂载到 watchtower 容器后，你需要通过 `--tlsverify` 标志启用证书验证：

```bash
docker run -d \
  --name watchtower \
  -e DOCKER_HOST=$DOCKER_HOST \
  -e DOCKER_CERT_PATH=/etc/ssl/docker \
  -v $DOCKER_CERT_PATH:/etc/ssl/docker \
  marrrrrrrrry/watchtower --tlsverify
```

