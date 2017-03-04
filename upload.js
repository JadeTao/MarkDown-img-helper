var qiniu = require("qiniu");
var fs = require("fs");
var async = require('async');



//配置！
qiniu.conf.ACCESS_KEY = "Access Key "
qiniu.conf.SECRET_KEY = "Secret Key"
bucket = "要上传的空间名"//要上传的空间名
bucketUrl = "七牛云通用域名"
resultFile = "./url.txt"
localFile = __dirname + "/img"





//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile,fileUrl,index,callback) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
        if (!err) {
            // 上传成功， 追加url至url.txt
            fs.appendFile('./url.txt',fileUrl+'\r\n',function(err){
                    if(err){
                        throw err;
                    }else{
                         ret.persistentId=index+1;
                         console.log("File:"+ret.key+"\nHash:"+ret.hash+"\nid:"+ret.persistentId);
                         console.log('has finished\n');
                         fs.unlinkSync(localFile);//删除文件，不需此功能请注释                        
                         callback();
                    }
            });
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
    });
}

//程序入口
fs.readdir(__dirname + "/img/", function (err, files){
    if (err) {
        console.log(err)
    } else {
        console.log(files);

        //使用async.js进行回调控制
        async.eachOfSeries(files,function(file,index,callback){
             //上传到七牛后保存的文件名
            var key = file;

            var fileUrl="七牛云通用域名"+file;

            //生成上传 Token
            var token = uptoken(bucket, key);

            //要上传文件的本地路径
            var filePath = './img/' + file;

            uploadFile(token, key, filePath,fileUrl,index,callback)
        })
    }
    }
)
