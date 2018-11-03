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
    desc: null,
    allResult:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.searchResult('上海');
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
    var that = this;
    var index = e.currentTarget.dataset.index;
    var choiceResult = that.data.allResult[index];
    wx.setStorage({
      key: "route_id",
      data: choiceResult.route_id
    });
    var token = wx.getStorageSync('token');
    if (token == null || token == "") {
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/login/login"
      })
    } else {
      wx.navigateTo({
        url: "/pages/index/index?carflag=2"
          + "&from_city=" + choiceResult.from_city
          + "&from_address=" + choiceResult.from_address
          + "&to_city=" + choiceResult.to_city
          + "&to_address=" + choiceResult.to_address
          + "&fare=" + choiceResult.fare
      })
    }
  },
  bindKeyInput: function(e) {
    var that = this;
    //获取起点
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "to_keyword": e.detail.value
    }, function (params) {
      netWork.httpPOST("/kcv1/user/searchRoute", params, function (res) {
        that.setData({
          allResult: res.data.result
        })
        console.log(that.data.allResult)
      })
    })
  },

  searchResult: function(str) {
    var that = this;
    //根据起点搜索
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "from_keyword": str
    }, function (params) {
      netWork.httpPOST("/kcv1/user/searchRoute", params, function (res) {
        that.setData({
          allResult: res.data.result
        })
        console.log(that.data.allResult)
      })
    })

  },
  toIndex:function(){
    wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "/pages/index/index"
    })
  }
})