// pages/report/report.js
import { reportModel } from '../../models/report.js'
let report = new reportModel()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clientName:'',//病人的姓名
    clientid:'',//当前病人的id
    reportId:0,//id,从我的报告传入进来
    time:'',//报告时间
    totalpeak:0,//总峰值
    quantitativepeak:0,//定量峰值
    distributionone:0,//极性1
    distributiontwo:0,
    distributionthree:0,
    distributionfour:0,
    distributionfive:0,
    distributionsix:0,
    peakConclusion:0,//峰值结论的序号 1 表示 阴性 ....
    distributionConclusion:0,//极性结论  1 表示 阴性....
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 表示当前这个页面  是从  历史病例  列表   点击进来的
    if(options.hideHistoryBtn != undefined){
      this.setData({
        reportId:options.id,
        hideHistoryBtn:options.hideHistoryBtn
      })
    }else{
      this.setData({
        reportId:options.id,
        clientid:options.clientid,
        clientName:options.clientName,
      })
    } 
    // console.log("传入的ID="+options.id)
    // console.log("传入的病人id="+options.clientid)
    const analysisInfo = report.getAnalysisInfo(options.id,'')
    analysisInfo.then((res)=>{
      console.log(res[0])
      if(res != undefined){
        // 更新数据，并保证前4个极性加起来一共100%
        this.setData({
          time:res[0].time,
          quantitativepeak:res[0].quantitativepeak,
          totalpeak:res[0].totalpeak,
          distributionone:(res[0].distributionone*100).toFixed(0),
          distributiontwo:(res[0].distributiontwo*100).toFixed(0),
          distributionthree:(res[0].distributionthree*100).toFixed(0),
          distributionfour:(100-parseInt((res[0].distributionone*100).toFixed(0))-parseInt((res[0].distributiontwo*100).toFixed(0))-parseInt((res[0].distributionthree*100).toFixed(0))),
          distributionfive:(res[0].distributionfive*100).toFixed(0),
          distributionsix:(res[0].distributionsix*100).toFixed(0)
        })
        //判断峰值结论
        if(parseInt(this.data.quantitativepeak) < 60000){
          // console.log("阴性")
          this.setData({
            peakConclusion:1
          })
        }else if(parseInt(this.data.quantitativepeak) < 100000){
          // console.log("心肌疲劳预警")
          this.setData({
            peakConclusion:2
          })
        }else if(parseInt(this.data.quantitativepeak) < 150000){
          // console.log("冠脉粥样硬化风险")
          this.setData({
            peakConclusion:3
          })
        }else{
          // console.log("冠脉粥样硬化")
          this.setData({
            peakConclusion:4
          })
        }
        //判断极性结论
        if(parseInt(this.data.distributionfour)>17 || parseInt(this.data.distributionfive)>15|| parseInt(this.data.distributionsix)>19){
          this.setData({
            distributionConclusion:2
          })
        }else{
          //阴性
          this.setData({
            distributionConclusion:1
          })
        }
      }else{
        wx.showToast({
          title: '错误',
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
    return {
      title: '我分享了个检查结果，快来看看吧。',
      path: '/pages/shareReport/shareReport?reportId='+this.data.reportId, 
      imageUrl: 'https://6a69-jiayukeji-6c6ff0-1258462011.tcb.qcloud.la/cardiacWave/%E5%8C%BB%E7%96%97%E5%81%A5%E5%BA%B7.png?sign=4e43ebc3d1547dc30faba13eca9c51b4&t=1562589276',
      success: function (res) { }
    }
  },
  //跳转至历史病例
  goHistoryReport(){
    wx.navigateTo({
      url: `/pages/historyReport/historyReport?clientid=${this.data.clientid}&&clientName=${this.data.clientName}`
    })
  }
})