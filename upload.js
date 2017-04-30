const qiniu = require("qiniu")
const fs = require("fs")
const async = require('async')

const bucketUrl = "你的七牛云通用域名"
const bucket = "要上传的空间名" 
//Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = "Access Key"
qiniu.conf.SECRET_KEY = "Secret Key"




//构建上传策略函数
const uptoken = (bucket, key) => {
    let putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key)
    return putPolicy.token();
}

//构造上传函数
const uploadFile = (uptoken, key, localFile, fileUrl, index) => {
    let extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, (err, ret) => {
        if (!err) {
            // 上传成功， 追加url至url.txt
            fs.appendFile('./url.txt', fileUrl + '\r\n', err => {
                if (err) {
                    throw err
                } else {
                    ret.persistentId = index + 1
                    console.log("File:" + ret.key + "\nHash:" + ret.hash + "\nid:" + ret.persistentId);
                    console.log('has finished\n')
                    fs.unlinkSync(localFile)
                }
            });
        } else {
            // 上传失败， 处理返回代码
            console.log(err)
        }
    })
}
//程序入口
fs.readdir(__dirname + "/file/", (err, files) => {
    if (err) {
        console.log(err)
    } else {
        console.log(files)
        files.forEach((file, index) => {
            //上传到七牛后保存的文件名
            const key = file
            const fileUrl = "你的七牛云通用域名" + file
            //生成上传 Token
            const token = uptoken(bucket, key)
            //要上传文件的本地路径
            const filePath = './file/' + file
            uploadFile(token, key, filePath, fileUrl, index)
        })
    }
})