// pages/paythefare/paythefare.js
const app = getApp()
var netWork = require('../../utils/netWork.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    license: '',
    driverName: '',
    currentPos: '',
    destination: '',
    howmuch: '',
    startingPrice: '',
    mileage:'',
    minute: 0.0,
    kmFee:0.0,
    timeFee: 0.0,
    driver: app.globalData.GlobalIMG + 'sy_jiejia_touxiang@2x.png',
    callDriver: app.globalData.GlobalIMG + 'sy_fufei_diahua@2x.png',
    balancePayment: app.globalData.GlobalIMG + 'sy_fufei_yue@2x.png',
    wechatPayment: app.globalData.GlobalIMG + 'sy_fufei_weixin@2x.png',
    alipayPayment: app.globalData.GlobalIMG + 'sy_fufei_zhifubao@2x.png',
    selected: app.globalData.GlobalIMG + 'sy_fufei_xuanzhong@2x.png',
    select: app.globalData.GlobalIMG + 'sy_fufei_hui@2x.png',
    payType:'balance'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "order_sn": wx.getStorageSync('order_sn')
    }, function (params) {
      netWork.httpPOST("/kcv1/user/orderDetail", params, function (res) {
        var orderStatus = res.data.result.order.order_status;
        var fromAddressAll = res.data.result.order.from_address;
        var toAddressAll = res.data.result.order.to_address;
        var fromAddress = fromAddressAll.substring(0, fromAddressAll.indexOf("|||"))
        var toAddress = toAddressAll.substring(0, toAddressAll.indexOf("|||"))
        that.setData({
          kilometre: res.data.result.order.distance,
          cancelTimeHours: '18',
          cancelTimeMinute: '02',
          license: res.data.result.driver_info.car_plate,
          colorOfCar: res.data.result.driver_info.car_color,
          brand: res.data.result.driver_info.car_brand,
          driverName: res.data.result.driver_info.nickname,
          score: res.data.result.driver_info.rank,
          driverMobile: res.data.result.driver_info.mobile,
          orderStatus: res.data.result.order.order_status,
          currentPos: fromAddress.length > 20 ? fromAddress.substring(0, 20) + '...' : fromAddress,
          destination: toAddress.length > 20 ? toAddress.substring(0, 20) + '...' : toAddress,
          howmuch: res.data.result.order.order_amount,
          startingPrice: res.data.result.order.start_fee,
          mileage: res.data.result.order.distance,
          minute: res.data.result.order.minute,
          kmFee: res.data.result.order.km_fee,
          timeFee: res.data.result.order.time_fee,
        });
      })

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
  choicePayType:function(payType){
    var that = this;
    that.setData({
      payType: payType.currentTarget.id
    })
  },
  pay : function(){
    var that = this;
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "order_sn": wx.getStorageSync('order_sn'),
      "pay_type" : that.data.payType
    }, function (params) {
      netWork.httpPOST("/kcv1/user/pay", params, function (res) {
          console.log(res)
        if (res.code==0){
          wx.showModal({
            title: "支付成功",
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/gameover/gameover"
                })
              } else if (res.cancel) {
                wx.navigateTo({
                  url: "/pages/gameover/gameover"
                })
              }
            }
          })
        }else{
          wx.showModal({
            title: res.msg,
            content: '',
          })
        }
      })
    })
  }
})