//index.js


//相应的session控制类
import { SessionManager } from '../../models/system/sessionManager'
let sessionManager = new SessionManager()


//获取应用实例 
const app = getApp()

Page({
  data: {
    isDoctor: 3,   //区分 普通用户和医生 -> 前端是否显示  用户列表  3代表普通用户
  },

  onLoad: function () {
    //console.log(sessionManager.getUserDto().classification)
    //判断是否登录
    sessionManager.checkLogin()
  },
  //跳转至个人中心
  toCenter() {
    wx.navigateTo({
      url: '../personalCenter/personalCenter'
    })
  },
  //跳转到我的报告
  toReport() {
    wx.navigateTo({
      url: '../reportList/reportList'
    })
  },
  //跳转到社区
  toCommunity(){
    wx.navigateTo({
      url:'../community/community'
    })
  },
  //跳转到附近医院
  toHospital(){
    wx.navigateTo({
      url:'../nearbyHospital/nearbyHospital'
    })
  },
  //跳转到商城
  toShop(){
    wx.navigateTo({
      url:'../shop/shop'
    })
  }
})
