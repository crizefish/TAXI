// pages/paythefare/paythefare.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    license: '沪12345',
    driver: app.globalData.GlobalIMG + 'sy_jiejia_touxiang@2x.png',
    driverName: '张师傅',
    callDriver: app.globalData.GlobalIMG + 'sy_fufei_diahua@2x.png',
    currentPos: '酒红超市',
    destination: '大厦',
    howmuch: '14.52',
    startingPrice: '21',
    mileage:'3.80',
    minute: 21,
    BalancePayment: app.globalData.GlobalIMG + 'sy_fufei_yue@2x.png',
    wechatPayment: app.globalData.GlobalIMG + 'sy_fufei_weixin@2x.png',
    alipayPayment: app.globalData.GlobalIMG + 'sy_fufei_zhifubao@2x.png',
    selected: app.globalData.GlobalIMG + 'sy_fufei_xuanzhong@2x.png',
    select: app.globalData.GlobalIMG + 'sy_fufei_hui@2x.png',
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