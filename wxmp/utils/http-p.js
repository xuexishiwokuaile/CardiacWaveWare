import {config} from '../config.js'

 
/**
 * 相应的解决http向wx请求的类，主要是解决相应的wx.request请求
 */
class HTTP{
    //在外部调用此方法
    request({url,data={}, method='GET', contentType='application/json'}){
        return new Promise((resolve,reject)=>{
            this._request(url,resolve,reject,data,method, contentType)
        })
    }
    
    //_表示私有方法,此方法只在http-p内部调用
    _request(url,resolve,reject,data={},method='GET', contentType='application/json'){
        //默认打印相应的请求地址
        console.log("发送的请求是："+config.api_base_url + url)
        wx.request({
            url:config.api_base_url + url,
            method:method,
            data:data,
            header:{
                'content-type':contentType,
                // "Content-Type": "application/x-www-form-urlencoded",
                'appkey':config.appkey
            },
            success:(res)=>{
                //处理异常，根据状态码
                const code = res.statusCode.toString();
                if(code.startsWith('2')){
                    //返回数据
                    resolve(res.data)  //改变状态
                }
                else if (code.startsWith('4')){
                    reject()  //只是改变promise的状态
                    wx.showToast({
                        title:'提示：网络错误，请检查您的网络或访问地址',
                        icon:'none',
                        duration:2000
                    })
                }
                else{
                    reject()  //只是改变promise的状态
                    wx.showToast({
                        title:'提示：未知错误，请稍后再偿试或联系管理员',
                        icon:'none',
                        duration:2000
                    })
                }
            },
            error:(err)=>{
                reject()  //只是改变promise的状态
                wx.showToast({
                    title:'提示：未知错误，请稍后再偿试或联系管理员',
                    icon:'none',
                    duration:2000
                })
            }
        })
    }
}

export {HTTP}