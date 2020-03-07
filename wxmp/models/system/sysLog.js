import { HTTP } from '../../utils/http-p.js'
const util = require('../../utils/util.js')

/**
 * 系统使用的log类，主要是向后台写入对应的日志操作将提供给所有类进行使用
 * 
 */
class SysLog extends HTTP {
    /**
     * 记录相应的日志
     * @param {*} operate 相应的操作内容 
     * @param {*} operater 对应的操作人员
     * @param {*} longitude 纬度
     * @param {*} latitude 经度
     * @param {*} address 相应的地址信息
     */
    log(operate, operater = '匿名', longitude = '未知', latitude = '未知', address = '') {
        return this.request({
            url:'Home/record/iAddRecord.template',
            data: {
                IP: '0.0.0.0',
                time: util.formatTime(new Date()),
                operater: operater,
                longitude: longitude,
                latitude: latitude,
                address: address,
                operate: operate,
            }
        })
    }
}

export { SysLog }