// pages/paythefare/paythefare.js
const app = getApp()
var netWork = require('../../utils/netWork.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    license: '',
    driverName: '',
    currentPos: '',
    destination: '',  
    howmuch: '',
    startingPrice: '',
    mileage: '',
    minute: 0.0,
    kmFee: 0.0,
    timeFee: 0.0,
    carType: '',
    driver: app.globalData.GlobalIMG + 'sy_jiejia_touxiang@2x.png',
    callDriver: app.globalData.GlobalIMG + 'sy_fufei_diahua@2x.png',
    balancePayment: app.globalData.GlobalIMG + 'sy_fufei_yue@2x.png',
    wechatPayment: app.globalData.GlobalIMG + 'sy_fufei_weixin@2x.png',
    alipayPayment: app.globalData.GlobalIMG + 'sy_fufei_zhifubao@2x.png',
    selected: app.globalData.GlobalIMG + 'sy_fufei_xuanzhong@2x.png',
    select: app.globalData.GlobalIMG + 'sy_fufei_hui@2x.png',
    payType: 'balance',
    wallets_password_flag: false,
    isFocus: false,
    wallets_password: 0,
    wxCode : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    wx.login({
      success: function (res) {
        if (res.code) {
          netWork.paramsCB({
            "token": wx.getStorageSync('token'),
            "code": res.code
          }, function (params) {
            netWork.httpPOST("/wap/user/codelogin", params, function (res) {
              if (res.status == 1 && res.data.openid != "") {
                wx.setStorageSync('openid', res.data.openid)
              }
            })
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });

    var that = this;
    var openid = wx.getStorageSync('openid')

    that.setData({
      // carType: options.carType
    })
    if (options.carType == 'pc') {
      netWork.paramsCB({
        "token": wx.getStorageSync('token'),
        "pc_id": wx.getStorageSync('pc_sn')
      }, function(params) {
        netWork.httpPOST("/kcv1/pcUser/orderDetail", params, function(res) {
          var orderStatus = res.data.result.order_status;
          var fromAddressAll = res.data.result.from_address;
          var toAddressAll = res.data.result.to_address;
          var fromAddress = fromAddressAll.substring(0, fromAddressAll.indexOf("|||"))
          var toAddress = toAddressAll.substring(0, toAddressAll.indexOf("|||"))
          that.setData({
            //  kilometre: res.data.result.distance,
            carType: 'pc',
            cancelTimeHours: '18',
            cancelTimeMinute: '02',
            license: res.data.result.car.car_plate,
            colorOfCar: res.data.result.car.car_color,
            brand: res.data.result.car.car_brand,
            driverName: res.data.result.driver_nickname,
            driverMobile: res.data.result.driver_mobile,
            orderStatus: res.data.result.order_status,
            currentPos: res.data.result.from_address,
            destination: res.data.result.to_address,
            howmuch: res.data.result.fare,
            startingPrice: res.data.result.fare,
            // mileage: res.data.result.distance,
            //minute: res.data.result.minute,
            //kmFee: res.data.result.km_fee,
            timeFee: 0,
          });
        })
      })
    } else {
      netWork.paramsCB({
        "token": wx.getStorageSync('token'),
        "order_sn": wx.getStorageSync('order_sn')
      }, function(params) {
        netWork.httpPOST("/kcv1/user/orderDetail", params, function(res) {
          var orderStatus = res.data.result.order.order_status;
          var fromAddressAll = res.data.result.order.from_address;
          var toAddressAll = res.data.result.order.to_address;
          var fromAddress = fromAddressAll.substring(0, fromAddressAll.indexOf("|||"))
          var toAddress = toAddressAll.substring(0, toAddressAll.indexOf("|||"))
          that.setData({
            carType: 'kc',
            kilometre: res.data.result.order.distance,
            cancelTimeHours: '18',
            cancelTimeMinute: '02',
            license: res.data.result.driver_info.car_plate,
            colorOfCar: res.data.result.driver_info.car_color,
            brand: res.data.result.driver_info.car_brand,
            driverName: res.data.result.driver_info.nickname,
            score: res.data.result.driver_info.rank,
            driverMobile: res.data.result.driver_info.mobile,
            orderStatus: res.data.result.order.order_status,
            currentPos: fromAddress.length > 20 ? fromAddress.substring(0, 20) + '...' : fromAddress,
            destination: toAddress.length > 20 ? toAddress.substring(0, 20) + '...' : toAddress,
            howmuch: res.data.result.order.order_amount,
            startingPrice: res.data.result.order.start_fee,
            mileage: res.data.result.order.distance,
            minute: res.data.result.order.minute,
            kmFee: res.data.result.order.km_fee,
            timeFee: res.data.result.order.time_fee,
          });
        })
      })
    }

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
  choicePayType: function(payType) {
    var that = this;
    that.setData({
      payType: payType.currentTarget.id
    })
  },

  closePay: function() {
    this.setData({
      wallets_password_flag: false,
      isFocus: false
    })
  },

  pcPay: function() {
    var that = this;
    if (that.data.payType != 'balance') {
      that.wechatPay();
    } else {
      that.setData({
        wallets_password_flag: true,
        isFocus: true
      })
    }

  },
  kcPay: function() {
    var that = this;
    if (that.data.payType == 'balance') {

    } else {
      that.setData({
        wallets_password_flag: true,
        isFocus: true
      })

    }
  },

  pay: function() {
    var that = this;
    //微信支付
    if (that.data.payType != 'balance') {
      var orderSn = wx.getStorageSync('order_sn')
      if (that.data.carType == 'pc') {
        orderSn = wx.getStorageSync('pc_sn')
      }
      that.wechatPay(that.data.carType, orderSn);
    } else {
      //余额支付，打开密码输入框
      // that.setData({
      //   wallets_password_flag: true,
      //   isFocus: true
      // })
      //直接返回
      this.walletPay();
    }
  },

  set_wallets_password(e) { //获取钱包密码
    this.setData({
      wallets_password: e.detail.value
    });
    if (this.data.wallets_password.length == 6) { //密码长度6位时，自动验证钱包支付结果
      this.walletPay(this)
    }
  },

  // 钱包支付
  walletPay: function() {
    var that = this;
    console.log('钱包支付请求函数')
    if (that.data.carType == 'kc') {
      netWork.paramsCB({
        "token": wx.getStorageSync('token'),
        "order_sn": wx.getStorageSync('order_sn'),
        "pay_type": that.data.payType
      }, function(params) {
        netWork.httpPOST("/kcv1/user/pay", params, function(res) {
          console.log(res)
          if (res.code == 0) {
            wx.showModal({
              title: "支付成功",
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: "/pages/gameover/gameover"
                  })
                } else if (res.cancel) {
                  wx.navigateTo({
                    url: "/pages/gameover/gameover"
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: res.msg,
              content: '',
            })
          }
        })
      })
    } else {
      netWork.paramsCB({
        "token": wx.getStorageSync('token'),
        "pc_id": wx.getStorageSync('pc_sn'),
        "pay_password": that.data.wallets_password,
        "pay_type": that.data.payType
      }, function(params) {
        netWork.httpPOST("/kcv1/pcUser/pay", params, function(res) {
          console.log(res)
          if (res.code == 0) {
            wx.showModal({
              title: "支付成功",
              success: function(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: "/pages/gameover/gameover"
                  })
                } else if (res.cancel) {
                  wx.navigateTo({
                    url: "/pages/gameover/gameover"
                  })
                }
              }
            })
          } else {
            wx.showModal({
              title: res.msg,
              content: '',
            })
          }
        })
      })
    }
  },

  //微信支付
  wechatPay: function(carType, orderSn) {
    var that = this;
   
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "openid": wx.getStorageSync('openid'),
      "order_sn": orderSn,
      "order_type": carType
    }, function(params) {
      netWork.httpPOST("/wap/user/pay", params, function(res) {
        console.log('timeStamp:', res.data.timeStamp);
        console.log('nonceStr:', res.data.nonceStr);
        console.log('package:', res.data.package);
        console.log('signType:', res.data.signType);
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': res.data.signType,
          'paySign': res.data.paySign,
          'success': function(res) {
            //微信支付成功跳转评价页面
            wx.navigateTo({
              url: "/pages/gameover/gameover"
            })
          },
          'fail': function(res) {
            console.log('fail:' + JSON.stringify(res));
          }
        })
      })
    })
  }
})