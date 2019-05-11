### node从零出发

#### 用原生node 一步步实现一个博客后台，然后用 express, koa分别重构

- cross-env 跨平台设置环境变量
- supervisor 开发调试
- pm2 上线



- 改为sql之后 db,返回promise => controller用db也返回primise, router用controller也返回promise, app处理router，处理promise
- 链接mysql数据库错误 https://blog.csdn.net/sufubo/article/details/82945318
