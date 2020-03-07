

// pages/nearbyHospital/nearbyHospital.js
const QQMapWX = require(
  '../../libs/qqmap-wx-jssdk.js'
)
// 导入城市信息
import data from './data'

import { hospitalsModel } from '../../models/hospitals.js'
let hospitals = new hospitalsModel()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseCity: "选择城市",
    options1: data,
    value1: [],
    pagesize: 10,//每页10条数据
    page: 0,//当前页
    hospitalLists: [],//医院列表
    totalItems: 0,//一共有多少条数据
    isBottom: false,//是否到底
    latitude: '',//当前的纬度
    longitude: '',//当前的经度
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.qqmapsdk = new QQMapWX({
      key: 'VRFBZ-ZXL6Q-O755I-GRXJH-YVOG2-AGFFH'
    })
    //获取最近医院的列表
    this.loadHospitals()


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
  //加载附近医院列表
  loadHospitals() {
    if (wx.getStorageSync('location')) {
      //欢迎页已获取到了位置
      let city = ""
      let location = wx.getStorageSync('location')
      let locationArray = location.split(',')
      this.setData({
        latitude: locationArray[1].trim(),
        longitude: locationArray[0].trim()
      })
      console.log(this.data.latitude)
      console.log(this.data.longitude.trim())
      //调用腾讯接口
      this.qqmapsdk.reverseGeocoder({
        location: {
          latitude: this.data.latitude,
          longitude: this.data.longitude
        },
        success: res => {
          city = res.result.address_component.city
          console.log(city) //打印城市名称
          this.setData({
            chooseCity: city
          })
          //从数据库获取附近医院列表
          this.loadList(this.data.latitude, this.data.longitude)

        },
        fail: res => {
          wx.showToast({
            title: '请手动选择',
            icon: 'loading',
            duration: 500
          });
          this.onOpen1();
        },
        complete: res => {
          console.log(res);
        }
      })
    } else {
      //欢迎页未获取到位置
      wx.showToast({
        title: '请手动选择',
        icon: 'loading',
        duration: 1000
      });
      this.onOpen1();
    }
  },
  //自动定位失败，开启级联选择器
  onOpen1() {
    this.setData({
      visible1: true,
      chooseCity: ""
    })
  },
  onClose1() {
    this.setData({ visible1: false })
    this.getLocation(this.data.title1)
    // let locationArray = location.split(',')
    // this.loadList(location.split(',')[0],location.split(',')[1])
  },
  onChange1(e) {
    console.log(e.detail.options)
    this.setData({ title1: e.detail.options.map((n) => n.label).join('') })

  },
  //高德逆地理解析
  loadCity: function (longitude, latitude) {
    var _self = this;
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        key: '9d5b98b0db63adb16c7db6c6d1454f9f',
        location: longitude + "," + latitude,
        extensions: "all",
        s: "rsx",
        sdkversion: "sdkversion",
        logversion: "logversion"

      },
      success: function (res) {
        console.log("高德-");
        console.log(res.data.regeocode.formatted_address);
      },
      fail: function (res) {
        console.log('获取地理位置失败')
      }
    })
  },
  //上拉加载
  onReachBottom: function () {
    //判断一共有几页
    let totalPage = (this.data.totalItems / this.data.pagesize)
    if (this.data.totalItems % this.data.pagesize != 0) {
      totalPage = (this.data.totalItems / this.data.pagesize) + 1
    }
    // page从0开始，所以+1，如果当前页不是最后一页，则继续加载
    if (this.data.page + 1 <= totalPage) {
      // 显示加载图标
      wx.showLoading({
        title: '加载中',
      })
      //加载列表
      this.loadList(this.data.latitude, this.data.longitude)
    } else {
      this.setData({
        isBottom: true
      })
    }
  },
  //计算两个位置之间的距离
  getDistance(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  },
  //加载附近医院列表
  loadList(latitude, longitude) {
    const hospitalLists = hospitals.getNearbyHospitals(latitude, longitude, this.data.page * this.data.pagesize, this.data.pagesize)
    hospitalLists.then((res) => {
      console.log(res)
      if (res.total != 0) {
        let oldLists = this.data.hospitalLists
        let oldPage = this.data.page
        this.setData({
          hospitalLists: oldLists.concat(res.data),
          page: oldPage + 1,
          totalItems: res.total
        })
        //隐藏加载框
        wx.hideLoading()
        //计算距离
        for (let i = 0; i < this.data.hospitalLists.length; i++) {
          let index = `hospitalLists[${i}].distance`
          let distance = (this.getDistance(this.data.hospitalLists[i].latitude, this.data.hospitalLists[i].longitude, latitude, longitude)).toFixed(1)
          this.setData({
            [index]: distance
          })
        }
      } else {
        wx.showToast({
          title: '没有数据',
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //腾讯地理解析
  getLocation(geocoder) {
    console.log("调用地理解析" + geocoder)
    //调用地址解析接口
    var latitude = ""
    var longitude = ""
    this.qqmapsdk.geocoder({
      //获取表单传入地址
      address: geocoder, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: (res) => {//成功后的回调
        console.log(res);
        var res = res.result;
        latitude = res.location.lat;
        longitude = res.location.lng;
        wx.setStorageSync('location', `${latitude},${longitude}`)
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: (res) => {
        console.log(res);
        this.loadList(latitude, longitude)
      }
    })
  },
  // 导航
  navigation(options) {
    console.log(options.currentTarget.dataset.addr)
    //地理解析
    var latitude = ""
    var longitude = ""
    this.qqmapsdk.geocoder({
      //获取表单传入地址
      address: options.currentTarget.dataset.addr, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: (res) => {//成功后的回调
        console.log(res);
        var res = res.result;
        latitude = res.location.lat;
        longitude = res.location.lng;
        console.log("纬度"+latitude)
        //打开微信内置地图
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          scale: 28,
          name: options.currentTarget.dataset.addr, //打开后显示的地址名称
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: (res) => {
        console.log(res);
      }
    })
  }
})