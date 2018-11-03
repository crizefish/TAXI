//获取应用实例
const app = getApp();
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.min.js');
var netWork = require('../../utils/netWork.js');
var amapFile = require('../../libs/amap-wx.js');
var wxMarkerData = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sugResult: [],
    latitude: null,
    longitude: null,
    address: null,
    desc: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.searchResult();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },
  choiceTarget: function(e) {
    var item = e.currentTarget.dataset.item;
    console.log(e.currentTarget.dataset.location)
    this.setData({
      sugResult: []

    })

    //存储路线信息
    var to_location_gd = item.location;
    var str = to_location_gd.split(",");
    var to_location = str[1]+','+str[0]
    var to_address = item.name + "|||" + item.address;

    wx.setStorage({
      key: "to_location",
      data: to_location 
    });
    wx.setStorage({
      key: "to_address",
      data: to_address
    });

    wx.setStorage({
      key: "to_location_gd",
      data: to_location_gd
    });
    // wx.setStorage({
    //   key: "from_location",
    //   data: "31.19863667538746,121.60027899370256"
    // });
    // wx.setStorage({
    //   key: "to_location",
    //   data: "31.200241933556,121.60184933499"
    // });
    // wx.setStorage({
    //   key: "from_address",
    //   data: "上海浦东软件园祖冲之园-X座西南198米|||上海市浦东新区X620(金科路)"
    // });
    // wx.setStorage({
    //   key: "to_address",
    //   data: "印语复印打印店|||上海市浦东新区晨晖路浦东软件园W2座底层"
    // });
    var token = wx.getStorageSync('token');
    if (token == null || token == "") {
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/login/login"
      })
    } else {
      wx.navigateTo({
        url: "/pages/index/index?carflag=1"
      })
    }
  },
  bindKeyInput: function(e) {
    console.log("e", e.detail.value)
    if (e.detail.value == null || e.detail.value == '') {
      return;
    }
    this.searchResult(e.detail.value)
  },

  searchResult: function(str) {
    var that = this;
    // var key = config.Config.key;
    var myAmapFun = new amapFile.AMapWX({
      key: '4f3444ea6fce9a52d068cb97c9f3faf5'
    });
    myAmapFun.getInputtips({
      keywords: str,
      location: '',
      success: function(data) {
        if (data && data.tips) {
          console.log(data)
          that.setData({
            sugResult: data.tips
          });
        }
      }
    })

  },
  toIndex:function(){
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/index/index"
    })
  }
})