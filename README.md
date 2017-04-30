/*
 * @Author: jader 
 * @Date: 2017-04-30 23:29:59 
 * @Last Modified by: jader
 * @Last Modified time: 2017-04-30 23:33:48
 */

# 将本地图片上传到七牛云


----------
安装依赖

    npm install


配置七牛云

    qiniu.conf.ACCESS_KEY = "Access Key "
	qiniu.conf.SECRET_KEY = "Secret Key"
	bucket = "要上传的空间名"
	bucketUrl = "七牛云通用域名"

	
将所要上传的文件放入/file文件夹中，运行脚本
		
		npm start

**注意，上传完毕后默认把/img文件夹清空，如不需此功能，请注释掉相关代码**

		fs.unlinkSync(localFile);//删除文件，不需此功能请注释  
			



更新：ES6