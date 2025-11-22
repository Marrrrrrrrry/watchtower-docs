# 停止信号

当 watchtower 检测到正在运行的容器需要更新时，会通过发送 SIGTERM 信号来停止该容器。
如果你的容器需要用不同的信号进行关闭，可以通过设置标签 `com.centurylinklabs.watchtower.stop-signal` 并赋予所需信号值来告知 watchtower。

该标签可以通过 Dockerfile 中的 `LABEL` 指令直接写入镜像：

```docker
LABEL com.centurylinklabs.watchtower.stop-signal="SIGHUP"
```

或者，也可以作为 `docker run` 命令的一部分进行指定：

```bash
docker run -d --label=com.centurylinklabs.watchtower.stop-signal=SIGHUP someimage
```

