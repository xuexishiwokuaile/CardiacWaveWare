// pages/register/register.js

import WxValidate from '../../utils/WxValidate'
import { registerModel } from '../../models/register.js'
import { $wuxSelect } from '../../components/dist/index'
import {LoginModel} from '../../models/login.js'
import {UserDto} from '../../models/dto/userDto'
import {SessionManager} from '../../models/system/sessionManager'


let sessionManager = new SessionManager()
let userDto = new UserDto()
let login = new LoginModel()
let register = new registerModel()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isUserReg: true,   //注册表单flag（显示用户注册的还是医生注册的）
    buttonClicked: false,   //设置个flag，防止用户多次点击注册按钮
    departValue: '',   //机构选择
    options: "",   //医院列表
    gender:['男','女'],//性别 选项
    genderValue:"",//性别选择的值
    trueOrFalse:['是','否'], //选择是否
    isSmokingValue:'',
    isDrinkingValue:'',
    isDiabetesValue:'',
    isHypertensionValue:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化表单验证
    this.initValidate()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //选择机构
  selectDepart() {
    //先获取机构列表
    const hospitalList = register.getHospitalList()
    hospitalList.then((res) => {
      // console.log(res)
      ///将返回的字符串转化为数组
      let optionsArray = res.split(",")
      this.setData({
        options: optionsArray
      })
      $wuxSelect('#wux-select1').open({
        value: this.data.departValue,
        options: this.data.options,
        onConfirm: (value, index, options) => {
          // console.log('onConfirm', value, index, options)
          if (index !== -1) {
            this.setData({
              departValue: value,
            })
          }
        },
      })
    })
  },
  // 选择性别
  selectGender(){
    $wuxSelect('#wux-select2').open({
      value: this.data.genderValue,
      options: this.data.gender,
      onConfirm: (value, index, options) => {
        // console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            genderValue: value,
          })
        }
      },
    })
  },
  //选择是否吸烟
  selectSmoke(){
    $wuxSelect('#wux-select3').open({
      value: this.data.isSmokingValue,
      options: this.data.trueOrFalse,
      onConfirm: (value, index, options) => {
        // console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            isSmokingValue: value,
          })
        }
      },
    })
  },
  //选择是否饮酒
  selectDrink(){
    $wuxSelect('#wux-select3').open({
      value: this.data.isDrinkingValue,
      options: this.data.trueOrFalse,
      onConfirm: (value, index, options) => {
        // console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            isDrinkingValue: value,
          })
        }
      },
    })
  },
  //选择是否患有糖尿病
  selectDiabetes(){
    $wuxSelect('#wux-select3').open({
      value: this.data.isDiabetesValue,
      options: this.data.trueOrFalse,
      onConfirm: (value, index, options) => {
        // console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            isDiabetesValue: value,
          })
        }
      },
    })
  },
  //选择是否患有高血压
  selectHypertension(){
    $wuxSelect('#wux-select3').open({
      value: this.data.isHypertensionValue,
      options: this.data.trueOrFalse,
      onConfirm: (value, index, options) => {
        // console.log('onConfirm', value, index, options)
        if (index !== -1) {
          this.setData({
            isHypertensionValue: value,
          })
        }
      },
    })
  },
  login(uname,pwd){
    //通过系统登录相应的系统
    login.loginBySys(uname, pwd).then(res=>{
      
        //将相应的登录信息进行保存
        const userDto2 = userDto.transFromLoginRetun(res, pwd)
        sessionManager.setUserDto(userDto2)

        const arrays = res.split('$_@_$');
        if(arrays.length >= 5){
          const userId = arrays[0].replace('userId=', '');
          const userToken = arrays[1].replace('userToken=', '');

          //存入相应的内存当中/
          sessionManager.setUserId(userId)
          sessionManager.setUserToken(userToken)
        }

        //如果成功，直接跳转至登录界面
        wx.redirectTo({
          url: '../index/index'
        })
    });
  },
  //提交请求
  formSubmit(e) {
    const params = e.detail.value
    console.log(params)
    if (!this.data.buttonClicked) {
      //console.log("我是第一次提交请求")
      //用户注册
      if (this.data.isUserReg) {
        // 传入表单数据，调用验证方法
        //校验表单
        if (!this.WxValidate.checkForm(params)) {
          const error = this.WxValidate.errorList[0]
          this.showModal(error)
          return false
        }
        console.log('form发生了submit事件，携带数据为：', params)
        //防止重复点击
        this.setData({
          buttonClicked: true
        })
        const registerRes = register.clientReg(params.name, params.sex, params.phone, params.department, params.diabetes, params.drinking, params.height, params.hypertension, params.smoking, params.weight, params.pwd,params.age)
        registerRes.then((res) => {
          console.log(typeof(res))
          console.log(res)
          if (typeof(res) == 'number') {
            wx.showModal({
              title: '注册成功，您的检查码是：',
              content: res.toString(),
              showCancel: false,
              success:(res)=> {
                if (res.confirm) {
                  //直接登录
                  this.login(params.phone,params.pwd)
                } else if (res.cancel) {
                  //直接登录
                  this.login(params.phone,params.pwd)
                }
              }
            })
          } else if(res == "rpt"){
            wx.showToast({
              title: '当前手机号已被注册，请更换',
              icon: 'none',
              duration: 1000
            })
            this.setData({
              buttonClicked: false
            })
          }else if(res == "checkNumber bad"){
            wx.showModal({
              title: '注册成功',
              content: '检查码获取失败，请联系医生',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../login/login'
                  })
                } else if (res.cancel) {
                  wx.reLaunch({
                    url: '../login/login'
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '注册失败，请刷新本页面重新注册或联系医生',
              icon: 'none',
              duration: 1000
            })
          }
        })
      } else {
        //医生注册
        // 传入表单数据，调用验证方法
        //校验表单
        if (!this.WxValidate.checkForm(params)) {
          const error = this.WxValidate.errorList[0]
          this.showModal(error)
          return false
        }
        // console.log('form发生了submit事件，携带数据为：', params)
        //防止重复点击
        this.setData({
          buttonClicked: true
        })
        const doctorReg = register.doctorReg(params.name, params.phone, params.pwd,params.department)
        doctorReg.then((res) => {
          if (res == "ok") {
            wx.showToast({
              title: '注册成功',
              icon: 'none',
              duration: 1000
            })
            //直接登录
            this.login(params.phone,params.pwd)
          } else if (res == "rpt") {
            wx.showToast({
              title: '当前手机号已被注册，请更换',
              icon: 'none',
              duration: 1000
            })
            this.setData({
              buttonClicked: false
            })
          } else {
            wx.showToast({
              title: '注册失败，请刷新本页面重新注册或联系医生',
              icon: 'none',
              duration: 1000
            })
          }
        })
      }
    } else {
      //console.log("我是第二次提交请求，直接退出")
      wx.showToast({
        title: '请不要重复注册',
        icon: 'none',
        duration: 1000
      })
      return false
    }
  },
  //切换注册身份
  switchIdentity() {
    let flag = this.data.isUserReg
    this.setData({
      isUserReg: !flag
    })
    //初始化表单验证
    this.initValidate()
  },
  //表单校验
  initValidate() {
    let rules = ""
    let messages = ""
    console.log("this.data.isUserReg=" + this.data.isUserReg)
    if (this.data.isUserReg) {
      //用户注册
      //配置规则,要跟表单的顺序一致 
      rules = {
        name: {
          required: true,
        },
        sex: {
          required: true,
          sex: true,
        },
        pwd: {
          required: true,
        },
        pwd2: {
          required: true,
          equalTo: 'pwd'
        },
        phone: {
          required: true,
          tel: true,
        },
        age:{
          required: true,
        },
        // code: {
        //   required: true,
        // },
        department: {
          required: true,
          chooseDepartment: true,
        },
        height: {
          required: true,
          height: true,
        },
        weight: {
          required: true,
        },
        smoking: {
          required: true,
          trueOrFalse: true,
        },
        drinking: {
          required: true,
          trueOrFalse: true,
        },
        diabetes: {
          required: true,
          trueOrFalse: true,
        },
        hypertension: {
          required: true,
          trueOrFalse: true,
        },
      }
      // 验证字段的提示信息，若不传则调用默认的信息
      messages = {
        name: {
          required: '请输入姓名',
        },
        sex: {
          required: '请选择性别',
        },
        pwd: {
          required: "请输入密码",
        },
        pwd2: {
          required: "请再次输入密码",
          equalTo: "两次输入密码不一致"
        },
        phone: {
          required: "请输入手机号",
          tel: "请输入正确的手机号",
        },
        age:{
          required: "请输入年龄",
        },
        // code: {
        //   required: "请输入验证码",
        // },
        department: {
          chooseDepartment: "请选择医疗机构或合作单位名称",
          required: "请选择医疗机构或合作单位名称",
        },
        height: {
          required: "请输入身高",
        },
        weight: {
          required: "请输入体重",
        },
        smoking: {
          required: "请选择是否吸烟",
          trueOrFalse: "请选择正确的是否吸烟",
        },
        drinking: {
          required: "请选择是否饮酒",
          trueOrFalse: "请选择正确的是否饮酒",
        },
        diabetes: {
          required: "请选择是否患有糖尿病",
          trueOrFalse: "请选择正确的是否患有糖尿病",
        },
        hypertension: {
          required: "请选择是否患有高血压",
          trueOrFalse: "请选择正确的是否患有高血压",
        },
      }
    } else {
      //医生注册
      //配置规则,要跟表单的顺序一致
      rules = {
        name: {
          required: true,
        },
        pwd: {
          required: true,
        },
        pwd2: {
          required: true,
          equalTo: 'pwd'
        },
        phone: {
          required: true,
          tel: true,
        },
        // code: {
        //   required: true,
        // },
        // inviteCode: {
        //   required: true,
        // },
        department: {
          chooseDepartment: true,
        },
      }
      // 验证字段的提示信息，若不传则调用默认的信息
      messages = {
        name: {
          required: '请输入姓名',
        },
        phone: {
          required: "请输入手机号",
          tel: "请输入正确的手机号",
        },
        // code: {
        //   required: "请输入验证码",
        // },
        // department: {
        //   chooseDepartment: "请选择机构",
        // },
        // inviteCode: {
        //   required: "请输入邀请码",
        // },
        pwd: {
          required: "请输入密码",
        },
        pwd2: {
          required: "请再次输入密码",
          equalTo: "两次输入密码不一致"
        }
      }
    }

    // 创建实例对象
    this.WxValidate = new WxValidate(rules, messages)

    // 自定义验证规则-性别
    this.WxValidate.addMethod('sex', (value, param) => {
      return this.WxValidate.optional(value) || (value == "男" || value == "女")
    }, '请选择正确的性别')

    // 自定义验证规则-身高
    this.WxValidate.addMethod('height', (value, param) => {
      return this.WxValidate.optional(value) || (value.length >= 2 && (value.substring(0, 1) == "1" || value.substring(0, 1) == "2"))
    }, '请输入正确的身高')

    // 自定义验证规则-是否
    this.WxValidate.addMethod('trueOrFalse', (value, param) => {
      return this.WxValidate.optional(value) || (value == "是" || value == "否")
    }, '是否')

    // 自定义验证规则-是否选择了机构
    this.WxValidate.addMethod('chooseDepartment', (value, param) => {
      console.log(value == '')
      console.log(value == null)
      return this.WxValidate.optional(value) || (value != '')
    }, '请选择医疗机构或合作单位名称')
  },
  //表单错误弹窗
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
})