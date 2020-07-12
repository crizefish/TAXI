const app = getApp();
var bmap = require('../../libs/bmap-wx.min.js');
var netWork = require('../../utils/netWork.js')
var wxMarkerData = [];
Page({
  /**
   * 页面的初始数据
   */
  data: {
    getOnTheCar: app.globalData.GlobalIMG + 'sy_tixing@2x.png',
    waittingTime:'00:25',
    seconds: 0,
    time: '00:00:00',
    cost: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
  

    //倒计时
    timing(this);
    charging(this);
    //用户发单
   
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
  confirmCancel: function () {
    wx.showModal({
      title: "确定取消订单吗",
      success: function (res) {
        if (res.confirm) {
          netWork.paramsCB({
            "token": wx.getStorageSync('token'),
            "order_sn": wx.getStorageSync('order_sn')
          }, function (params) {
            netWork.httpPOST("/kcv1/user/cancelOrder", params, function (res) {
              if (res.code == 0) {
                wx.showModal({
                  title: "取消订单成功",
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: "/pages/index/index"
                      })
                    } else if (res.cancel) {
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
function timing(that) {
  var seconds = that.data.seconds
  if (seconds > 21599) {
    that.setData({
      time: '6小时，不想继续了gg'
    });
    return;
  }
  setTimeout(function () {
    that.setData({
      seconds: seconds + 1
    });
    timing(that);
  }
    , 1000)
  formatSeconds(that)
}
function formatSeconds(that) {
  var mins = 0, hours = 0, seconds = that.data.seconds, time = ''
  if (seconds < 60) {

  } else if (seconds < 3600) {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
  } else {
    mins = parseInt(seconds / 60)
    seconds = seconds % 60
    hours = parseInt(mins / 60)
    mins = mins % 60
  }
  that.setData({
    time:  formatTime(mins) + ':' + formatTime(seconds)
  });
}
function formatTime(num) {
  if (num < 10)
    return '0' + num
  else
    return num + ''
}
function charging(that) {
  if (that.data.seconds < 600) {
    that.setData({
      cost: 1
    });
  }
}

function alertInfo(msg) {
  wx.showModal({
    title: msg,
    success: function (res) {
      if (res.confirm) {
        wx.navigateTo({
          url: "/pages/index/index"
        })
      } else if (res.cancel) {
        wx.navigateTo({
          url: "/pages/index/index"
        })
      }
    }
  })
}