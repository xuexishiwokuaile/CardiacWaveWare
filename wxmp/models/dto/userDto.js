/**
 * 相应的用户信息(存储于本地信息，不考虑session部分信息的保存)
 * 对应的传递信息类
 */
class UserDto{
    /**
     * 相应的构造方法用于获取当前用户初始化
     * @param {String} loginName 登录名称
     * @param {Number} classification 相应的角色
     * @param {String} name 当前用户对应的中文名
     * @param {String} passwd 对应的当前用户的密码
     * @param {String} id 对应的当前用户的id
     */
    constructor(loginName='', classification='2', name='', passwd='',id=''){
        this.loginName= loginName;
        this.classification= classification;
        this.name= name;
        this.passwd = passwd;
        this.id = id;
    }

    /**
     * 将相应的登录返回文字转成相应的角色信息
     * @param {String} strRetunWd 登录后相应的返回内容
     * @param {String} strPasswd 相应的用户登录密码保存至本地
     * @returns 返回相应的用户传递信息
     */
    transFromLoginRetun(strRetunWd, strPasswd){
        const arrays = strRetunWd.split('$_@_$');
        //如果获取的数组最少大于5时，我们可以取出我们需要的信息
        if(arrays.length >= 5){
            // this.userId = arrays[0].replace('userId=', '');
            // this.userToken = arrays[1].replace('userToken=', '');
            this.loginName = arrays[2].replace('loginName=', '');
            this.classification = arrays[3].replace('classification=', '');
            this.name = arrays[4].replace('name=', '');
            this.id = arrays[5].replace('id=', '');
            this.passwd = strPasswd;
        }
        return this
    }
}

export{UserDto}