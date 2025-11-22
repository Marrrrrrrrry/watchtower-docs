# 远程主机

默认情况下，watchtower 监控本地 Docker 守护进程。但也可以通过指定远程端点来监控远程 Docker。

在启动 watchtower 容器时，可以使用 `--host` 标志或 `DOCKER_HOST` 环境变量指定远程 Docker 端点：

```bash
docker run -d \
  --name watchtower \
  marrrrrrrrry/watchtower --host "tcp://10.0.1.2:2375"
```

或：

```bash
docker run -d \
  --name watchtower \
  -e DOCKER_HOST="tcp://10.0.1.2:2375" \
  marrrrrrrrry/watchtower
```

注意：在以上示例中，无需将 `/var/run/docker.sock` 挂载到 watchtower 容器。
