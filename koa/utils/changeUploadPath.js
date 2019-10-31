const {basename} = require('path')
module.exports = function changeUploadPath (path,host='') {
    let filename = basename(path)
    return `${host}/upload/${filename}`
}