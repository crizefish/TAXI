const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    pathOfCar: app.globalData.GlobalIMG + 'alc@2x.png',
    aim: app.globalData.GlobalIMG + 'sy_dingwei@2x.png',
    getOnTheCar: app.globalData.GlobalIMG + 'sy_tixing@2x.png',
    chatImg: app.globalData.GlobalIMG + 'sy_tishi@2x.png',
    btn_user2x: app.globalData.GlobalIMG + "btn_user@2x.png",
    carSign: "/pages/common/img/car-sign.png",
    motto: '888',
    prePrices: '',
    distanceStr: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nicknameImg: app.globalData.GlobalIMG + "zc_touxiang_tx@2x.png",
    mycall: '',
    address:'',
    petname: '点击登录',
    TravelItinerary: app.globalData.GlobalIMG + "zx_xingcheng@2x.png",
    star: app.globalData.GlobalIMG + "pc_xx1@2x.png",
    tool: app.globalData.GlobalIMG + "zx_shezhi@2x.png",
    people: app.globalData.GlobalIMG + "pc_renshu@2x.png",
    timeImg: app.globalData.GlobalIMG + "pc_shijian@2x.png",
    aim:app.globalData.GlobalIMG + "pc_dingwei@2x.png",
    array: ['乘车人数','1','2','3','4','5','6','7'],
    index:0,
    step: "choice",
    multiArray:[["今天","明天","后天"], 
      ["1点", "2点", "3点", "4点", "5点", "6点", "7点", "8点", "9点", "10点", "11点", "12点", "13点", "14点", "15点", "16点", "17点", "18点", "19点", "20点", "21点", "22点", "23点","24点"],
      ["00分","01分","02分","03分","04分","05分","06分","07分","08分","09分","10分","11分","12分","13分","14分","15分","16分","17分","18分","19分","20分","21分","22分","23分","24分","25分","26分","27分","28分","29分","30分","31分","32分","33分","34分","35分","36分","37分","38分","39分","40分","41分","42分","43分","44分","45分","46分","47分","48分","49分","50分","51分","52分","53分","54分","55分","56分","57分","58分","59分"]
    ],
    time:'选择时间'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var fromAddressAll = wx.getStorageSync("from_address");
    var fromAddress = fromAddressAll.substring(0, fromAddressAll.indexOf("|||"));
    this.setData({
      address: fromAddress
    })
    // orders[i].toAddress = toAddress.length > 12 ? toAddress.substring(0, 12) + '...' : toAddress
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
  bindPickerChange:function(e){
    this.setData({
      index:e.detail.value
    })
  },
  bindMultiPickerChange:function(e){
    console.log(e)
    var index = e.detail.value;
    var multiArray = this.data.multiArray;
    //计算显示时间
    this.setData({
      time: multiArray[0][index[0]] + ' ' + multiArray[1][index[1]] + ' ' + multiArray[2][index[2]]
    })
  }
})