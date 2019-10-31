const errorHandler = {
	error(app) {
		app.use(async(ctx,next) => {
			// try会延长作用域链
			try {
				await next()
			} catch (error) {
				//防止百度降权seo 将500设置成200防止页面报错之后百度降权
				// ctx.status = error.status || 200
				ctx.status = error.status || 500
				console.error(error)
				// 服务器接口 单独把log4js 接入到集群服务器
				// 邮件 短信 电话
				ctx.body = '请求出错~'
			}
		})
        // 配置404 
		app.use(async(ctx,next) => {
			await next()
			// koa 是先走到await 再回来
			if (404 != ctx.status) return;
			ctx.body = '<script type="text/javascript" src="//qzonestyle.gtimg.cn/qzone/hybrid/app/404/search_children.js" charset="utf-8" homePageUrl="/" homePageName="回到我的主页"></script>'
		})
	}
}

module.exports = errorHandler;