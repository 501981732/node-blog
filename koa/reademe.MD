## KOA 重构

### session redis

 - redis-server 启动
 - redis-cli 命令行查询
 - keys * 查看所有 keys

 - 想用html文件，不想改后缀，又想让用某个引擎
```
// 将html文件以swig引擎进行渲染
app.use(views(__dirname + '/views', { map: {html: 'swig' }}))
```
### 中间件

- 洋葱圈模型: 注册中间件 第一层中间件开始 --> 第二层中间件开始 --> 第三层中间件开始 --> 第一层中间件结束 --> 第二层中间件结束 --> 第三层中间件结束
  
- app.use收集中间件
- 实现next机制，即上一个中间件通过next触发下一个中间件
- koa 本身没有路由功能 so不涉及到路由 method和path