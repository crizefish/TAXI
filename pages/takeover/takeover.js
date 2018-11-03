const app = getApp()
var bmap = require('../../libs/bmap-wx.min.js');
var netWork = require('../../utils/netWork.js')
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
    phone: app.globalData.GlobalIMG + 'sy_jiejia_diahua@2x.png'

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

    // 倒计时
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
                  url: "/pages/paythefare/paythefare"
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
      }, 1000);
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