const app = getApp()
var netWork = require('../../utils/netWork.js')
var amapFile = require('../../libs/amap-wx.js');
var wxMarkerData = [];
var timer; // 计时器
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kilometre: 1,
    waitTime: 1,
    cancelTimeHours: '',
    cancelTimeMinute: '',
    license: '',
    colorOfCar: '',
    brand: '',
    driverName: '',
    score: '',
    driverMobile: '',
    orderStatus: 1,
    star: app.globalData.GlobalIMG + 'sy_jiejia_xx1@2x.png',
    driver: app.globalData.GlobalIMG + 'sy_jiejia_touxiang@2x.png',
    driverImg: app.globalData.GlobalIMG + 'sy_jiejia_xiaoxi@2x.png',
    pathOfCar: app.globalData.GlobalIMG + 'alc@2x.png', // 轿车
    nowPosition: app.globalData.GlobalIMG + 'sy_dingwei@2x.png', // 方向
    getOnTheCar: app.globalData.GlobalIMG + 'sy_tixing@2x.png',
    phone: app.globalData.GlobalIMG + 'sy_jiejia_diahua@2x.png',
    latitude: '',
    longitude: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 倒计时
    that.regeocoding();
    function Countdown() {
      //每过一秒请求一次接口
      timer = setTimeout(function() {
        netWork.paramsCB({
          "token": wx.getStorageSync('token'),
          "order_sn": wx.getStorageSync('order_sn')
        }, function(params) {
          netWork.httpPOST("/kcv1/user/orderDetail", params, function(res) {
            if (res.code == 0) {
              var orderStatus = res.data.result.order.order_status;
              //  -3 超时取消 -2 司机取消 -1 用户取消  0 发单 1 已抢单 2 到达乘客地点 3 接到乘客  4 到达目的地  5 发起收款  6 已确认付款
              if (orderStatus == 5) {
                wx.navigateTo({
                  url: "/pages/paythefare/paythefare?carType=kc"
                })
                clearTimeout(timer)
              }
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
                orderStatus: res.data.result.order.order_status
              });
            } else {
              // alertInfo(res.msg)
              clearTimeout(timer)
            }
          })
        })
        Countdown();
      }, 2000);
    };

    Countdown();
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
  callDriver: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.driverMobile
    })
  },


  confirmCancel: function() {
    wx.showModal({
      title: "确定取消订单吗",
      success: function(res) {
        if (res.confirm) {
          netWork.paramsCB({
            "token": wx.getStorageSync('token'),
            "order_sn": wx.getStorageSync('order_sn')
          }, function(params) {
            netWork.httpPOST("/kcv1/user/cancelOrder", params, function(res) {
              if (res.code == 0) {
                wx.showModal({
                  title: "取消订单成功",
                  success: function(res) {
                    if (res.confirm) {
                      clearTimeout(timer);
                      wx.navigateTo({
                        url: "/pages/index/index"
                      })
                    } else if (res.cancel) {
                      clearTimeout(timer);
                      wx.navigateTo({
                        url: "/pages/index/index"
                      })

                    }
                  }
                })
              } else {
                alertInfo(res.msg)
              }
            })
          })
        } else if (res.cancel) {
          console.log("用户放弃取消订单")
        }
      }
    })
  },
  regeocoding: function () {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: app.globalData.MapKey,
    });
    myAmapFun.getRegeo({
      success: function (data) {


        var city = data[0].regeocodeData.addressComponent.city;
        var province = data[0].regeocodeData.addressComponent.province;
        that.setData({
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          address: data[0].name,
          desc: data[0].desc,
          adcode: data[0].regeocodeData.addressComponent.adcode,
          city: city == '' ? province : city,
          // markers: [{
          //   id: 0,
          //   longitude: data[0].longitude,
          //   latitude: data[0].latitude,
          //   title: data[0].desc,
          //   iconPath: ''
          // }]
        });

        var from_location_gd = that.data.longitude + "," + that.data.latitude;
        var from_location = that.data.latitude + "," + that.data.longitude;
        var from_address = that.data.desc + "|||" + that.data.address;
        wx.setStorage({
          key: "from_location",
          data: from_location
        });
        wx.setStorage({
          key: "from_address",
          data: from_address
        });
        // wx.setStorage({
        //   key: "from_location",
        //   data: "31.19863667538746,121.60027899370256"
        // });
        //  wx.setStorage({
        //   key: "from_address",
        //   data: "上海浦东软件园祖冲之园-X座西南198米|||上海市浦东新区X620(金科路)"
        // });

        wx.setStorage({
          key: "from_location_gd",
          data: from_location_gd
        });

      },
      fail: function (info) {
        //失败回调
        console.log(info)
      }
    });
  },

})

function alertInfo(msg) {
  wx.showModal({
    title: msg,
    success: function(res) {
      if (res.confirm) {
        console.log('用户点击确认')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}