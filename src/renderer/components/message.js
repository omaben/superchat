// 通常都是在main.js中处理
import { Message } from 'element-ui'
// 为了实现Class的私有属性
const showMessage = Symbol('showMessage')

/** 
 *  重写ElementUI的Message
 *  single默认值true，因为项目需求，默认只弹出一个，可以根据实际需要设置
 */
export default class DonMessage {
    success(options, single = true) {
        this[showMessage]('success', options, single)
    }
    warning(options, single = true) {
        this[showMessage]('warning', options, single)
    }
    info(options, single = true) {
        this[showMessage]('info', options, single)
    }
    error(options, single = true) {
        this[showMessage]('error', options, single)
    }

    [showMessage](type, options, single) {
        if (single) {
            // 判断是否已存在Message
            if (document.getElementsByClassName('el-message').length === 0) {
                Message[type](options)
            }
        } else {
            Message[type](options)
        }
    }
}