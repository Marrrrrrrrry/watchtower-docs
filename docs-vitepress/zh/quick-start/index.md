 

# 快速开始

使用 watchtower，你可以在 Docker Hub 或自有镜像仓库推送新镜像后，自动更新正在运行的容器。watchtower 会拉取新镜像，优雅地关闭现有容器，并以初始部署时使用的同样选项重新启动。

## Docker Run

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  marrrrrrrrry/watchtower
```

## Docker Compose

```yaml
version: "3"
services:
  watchtower:
    image: marrrrrrrrry/watchtower
    container_name: watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped
```
