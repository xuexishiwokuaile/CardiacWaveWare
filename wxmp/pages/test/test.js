// pages/test/test.js
import F2 from '../../components/f2-canvas/lib/f2';


import { analysisModel } from '../../models/analysis.js'
let analysis = new analysisModel()

let chart = null;

function initChart(canvas, width, height) { // 使用 F2 绘制图表
  //从数据库获取数据
  var testAnalysis = [];
  const analysisRes = analysis.getUserAnalysis()
  analysisRes.then((res) => {
    testAnalysis = res.data.split("\r\n");
    console.log(testAnalysis.length);
    console.log(res);


    // 自定义线图变更动画 
    F2.Animate.registerAnimation('lineUpdate', function (updateShape, animateCfg) {
      var cacheShape = updateShape.get('cacheShape'); // 该动画 shape 的前一个状态
      var cacheAttrs = cacheShape.attrs; // 上一个 shape 属性
      var oldPoints = cacheAttrs.points; // 上一个状态的关键点
      var newPoints = updateShape.attr('points'); // 当前 shape 的关键点

      var oldLength = oldPoints.length;
      var newLength = newPoints.length;
      var deltaLength = newLength - oldLength;

      var lastPoint = newPoints[newPoints.length - 1];
      for (var i = 0; i < deltaLength; i++) {
        oldPoints.push(lastPoint);
      }

      updateShape.attr(cacheAttrs);
      updateShape.animate().to({
        attrs: {
          points: newPoints
        },
        duration: 800,
        easing: animateCfg.easing
      });
    });
    var data = [];
    // 添加数据，模拟数据，可以指定当前时间的偏移的秒
    function getRecord(offset, i) {
      offset = offset || 0;
      return {
        time: new Date().getTime() + offset * 1,
        value: testAnalysis[i] / 1000
      };
    }

    data.push(getRecord(-2));
    data.push(getRecord(-1));
    data.push(getRecord());

    var chart = new F2.Chart({
      el: canvas,
      width,
      height
    });

    //定义x和y轴，time为x轴，value为y轴
    var defs = {
      time: {
        type: 'timeCat',
        mask: 'HH:mm:ss',
        range: [0, 3]
      },
      value: {
        tickCount: 8,  //区间数量，比如tickCount=2，表示y轴有两个区间，如[0,5]、[5,10]
        min: -12,      //最小值&最大值
        max: 9
      }
    };
    chart.source(data, defs);
    chart.axis('time', {
      label: function label(text, index, total) {
        var textCfg = {
          text: ''
        };
        if (index === 0) {
          textCfg.textAlign = 'left';
          textCfg.text = text;
        } else if (index === total - 1) {
          textCfg.textAlign = 'right';
          textCfg.text = text;
        }
        return textCfg;
      }
    });

    chart.line().position('time*value').animate({
      update: {
        animation: 'lineUpdate'
      }
    });

    chart.render();

    var i = 0;
    var interval = setInterval(function () {
      console.log(getRecord(null, i));
      data.push(getRecord(null, i));
      chart.changeData(data);
      console.log("i=" + i + "=testAnalysis.length=" + testAnalysis.length)
      i++;
      if (i > testAnalysis.length - 1) {
        clearInterval(interval);
      }
    }, 10);

    //模拟实时监测，25秒后停止
    // var timeOut = setTimeout(function(){
    //   clearInterval(interval);
    // },25000)

    return chart;
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    opts: {
      onInit: initChart
    },
    testAnalysis: []
  },

  onResize: function (res) {
    res.size.windowWidth // 新的显示区域宽度
    res.size.windowHeight // 新的显示区域高度
    console.log(res.size.windowWidth);
    console.log(res.size.windowHeight);
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

  }
})