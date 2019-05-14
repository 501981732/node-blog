### node从零出发

#### 用原生node 一步步实现一个博客后台，然后用 express, koa分别重构

- cross-env 跨平台设置环境变量
- supervisor 开发调试
- pm2 上线



- 改为sql之后 db,返回promise => controller用db也返回primise, router用controller也返回promise, app处理router，处理promise
  
- 链接mysql数据库错误 https://blog.csdn.net/sufubo/article/details/82945318
- NODE_ENV区分配置 测试，生产
- 封装exec promise mysql


### 登录

- 登录验证 登录信息存储
- cookie session 
- session 存入redis
- 和FE联调用nginx做反向代理

#### cookie

- cookie 一般5k,跨域不共享，每次请求把请求域的cookie发给server,server可修改cookie并发送浏览器，浏览器js可修改cookie(有限制)
- httpOnly只允许server改 当浏览器 document.cookie时，返回‘’
- 过期时间 toGMTString

#### session

- session： cookie敏感信息暴露/大小限制
- 浏览器端cookie存id ，username对应相应信息
- 设置session问题： 不应放到内存中，内存有限制/多进程数据共享问题/重新上线时清零

#### redis

- redis 内存数据库 / mysql是硬盘数据库
- session 访问频繁，对性能要求极高 /可以不考虑断点丢失问题/数据量不会很大 很适合redis
- redi 链接失败 shttps://stackoverflow.com/questions/41427756/error-redis-connection-to-127-0-0-16379-failed-connect-econnrefused-127-0-0
- redis-server
#### nginx 反向代理 联调

- 高性能的 Web/反向代理服务器
- 一般用来做静态服务/负载均衡/反向代理
    - 测试ngnix  -t  
    - 启动nginx; nginx -s reload;重新载入配置文件
    - 停止nginx -s stop

- 登录功能依赖cookie, but cookie跨域不共享, 若端口不一致则会跨域  
- 解决方案： nginx反向代理
- 同域联调
    server {
        listen 8080;
        server_name localhost;
        location / {
            proxy_pass http://localhost:8001;
        }
        location /api/ {
            proxy_pass http://localhost:8888;
            proxy_set_header Host $host;
        }
    }





- web server -- mysql
- web server -- redis


###日志

- 两端登录/判断登录
- 两端简历投递
- 两端分享
- M端直调
- 