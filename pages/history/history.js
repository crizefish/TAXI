//index.js
//获取应用实例
const app = getApp()
var netWork = require('../../utils/netWork.js')
var util = require('../../utils/util.js') //引入微信自带的日期格式化
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timerImg: app.globalData.GlobalIMG + 'sy_yuyue_shijian@2x.png',
    aimImg: app.globalData.GlobalIMG + 'sy_dingwei@2x.png',
    orderType: 'express',
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "page": 0
    }, function(params) {
      netWork.httpPOST("/kcv1/user/tripList", params, function(res) {
        var orders = res.data.result;
        for (var i = 0; i < orders.length; i++) {
          orders[i].addTime = util.formatTime(orders[i].add_time, 'Y年M月D日 h:m');
          var fromAddressAll = orders[i].from_address;
          var toAddressAll = orders[i].to_address;
          var fromAddress = fromAddressAll.substring(0, fromAddressAll.indexOf("|||"))
          var toAddress = toAddressAll.substring(0, toAddressAll.indexOf("|||"))
          orders[i].fromAddress = fromAddress.length > 12 ? fromAddress.substring(0, 12) + '...' : fromAddress
          orders[i].toAddress = toAddress.length > 12 ? toAddress.substring(0, 12) + '...' : toAddress
        }
        that.setData({
          orders: orders
        })

      })
    })


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  toDeal: function(e) {
    var that = this;
    var url = '';
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var order_sn = that.data.orders[index].order_sn;
    var order_status = that.data.orders[index].order_status;
    wx.setStorage({
      key: "order_sn",
      data: order_sn
    });
    //待支付
    if (order_status == 5)
      url = "/pages/paythefare/paythefare";
    //行程中
    if (order_status == 0)
      url = "/pages/waitting/waitting";
    //1 已抢单 2 到达乘客地点 3 接到乘客  4 到达目的地  
    if (order_status == 1 || order_status == 2 || order_status == 3 || order_status == 4)
      url = "/pages/takeover/takeover";
    wx.navigateTo({
      url: url,
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})