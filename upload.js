const qiniu = require("qiniu")
const fs = require("fs")

const BUCKET_URL = "" // 七牛通用域名
const BUCKET_NAME = "" // 对象存储空间名称

const PATH = `${__dirname}/file/`
//Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = ""
qiniu.conf.SECRET_KEY = ""



/**
 * 构建上传策略函数
 * @param {*} fileName 文件名
 */
const genUptoken = fileName => (new qiniu.rs.PutPolicy(`${BUCKET_NAME}:${fileName}`)).token()


/**
 * 将node风格的callback转化为promise
 * 读取目录中的文件
 * @param {*} path 绝对路径
 */
const readDir = path => new Promise((resolve, reject) => {
    fs.readdir(path, (err, files) => err ? reject(err) : resolve(files))
})

/**
 * 将node风格的callback转化为promise
 * 使用七牛的SDK上传文件
 * @param {*} uptoken 
 * @param {*} fileName 
 * @param {*} filePath 
 * @param {*} fileURL 
 * @param {*} index 
 */
const QN_putFile = (uptoken, fileName, filePath, fileURL, index) => new Promise((resolve, reject) => {
    const extra = new qiniu.io.PutExtra()
    qiniu.io.putFile(uptoken, fileName, filePath, extra, (err, ret) => err ? reject(err) : resolve({ index, fileURL, ret }))
})

/**
 * 将node风格的callback转化为promise
 * @param {*} data 将几个参数打包，方便resolve
 */
const gen_result = data => new Promise((resolve, reject) => {
    const { index, fileURL, ret } = data
    fs.appendFile('./url.txt', fileURL + '\r\n', err => {
        if (err) {
            reject(err)
        } else {
            ret.persistentId = index + 1
            console.log(`File: ${ret.key}\nHash:${ret.hash}\nid:${ret.persistentId}`)
            console.log('has finished\n')
            resolve()
        }
    })
})

readDir(PATH).then(
    files => files.forEach((file, index) => {
        const fileURL = `${BUCKET_URL}/${file}`
        const uptoken = genUptoken(file)
        const filePath = `./file/${file}`
        // console.log(`${fileURL}  ${uptoken}  ${filePath}`)
        QN_putFile(uptoken, file, filePath, fileURL, index)
            .then(gen_result, console.log)
            .then(() => fs.unlinkSync(filePath), console.log) //删除待上传文件
    }),
    console.log
)