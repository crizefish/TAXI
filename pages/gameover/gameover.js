// pages/gameover/gameover.js
const app = getApp();
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.min.js');
var netWork = require('../../utils/netWork.js');
var wxMarkerData = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers: [],
    close: app.globalData.GlobalIMG + 'sy_pingjia_guanbi@2x.png',
    yellow: app.globalData.GlobalIMG + 'sy_pingjia_xx1@2x.png',
    gray: app.globalData.GlobalIMG + 'sy_pingjia_xx@2x.png',
    doneSign: app.globalData.GlobalIMG + 'sy_pingjia_dui@2x.png',
    islight: '',
    starNum: 5,
    light: '',
    otherInfo: '',
    content: 'before',
    praise: [{
        tell: '比较差劲，急待改进'
      },
      {
        tell: '一般偏差，有待改进'
      },
      {
        tell: '一般满意，需要改进'
      },
      {
        tell: '比较满意，继续努力'
      },
      {
        tell: '非常满意，无可挑剔'
      },
    ],
  },

  praiseMe() {
    this.setData({
      light: true
    })
  },

  changeStarNum: function(e) {
    var index = e.currentTarget.dataset.index + 1;
    this.setData({
      starNum: index
    })
  },
  changeIsLight: function(e) {
    var name = e.currentTarget.id;
    this.setData({
      islight: name
    })
  },
  otherInfoInput: function(e) {
    this.setData({
      otherInfo: e.detail.value
    })
  },

  toLogin: function() {
    wx.navigateTo({
      url: "/pages/index/index"
    })
  },
  commitEvaluate: function() {
    var that = this;
    if (this.data.starNum == 0) {
      wx.showModal({
        title: '请给司机打分',
        content: '',
      })
      return;
    }

    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "order_sn": wx.getStorageSync('order_sn'),
      "rank": this.data.starNum,
      "comment": this.data.islight + "|" + this.data.otherInfo
    }, function(params) {
      netWork.httpPOST("/kcv1/user/comment", params, function(res) {
        that.setData({
          content: 'after'
        })
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: '9nxZMWueKmnnnGgrt6Ie7fR3EdjYTD6N'
    });
    var fail = function(data) {
      console.log(data)
    };
    var success = function(data) {
      wxMarkerData = data.wxMarkerData;
      console.log(data.wxMarkerData)
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude,
        longitude: wxMarkerData[0].longitude,
        address: wxMarkerData[0].address,
        desc: wxMarkerData[0].desc
      });
    }
    BMap.regeocoding({
      fail: fail,
      success: success,
      // iconPath: '../../img/marker_red.png',
      // iconTapPath: '../../img/marker_red.png'
    });

  },

  toIndex :function(){
    wx.navigateTo({
      url: "/pages/index/index"
    })
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

  }
})