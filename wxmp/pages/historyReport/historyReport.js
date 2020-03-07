// pages/historyReport/historyReport.js
import { reportModel } from '../../models/report.js'
let report = new reportModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientid:'',//病人的id
    clientName:'',//病人的姓名
    items:[],//存放历史病例
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("病人id="+options.clientid)
    this.setData({
      clientid:options.clientid,
      clientName:options.clientName
    })
    const analysisInfo = report.getAnalysisInfo('',options.clientid)
    analysisInfo.then((res)=>{
      console.log(res)
      if(res != undefined){
        this.setData({
          items:res
        })
      }
      
      for(let i=0;i<this.data.items.length;i++){
        console.log(this.data.items[i])
        //判断峰值结论
        if(parseInt(this.data.items[i].quantitativepeak) < 60000){
          // console.log("阴性")
        }else if(parseInt(this.data.items[i].quantitativepeak) < 100000){
          // console.log("心肌疲劳预警")
          // this.data.items[i].push({conclusion:'阳性，心肌疲劳预警（请保持良好生活作息）'})
        }else if(parseInt(this.data.items[i].quantitativepeak) < 150000){
          // console.log("冠脉粥样硬化风险")
          // this.data.items[i].push({conclusion:'阳性，心血管冠状粥样硬化风险（请到医院进行检查）'})
        }else{
          // console.log("冠脉粥样硬化")
          // this.data.items[i].push({conclusion:'阳性，心血管冠状粥样硬化，冠脉血液呈50%以下改变（紧急医院检查）'})
        }
        console.log(this.data.items[i])
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
  //点击查看报告
  showReport(options){
    let reportid = options.currentTarget.dataset.reportid
    console.log("病例的id="+reportid)
    wx.navigateTo({
      url: `/pages/report/report?id=${reportid}&hideHistoryBtn=true`
    })
  }
})