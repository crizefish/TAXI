const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    getOnTheCar: app.globalData.GlobalIMG + 'sy_tixing@2x.png',
    kilometre:1,
    waitTime:1,
    pathOfCar: app.globalData.GlobalIMG + 'alc@2x.png', // 轿车
    nowPosition: app.globalData.GlobalIMG + 'sy_dingwei@2x.png', // 方向
    cancelTimeHours:'18',
    cancelTimeMinute:'02',
    driverImg: app.globalData.GlobalIMG + 'sy_jiejia_xiaoxi@2x.png',
    license:'沪12345',
    colorOfCar:'黑色',
    brand:'宝马',
    driver: app.globalData.GlobalIMG + 'sy_jiejia_touxiang@2x.png',
    driverName:'张师傅',
    star: app.globalData.GlobalIMG + 'sy_jiejia_xx1@2x.png',
    score:'5.0',
    phone: app.globalData.GlobalIMG + 'sy_jiejia_diahua@2x.png',
    phoneNumberOfDriver: '18321450000',
    callhim:false
  },

  // 点击打电话跳出模态框
  funcCall:function(){
    this.setData({
      callhim: true
    })
  },

  // 取消呼叫司机
  funcCancelCall: function() {
    this.setData({
      callhim: false
    })
  },

  //呼叫司机
  funcCallDriver:function() {
    
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