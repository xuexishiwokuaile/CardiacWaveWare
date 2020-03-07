import {config} from '../config.js'

 
// 类
class HTTP{

    //方法
    request(params){
        wx.request({
            url:config.api_base_url + params.url,
            method:params.method,
            data:params.data,
            header:{
                'content-type':'application/json',
                'appkey':config.appkey
            },
            success:(res)=>{
                //处理异常，根据状态码
                let code = res.statusCode.toString();
                if(code.startsWith('2')){
                    //返回数据
                    params.success(res.data)
                }else{
                    wx.showToast({
                        title:'错误',
                        icon:'none',
                        duration:2000
                    })
                }
            },
            error:(err)=>{
                wx.showToast({
                    title:'错误',
                    icon:'none',
                    duration:2000
                })
            }
        })
    }
}

export {HTTP}