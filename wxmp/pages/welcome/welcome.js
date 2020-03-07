// pages/welcome/welcome.js
import { SysLog } from '../../models/system/sysLog'
let sysLog = new SysLog();

//相应的session操作类
import {SessionManager} from '../../models/system/sessionManager'
let sessionManager = new SessionManager();

//加载相应的登录信息
import { LoginModel } from '../../models/login.js'
let login = new LoginModel()

// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
var qqmapsdk;

//获取应用实例
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //初始化环境
    this.init()

    //获取定位，获取到定位信息了，才继续，否则始终不进入登录/主页
    this.getSetting()

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'U2MBZ-EULEF-MZMJX-JXA4V-2EDTS-4ZFSQ'
    });
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

  /**
   * 初始化相应的环境
   */
  init(){
    sessionManager.setUserId('');
    sessionManager.setUserToken('');
  },

  //用户登录状态
  loginStatus() {
    let userDto = sessionManager.getUserDto();
    console.log(userDto)
    if(userDto)
    {
      wx.showToast({
        title: '欢迎回来',
        icon: 'none',
        duration: 1000
      })

      //默认获取相应的信息
      login.loginBySys(userDto.loginName, userDto.passwd).then(res=>{
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
          const arrays = res.split('$_@_$');
          if(arrays.length >= 5){
            const userId = arrays[0].replace('userId=', '');
            const userToken = arrays[1].replace('userToken=', '');

            //存入相应的内存当中
            sessionManager.setUserId(userId)
            sessionManager.setUserToken(userToken)
          }
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
    else{
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 1500
      })

      var timeOut = setTimeout(function(){
        wx.redirectTo({
          url: '../login/login'
        })
      },1500)
    }
  },
  //获取用户定位授权
  getSetting() {
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
        console.log(res.authSetting['scope.userLocation'])
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] == false) {
          //用户非第一次进入小程序，且  (第一次)没有授权  ->  获取用户授权
          wx.showModal({
            title: '请求授权当前位置',
            content: '小程序需要获取您的地理位置才可以使用，请确认授权',
            success: (res) => {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: (dataAu) => {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      // wx.showToast({
                      //   title: '授权成功',
                      //   icon: 'success',
                      //   duration: 1000
                      // })
                      //再次授权成功，获取用户地理位置
                      this.getLocation()
                    } else {
                      wx.showToast({
                        title: '授权失败，请重新授权',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //用户第一次进入该页面   ->  获取授权
          this.getLocation()
        } else {
          //用户已经授权   ->  直接获取地理位置
          this.getLocation()
        }
      }
    })
  },
  //获取用户定位
  getLocation() {
    let userInfo = this.data.userInfo;
    //定位
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(`${res.longitude},${res.latitude}`)
        //保存有效位置信息
        wx.setStorageSync('location', `${res.longitude},${res.latitude}`)

        //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            const address = addressRes.result.formatted_addresses.recommend;
            let userName = '新微信用户';
            const userDto = sessionManager.getUserDto();
            //有获取到相应的用户信息,直接使用用户信息
            if(userDto!=null){
              // userName = userInfo.nickName
              userName = userDto.name;
            }
            else if(userInfo.nickName){
              userName = userDto.name;
            }
            //向后台写入日志
            sysLog.log('login', userName,res.longitude, res.latitude, address)
          }
        })

        //判断是否登录->状态是否有效
        this.loginStatus()
      },
      fail: (error) => {
        //保存未知位置信息
        wx.setStorageSync('location', '未知')
        let str = "获取位置失败，请同意授权或开启GPS"
        wx.showToast({
          title: str,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },



})