# 生命周期钩子

## 在更新前后执行命令

::: info
这些是使用 `sh` 执行的 shell 命令，因此需要容器内提供 `sh` 可执行文件。
:::

> 如果容器未在运行，则生命周期钩子无法执行，更新会在不运行任何生命周期钩子的情况下继续进行。

可以在被 watchtower 更新的每个容器内部执行 _pre/post-check_ 与 _pre/post-update_ 命令。

- `_pre-check`：在每次更新轮询之前对每个容器执行。
- `_pre-update`：在即将开始更新、停止容器之前执行。
- `_post-update`：在重启已更新的容器之后执行。
- `_post-check`：在每次更新轮询之后对每个容器执行。

此功能默认关闭。要启用，请在命令行设置 `--enable-lifecycle-hooks`，或设置环境变量 `WATCHTOWER_LIFECYCLE_HOOKS=true`。

### 指定更新命令

通过 Docker 容器标签指定命令，当前可用的标签如下：

| 类型        | Docker 容器标签                                         |
| ----------- | -------------------------------------------------------- |
| Pre Check   | `com.centurylinklabs.watchtower.lifecycle.pre-check`     |
| Pre Update  | `com.centurylinklabs.watchtower.lifecycle.pre-update`    |
| Post Update | `com.centurylinklabs.watchtower.lifecycle.post-update`   |
| Post Check  | `com.centurylinklabs.watchtower.lifecycle.post-check`    |

这些标签可以在 Dockerfile 中作为指令声明（配合示例 .sh 文件），或作为 `docker run` 命令的一部分进行指定：

::: code-group
```docker [Dockerfile]
LABEL com.centurylinklabs.watchtower.lifecycle.pre-check="/sync.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.pre-update="/dump-data.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.post-update="/restore-data.sh"
LABEL com.centurylinklabs.watchtower.lifecycle.post-check="/send-heartbeat.sh"
```
```bash [docker run]
docker run -d \
--label=com.centurylinklabs.watchtower.lifecycle.pre-check="/sync.sh" \
--label=com.centurylinklabs.watchtower.lifecycle.pre-update="/dump-data.sh" \
--label=com.centurylinklabs.watchtower.lifecycle.post-update="/restore-data.sh" \
someimage --label=com.centurylinklabs.watchtower.lifecycle.post-check="/send-heartbeat.sh" \
```
:::

### 超时时间
所有生命周期命令的默认超时时间为 60 秒。超时后将强制继续 Watchtower 的更新循环。

#### Pre/Post-update 的超时

对于 `pre-update` 或 `post-update` 生命周期命令，可以通过添加标签 `com.centurylinklabs.watchtower.lifecycle.pre-update-timeout`（或对应的 post-update-timeout）并跟随以分钟为单位的超时值来覆盖默认超时，以允许脚本在被强制终止之前完成。

如果将标签值显式设置为 `0`，则会禁用超时。

### 执行失败

当命令执行失败，即退出码不为 0 或 75（EX_TEMPFAIL）时，不会阻止 watchtower 更新容器。只会报告一条包含退出码的错误日志。
