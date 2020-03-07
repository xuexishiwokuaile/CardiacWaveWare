// pages/navigation/navigation.js
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
  // 主页
  index() {
    wx.navigateTo({
      url: '../index/index',
    })
  },
  //用户注册 
  userReg(){
    wx.navigateTo({
      url: '../register/register?isUserReg=true',
    })
  },
  //监测员注册
  doctorReg(){
    wx.navigateTo({
      url: '../register/register?isUserReg=false',
    })
  },
  //附近医院
  nearHos(){
    wx.navigateTo({
      url: '../nearbyHospital/nearbyHospital',
    })
  },
  //用户端报告
  report(){
    wx.navigateTo({
      url: '../report/report',
    })
  },
  //历史报告
  historyRep(){
    wx.navigateTo({
      url: '../historyReport/historyReport',
    })
  },
  //心康社区
  comm(){
    wx.navigateTo({
      url: '../community/community',
    })
  },
  //用户管理
  userMa(){
    wx.navigateTo({
      url: '../userManage/userManage',
    })
  },
  //个人中心
  center(){
    wx.navigateTo({
      url: '../personalCenter/personalCenter',
    })
  },
  //心脏监测
  cardiac(){
    wx.navigateTo({
      url: '../cardiacMonitoring/cardiacMonitoring',
    })
  }
})