## node 不依赖框架从零出发

### 用原生node 一步步实现一个博客后台，然后用 express, koa分别重构

- cross-env 跨平台设置环境变量
- supervisor 开发调试
- pm2 上线
- 手写router req.body req.session res.cookie

### mysql 

- 改为sql之后 db,返回promise => controller用db也返回primise, router用controller也返回promise, app处理router，处理promise
- 链接mysql数据库错误  https://blog.csdn.net/sufubo/article/details/82945318 mysql版本较高，最新的加密方式node还不支持
- NODE_ENV区分配置 测试，生产
- 封装exec promise话 mysql操作

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
- redis 链接失败 shttps://stackoverflow.com/questions/41427756/error-redis-connection-to-127-0-0-16379-failed-connect-econnrefused-127-0-0
- redis-server 启动
- redis-cli 
- keys *
- flushall 清空

#### nginx 反向代理 联调

- 高性能的 Web/反向代理服务器
- 一般用来做静态服务/负载均衡/反向代理
    - 测试nginx  -t  
    - 启动nginx; 
    - nginx -s reload;重新载入配置文件
    - 停止nginx -s stop
- 登录功能依赖cookie, but cookie跨域不共享, 若端口不一致则会跨域  
- 解决方案： nginx反向代理
- 同域联调

```
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
```

###日志

- 没有日志 就没有眼睛
- 峰值QPS (每秒访问量)/bug/
- 5W1H 谁 在哪里 合适 用什么访问

- 访问日志： accets.log （server最重要的日志）
- 自定义日志： 自定义事件、错误日志

- 节省CPU 内存 利用stream 流
- 日志文件太大(可能一天几个G)，且对性能要求不高，不适合放到redis ,没有表结构/

#### 日志拆分
- crontab定时任务
- linux定时任务格式：  ***** command:  分钟/小时/号/月份/星期几  命令
- 定时将access.log拷贝为 2019-05-05.access.log
- 将access.log 清空 重新记录
  
- crontab -e    输入 * 0 * * * /Users/wangmeng/Desktop/koa/blog/node/logs/copy.sh 每天凌晨触发sh脚本
- crontab -l 查看定时任务

#### 日志分析
- nodejs的readline （基于stream,高效） 逐行读取

- I/O操作性能瓶颈 网络I/O和文件I/O
- process.stdin.pipe(process.stdout) // pipe：管道  process.stdin获取数据，通过管道传递给process.stdout

### 安全

- sql注入 窃取数据库内容
    - 输入sql片段，最终拼接成一段攻击代码
    - select username, realname from users where username='wangmeng'-- ' and password='123456'; 输入wangmeng'   --  免密码登录
    - select username, realname from users where username='wangmeng';delete * from user;-- ' and password='123456'  -- 删除数据
    - 解决方案：escape函数处理输入内容 
- xss攻击 窃取cookie等信息
    - 在页面展示内容中掺杂js代码，用户的输入没有被转义，被直接执行 比如留言区域 写个<script>alert(’wm最帅‘)</script>
    - 解决方案：转换js的特殊字符 < >等   xss库
- 密码加密 保证用户信息安全
- DDOS攻击 需要硬件或者服务来支持（OP）


### 线上环境

- 服务器稳定性
- 充分利用服务器硬件资源，以便提高性能
- 线上日志记录
    - morgan 配置 访问日志access.log
    - pm2 配置 程序错误日志
    - pm2 配置 程序中定义日志 out.log

> 利用PM2解决线上问题
    - 进程守护，系统崩溃自动重启
    - 启动多进程，充分利用CPU 内存
        - 多进程中程序内存无法共享 --> redis解决 多个进程访问一个redis
    - 自带日志记录功能

#### PM2介绍
- 下载安装 npm install pm2 --save
    pm2 后台运行的 
- 常用命令
    - pm2 start app.js/配置文件  
    - pm2 list 进程列表
    - pm2 restart <appname/id> 重启
    - pm2 stop <appname/id> 停止
    - pm2 delete <appname/id> 删除
    - pm2 info <appname/id> 信息
    - pm2 log <appname/id> 日志
    - pm2 monit <appname/id> 检测

  
- 配置信息
  
  ```
  {
    "apps": {
        "name": "koa-blog", //程序名字
        "script": "app.js", //启动文件
        "watch": true, //是否检测文件变化自动重启
        "ignore_watch": [ // ignore
            "node_modules",
            "logs"
        ],
        "instances": "max", //开启多进程  max自动最大核数
        "error_file": "logs/err.log",// 错误日志
        "out_file": "logs/out.log", // 程序中console的日志
        "log_date_format": "YYYY-MM-DD HH:mm:ss", //日志记录时间 格式
        "exec_mode": "cluster", // 应用程序启动模式 默认 "fork"  "cluster":开启集群模式 生成多个工作线程来共享同一个TCP连接
      "env": {
           "NODE_ENV": "production"                // 环境参数，当前指定为生产环境 process.env.NODE_ENV
        },
        "env_dev": {
            "NODE_ENV": "development"              // 环境参数，当前指定为开发环境 pm2 start app.js --env_dev
        }
    }
}
  ```
- q: 用pm2启动的话 用process.env.NODE_ENV === 'development'判断环境注册的中间件 未生效
- 待解决 --> 莫名其妙解决






