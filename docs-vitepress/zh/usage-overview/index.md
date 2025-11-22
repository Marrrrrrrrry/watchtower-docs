# 使用概览

Watchtower 本身以 Docker 容器的形式打包，安装只需拉取镜像 `marrrrrrrrry/watchtower` 即可。若你使用 ARM 架构，请从 [marrrrrrrrry Docker Hub](https://hub.docker.com/r/marrrrrrrrry/watchtower/tags/) 拉取相应的 `marrrrrrrrry/watchtower:armhf-<tag>` 镜像。

由于 watchtower 需要与 Docker API 交互以监控正在运行的容器，运行时需要使用 `-v` 将宿主机的 _/var/run/docker.sock_ 挂载到容器内。

使用以下命令运行 `watchtower` 容器：

```bash
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  marrrrrrrrry/watchtower
```

如果需要从私有 Docker 仓库拉取镜像，可以通过环境变量 `REPO_USER` 和 `REPO_PASS` 提供认证凭据，或将宿主机的 docker 配置文件挂载到容器根目录（`/`）。

通过环境变量传递凭据：

```bash
docker run -d \
  --name watchtower \
  -e REPO_USER=username \
  -e REPO_PASS=password \
  -v /var/run/docker.sock:/var/run/docker.sock \
  marrrrrrrrry/watchtower container_to_watch --debug
```

更多关于传递环境变量的选项，可参考 [这条 Stack Overflow 回答](https://stackoverflow.com/a/30494145/7872793)。

如果你在 Docker Hub 上启用了 2FA，则仅传递用户名与密码会不足够。此时可以运行 `docker login` 将凭据存储在 `$HOME/.docker/config.json`，然后将该配置文件挂载至 Watchtower 容器：

```bash
docker run -d \
  --name watchtower \
  -v $HOME/.docker/config.json:/config.json \
  -v /var/run/docker.sock:/var/run/docker.sock \
  marrrrrrrrry/watchtower container_to_watch --debug
```

::: info 运行时修改 config.json
按照上述方式挂载 `config.json` 时，来自宿主机的修改通常不会传播到运行中的容器。将文件挂载到 Docker 守护进程使用的是基于 inode 的绑定挂载；多数应用（包括 `docker login` 与 `vim`）不会直接编辑文件，而是复制并替换原文件，这会导致新的 inode，从而“破坏”绑定挂载。
解决办法：你可以为 `config.json` 创建一个符号链接，并在容器中挂载该链接。符号链接对应的文件始终具有相同的 inode，确保绑定挂载保持有效，并确保原文件的修改能够传播到运行中的容器（不受源文件 inode 变化影响）。
:::

如果按上述方式挂载了配置文件，启动被监控的镜像时请在镜像名称前添加仓库的 URL（可省略 `https://`）。下面是一个完整的 `docker-compose.yml` 示例：从 GitHub Registry 的私有仓库启动容器并使用 watchtower 进行监控。注意将更新检查间隔从默认的 24 小时改为 `30s`：

```yaml
version: "3"
services:
  cavo:
    image: ghcr.io/<org>/<image>:<tag>
    ports:
      - "443:3443"
      - "80:3080"
  watchtower:
    image: marrrrrrrrry/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /root/.docker/config.json:/config.json
    command: --interval 30
```

