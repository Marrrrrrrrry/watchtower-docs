# 介绍

Watchtower 会监控你正在运行的 Docker 容器，并观察这些容器最初所基于的镜像是否发生变化。一旦检测到镜像更新，它会使用新镜像自动重启对应容器。

你只需在 Docker Hub 或自有镜像仓库推送新镜像，即可更新应用的运行版本。Watchtower 会拉取新镜像，优雅地关闭现有容器，并以初始部署时使用的同样选项重新启动它。

例如，假设你与一个基于 _centurylink/wetty-cli_ 的容器一起运行了 watchtower：

```text
$ docker ps
CONTAINER ID   IMAGE                   STATUS          PORTS                    NAMES
967848166a45   centurylink/wetty-cli   Up 10 minutes   0.0.0.0:8080->3000/tcp   wetty
6cc4d2a9d1a5   marrrrrrrrry/watchtower Up 15 minutes                            watchtower
```

每天，watchtower 都会拉取最新的 _centurylink/wetty-cli_ 镜像，并与用于运行 “wetty” 容器的镜像进行比较。如果它发现镜像已更新，将停止/移除 “wetty” 容器，并使用新镜像以及最初启动容器时的 `docker run` 选项重新启动它（在此示例中，包括 `-p 8080:3000` 的端口映射）。

## 下一步

- [快速开始](/zh/quick-start/)：了解基本使用方法
- [参数配置](/zh/arguments/)：查看详细配置选项
- [容器选择](/zh/container-selection/)：如何指定要监控的容器
- [私有仓库](/zh/private-registries/)：配置访问私有仓库
