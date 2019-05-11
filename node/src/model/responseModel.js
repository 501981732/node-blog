class BaseModel {
    constructor(data, message) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        } else {
            this.message = message 
            this.data = data
        }
    }
}

class SuccessModel extends BaseModel {
    constructor(data, message = '成功' ) {
        super(data,message)
        this.state = 0
    }
}


class ErrorModel extends BaseModel {
    constructor(data,message = '失败' ) {
        super(data, message)
        this.state = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}