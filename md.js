var qiniu = require("qiniu");
var fs = require("fs");
var cp = require("copy-paste");

//Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = "ACCESS_KEY"
qiniu.conf.SECRET_KEY = "SECRET_KEY"
bucket = "static"//要上传的空间
bucketUrl = "七牛云通用域名"
//filePath = "./img/asth.ico"
resultFile = "./url.txt"
localFile = __dirname + "/img"


//构建上传策略函数
function uptoken(bucket, key) {
    var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
    return putPolicy.token();
}

//构造上传函数
function uploadFile(uptoken, key, localFile,fileUrl,index) {
    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
        if (!err) {
            // 上传成功， 处理返回值
            fs.appendFile('./url.txt',fileUrl+'\r\n',function(err){
                    if(err){
                        throw err;
                    }else{
                         ret.persistentId=index+1;
                         console.log("Hash:"+ret.hash+"\nFile:"+ret.key+"\nid:"+ret.persistentId);
                         console.log('has finished\n');
                    }
            });
           
        } else {
            // 上传失败， 处理返回代码
            console.log(err);
        }
    });
}


fs.readdir(__dirname + "/img/", function (err, files) {
    if (err) {
        console.log(err)
    } else {
        console.log(files);
        files.forEach(
            function (file,index) {
                //上传到七牛后保存的文件名
                var key = file;
                var fileUrl="七牛云通用域名/"+file;
                //生成上传 Token
                var token = uptoken(bucket, key);
                //要上传文件的本地路径
                var filePath = './img/' + file;
                uploadFile(token, key, filePath,fileUrl,index);
                cp.copy(fileUrl);
            })
    }
})
