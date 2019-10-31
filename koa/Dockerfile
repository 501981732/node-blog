#基础镜像
FROM node:12
#将当前目录下的所有文件（除了.dockerignore排除的路径），都拷贝进入 image 文件的/app目录
COPY . /app
# 指定工作目录
WORKDIR /app
#安装依赖
#RUN npm install --registry=https://registry.npm.taobao.org
#RUN npm config set registry https://registry.npm.taobao.org \
#    && npm install

RUN npm set strict-ssl false

RUN npm install

#声明暴露容器端口
EXPOSE 8081

CMD npm run prod