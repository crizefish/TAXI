
//获取应用实例
const app = getApp();
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.min.js');
var wxMarkerData = [];

Page({
  data: {
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    nowPosition: '您当前所在的位置',
    destination: '', // 目的地
    whereAreUGoing: '北京天安门',
    hiddenEgg:'show',
    timeWait: '2分钟后',
    pathOfCar: app.globalData.GlobalIMG + 'alc@2x.png',
    aim: app.globalData.GlobalIMG + 'sy_dingwei@2x.png',
    getOnTheCar: app.globalData.GlobalIMG + 'sy_tixing@2x.png',
    chatImg: app.globalData.GlobalIMG + 'sy_tishi@2x.png',
    btn_user2x: app.globalData.GlobalIMG + "btn_user@2x.png",
    motto: '888',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  // 绑定input输入 
  bindKeyInput: function (e) {
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: '9nxZMWueKmnnnGgrt6Ie7fR3EdjYTD6N'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      console.log(data)
      var sugResult = data.wxMarkerData;
      that.setData({
        sugResult: sugResult,
        hiddenEgg: 'hidden'
      });
    }
    // 发起suggestion检索请求 
    BMap.search({
      "query": e.detail.value,
      fail: fail,
      success: success,
      // 此处需要在相应路径放置图片文件 
      iconPath: '../../img/marker_red.png',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../img/marker_red.png'
    });
  } ,

  choiceAddress: function (e) {
    this.setData({
      hiddenEgg: 'hidden'
    })
  },


  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },

  showSearchInfo: function (data, i) {
    var that = this;
    that.setData({
      rgcData: {
        address: '地址：' + data[i].address + '\n',
        desc: '描述：' + data[i].desc + '\n',
        business: '商圈：' + data[i].business
      }
    });
  },
  //检查登陆状态
  checkLogin:function(e){
    var token = wx.getStorageSync('token');
    if (token == null || token == "") {
      wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/login/login"
      })
    }
  },

  choiceTarget:function (e){
    var item = e.currentTarget.dataset.item;
    console.log(e.currentTarget.dataset.location)
    this.setData({
      destination: item.title,
      sugResult:[]

    })
    //存储路线信息
    var from_location = this.data.latitude + "," + this.data.longitude;
    var from_address = this.data.desc + "|||" + this.data.address;
    var to_location = item.latitude + "," + item.longitude;
    var to_address = item.title + "|||" + item.address ;
    wx.setStorage({ key: "from_location", data: from_location});
    wx.setStorage({ key: "to_location", data: to_location});
    wx.setStorage({ key: "from_address", data: from_address});
    wx.setStorage({ key: "to_address", data: to_address });
    var token = wx.getStorageSync('token');
    if (token == null || token == "") {
      wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/login/login"
      })
    }
  },


  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }


    var that = this;
    var BMap = new bmap.BMapWX({
      ak: '9nxZMWueKmnnnGgrt6Ie7fR3EdjYTD6N'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
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


  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }


})
