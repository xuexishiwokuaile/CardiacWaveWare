// pages/personalCenter/personalCenter.js
//相应的session控制类
import { SessionManager } from '../../models/system/sessionManager'
let sessionManager = new SessionManager()

import { getInfoModel } from '../../models/getInfo.js'
let getInfo = new getInfoModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',  //用户id
    isDoctor: 3,   //区分 普通用户和医生  ->  前端是否显示退出按钮  3表示普通用户
    name: '', //姓名
    gender: '', //性别
    phone: '', //手机号
    age: '', //年龄 
    height: '',//身高
    weight: '',//体重
    smoking: '',//吸烟
    drinking: '',//饮酒
    diabetes: '',//糖尿病
    hypertension: '',//高血压
    isDisabled: true, //表单禁止修改
    depart:'',//机构
    classification:0,//默认为零
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    //显示病人信息
    if (sessionManager.getUserDto().classification == 3) {
      // 获取用户详细信息
      const personInfo = getInfo.getPersonInfo(sessionManager.getUserDto().classification, sessionManager.getUserDto().id)
      personInfo.then((res) => {
        if (res[0] != "bad") {
          sessionManager.setUserInfo(res[0])

          this.setData({
            id: sessionManager.getUserDto().id,
            name: sessionManager.getUserInfo().name,
            gender: sessionManager.getUserInfo().gender,
            phone: sessionManager.getUserInfo().phone,
            age: sessionManager.getUserInfo().age,
            height: sessionManager.getUserInfo().height,
            weight: sessionManager.getUserInfo().weight,
            smoking: sessionManager.getUserInfo().smoking,
            drinking: sessionManager.getUserInfo().drinking,
            diabetes: sessionManager.getUserInfo().diabetes,
            hypertension: sessionManager.getUserInfo().hypertension,
            classification:sessionManager.getUserDto().classification
          })
        }
      })
    } else if(sessionManager.getUserDto().classification == 1) {
      //显示管理员信息
      this.setData({
        name: sessionManager.getUserDto().name,
        id: sessionManager.getUserDto().id,
        isDoctor:1,
        classification:sessionManager.getUserDto().classification
      })
    }else if(sessionManager.getUserDto().classification == 2){
      //显示监测机构信息
      const personInfo = getInfo.getPersonInfo(sessionManager.getUserDto().classification, sessionManager.getUserDto().id)
      personInfo.then((res) => {
        if (res[0] != "bad") {
          sessionManager.setUserInfo(res[0])
          this.setData({
            id: sessionManager.getUserDto().id,
            depart:sessionManager.getUserInfo().hospital,
            phone: sessionManager.getUserInfo().phone,
            isDoctor:2,
            classification:sessionManager.getUserDto().classification
          })
          
        }
      })
    }

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
  //管理员、医生退出登录
  userExit() {
    wx.removeStorageSync('statusInfo')
    wx.showToast({
      title: '已退出',
      icon: 'none',
      duration: 1200
    })
    var timeOut = setTimeout(function () {
      sessionManager.logout();
      wx.reLaunch({   //用reLaunch  销毁已经打开过的页面  相当于清除小程序的页面栈
        url: '../login/login'
      })
    }, 1200)
  },
  // 激活修改信息
  editorInfo() {
    this.setData({
      isDisabled: false
    })
  }
})