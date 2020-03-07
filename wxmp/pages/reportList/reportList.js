// pages/reportList/reportList.js
import { reportModel } from '../../models/report.js'
let report = new reportModel()  

import { SessionManager } from '../../models/system/sessionManager'
let sessionManager = new SessionManager()


Page({

  /** 
   * 页面的初始数据
   */
  data: {
    page: 0, //当前页
    totalItems: '',//总共有多少条数据
    isChecked: false,//默认加载未检查列表
    classification: '',//权限
    hospital: '',//医院名称
    keyword: '',//搜索关键字
    clientid: '',//病人的ID
    number_per_page: 10,//默认显示10条
    items: [],//存放lists
    isBottom: false,//是否到底部了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let classification = ''
    if (sessionManager.getUserDto()) {
      classification = sessionManager.getUserDto().classification
      if (classification == 1) {
        // 管理员,更新data
        this.setData({
          classification: classification
        })
      } else if (classification == 2) {
        // 当前登陆者是：监测机构, 更新data
        this.setData({
          hospital: sessionManager.getUserInfo().hospital,
          classification: classification
        })
      } else {
        // 病人,更新data
        this.setData({
          clientid: sessionManager.getUserDto().id,
          classification: classification
        })
      }
      //加载列表
      this.loadList()
    }
  },
  //加载列表
  loadList() {
    //加载列表
    const reportLists = report.getReportLists(this.data.classification, this.data.hospital, this.data.isChecked, this.data.keyword, this.data.clientid, this.data.page, this.data.number_per_page)
    reportLists.then((res) => {
      // console.log("加载了一次数据")
      // console.log(res)
      if (res.data != undefined) {
        let oldData = this.data.items
        let oldPage = this.data.page
        this.setData({
          items: oldData.concat(res.data),
          totalItems: res.totalItems,
          page: oldPage + 1
        })
        //隐藏加载框
        wx.hideLoading()
      } else {
        //隐藏加载框
        wx.hideLoading()
        wx.showToast({
          title: '没有数据',
          icon: 'none',
          duration: 1000
        })
      }
    })
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

  //上拉加载
  onReachBottom: function () {
    //判断一共有几页
    let totalPage = (this.data.totalItems / this.data.number_per_page)
    if (this.data.totalItems % this.data.number_per_page != 0) {
      totalPage = (this.data.totalItems / this.data.number_per_page) + 1
    }
    // page从0开始，所以+1，如果当前页不是最后一页，则继续加载
    if (this.data.page + 1 <= totalPage) {
      // 显示加载图标
      wx.showLoading({
        title: '加载中',
      })
      //加载列表
      this.loadList()
    } else {
      this.setData({
        isBottom: true
      })
    }
  },
  //切换 检查 未检查 列表
  switchCheck() {
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    let oldIsChecked = this.data.isChecked
    this.setData({
      isChecked: oldIsChecked == false ? true : false,
      page: 0,
      keyword: '',
      totalItems: '',
      items: [],
      isBottom: false,
    })
    //加载列表
    this.loadList()
    //隐藏加载框
    // wx.hideLoading()
  },
  //搜索
  search(e) {
    // 显示加载图标
    wx.showLoading({
      title: '加载中',
    })
    console.log('search=', e.detail.value)
    this.setData({
      keyword: e.detail.value,
      page: 0,
      totalItems: '',
      items: [],
      isBottom: false,
    })
    //加载列表
    this.loadList()
  },
  //取消搜索
  cancel() {
    this.setData({
      page: 0,
      keyword: '',
      totalItems: '',
      items: [],
      isBottom: false,
    })
    //加载列表
    this.loadList()
  }
})