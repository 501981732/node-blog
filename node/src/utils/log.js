const fs = require('fs')
const path = require('path')

// 生成 write stream
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname, '..', '..', 'logs', fileName)
    const writeStream = fs.createWriteStream(fullFileName, {
        flags: 'a' // append 
    })
    return writeStream
}

function writeLog(writeStream, log) {
    writeStream.write(log + '\n') //写日志
}
// 写访问日志

const accessWriteStream = createWriteStream('access.log')

function access(log) {
    writeLog(accessWriteStream,log)
}

module.exports = {
    access
}
