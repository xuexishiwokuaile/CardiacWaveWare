import { HTTP } from '../utils/http-p.js'

class LoginModel extends HTTP{
    login(loginName,pwd){
        return this.request({
            // url:'one//CoreService/login?loginName='+loginName+'&passwd='+pwd,
            url:'one/Home/login/iLogin.template?login_name='+loginName+'&passwd='+pwd,
            method:'POST',
        })
    }

    /**
     * 相应的登录并获取服务器返回值
     * @param {相应的登录名称} loginName 
     * @param {对应的密码} pwd 
     */
    loginBySys(loginName, pwd){
        return this.request({
            url: 'CoreService/login',
            data: 'loginName='+loginName+'$^@^$passwd='+pwd,
            method: 'POST'
        })
    }
}

export{LoginModel}

// url:'one/CoreService/login?loginName='+loginName+'&passwd='+pwd,
// method:'POST',