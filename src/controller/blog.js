const getList = (author,keywords) => {
    return [
        {
            id: 1,
            title: '标题1',
            content: '内容1',
            createTime: 1557399988587,
            author: '王猛'
        },
        {
            id: 2,
            title: '标题2',
            content: '内容2',
            createTime: 1557399988587,
            author: '吴岑'
        }
    ]
}
const getDetail = id => {
    return {
        id: 1,
        title: '标题1',
        content: '内容1',
        createTime: 1557399988587,
        author: '王猛'
    }
}
module.exports = {
    getList,
    getDetail
}