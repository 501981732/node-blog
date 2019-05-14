const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fileName = path.join(__dirname,'../','../','logs','access.log');

const readStream = fs.createReadStream(fileName);

// 创建 readline对象

const rl = readline.createInterface({
    input: readStream
})
let chromeNum = 0;
let totalNum = 0
//逐行读取

rl.on('line', lineData => {
    if (!lineData) return 
    totalNum++
    const arr = lineData.split(' -- ')
    if (arr[2] && arr[2].indexOf('Chrome') > 0) {
        // 累加 chrome 的数量
        chromeNum++
    }
})
rl.on('close',() => {
    console.log('chrome占比：', chromeNum/totalNum)
})