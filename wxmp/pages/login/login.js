// pages/login/login.js
import { LoginModel } from '../../models/login.js'
let login = new LoginModel()

import {UserDto} from '../../models/dto/userDto'
let userDto = new UserDto();

import {SessionManager} from '../../models/system/sessionManager'
let sessionManager = new SessionManager();


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  formSubmit(e) {
    // console.log('登录事件，携带数据为：', e.detail.value)
    if (e.detail.value.userName == "" || e.detail.value.pwd == "") {
      wx.showToast({
        title: '请输入用户名和密码',
        icon: 'none',
        duration: 1000
      })
      return
    } else {
      //通过系统登录相应的系统
      login.loginBySys(e.detail.value.userName, e.detail.value.pwd).then(res=>{
        //如果返回值失败哪么进行进行
        if(res.indexOf('failed') == 0)
        {
          wx.showToast({
            title: '错误的用户名或密码!请重试。',
            icon: 'none',
            duration: 1500,
          });
          return;
        }
        //如果正确记录相应的登录信息
        else if (res.indexOf('userId') == 0){
          //将相应的登录信息进行保存
          const userDto2 = userDto.transFromLoginRetun(res, e.detail.value.pwd)
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
        }
        else{
          wx.showToast({
            title: '错误的用户名或密码!请重试。',
            icon: 'none',
            duration: 1500,
          });
          return;
        }
      });
    }
  },
  //跳转至注册
  toRegister() {
    wx.navigateTo({
      url: '../register/register'
    })
  },
})