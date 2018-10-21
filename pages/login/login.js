// pages/login.js
const app = getApp();
var netWork = require('../../utils/netWork.js')
//倒计时
var countdown = 60;
var settime = function (that) {
  if (countdown == 0) {
    that.setData({
      is_show: true
    })
    countdown = 60;
    return;
  } else {
    that.setData({
      is_show: false,
      last_time: countdown
    })

    countdown--;
  }
  setTimeout(function () {
    settime(that)
  }
    , 1000)
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bgImg: app.globalData.GlobalIMG + 'sy_tishigb_guanggao@2x.png',
    phoneNumber: '',
    inputPassword: '18812341234',
    arrow: app.globalData.GlobalIMG + 'btn_xia@3x.png',
    myphone: '18321401669',
    is_show:58,
    last_time:0,
    setPassword:'',
    password:'',
    showDiv:'init',
    userCode:''
  },
  CONSTANTS:{
    SMS_CODE_TYPE_REGISTER : 'register',
    SMS_CODE_TYPE_LOGIN: 'login',
    SMS_CODE_TYPE_CHANGE: 'change', 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: app.globalData.RequestURL + '/kcv1/index/getServerTime',
      header: {
        "content-type": "application/json"
      },
      method: 'POST',

      success(data) {
        var time1 = data.data.data.result;
        var time2 = Date.parse(new Date()) / 1000;
        console.log('timef============》' + time1);
        console.log('timeb============》' + time2);
        console.log(Number(time2) - Number(time1));
        app.userData.TimeDiff = time2 - time1;
        console.log('time12b============》' + app.userData.TimeDiff);

      }
    })

  
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

  phoneNumberInput: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },

  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  changeDivGetCode: function (e) {
    this.clickVerify();
    this.setData({
      showDiv: 'getCode'
    })
  },
  changeDivLogin: function (e) {
    this.clickVerify();
    this.setData({
      showDiv: 'login'
    })
  },
  checkCode: function (e) {
    console.log(this.data.userCode)
    if(this.data.userCode.length==6){

    }
    // this.setData({
    //   password: e.detail.value
    // })
  },

  //校验登陆状态
  checkLoginStatus: function(e){
    var result ;
    var that = this;
    var mobile = that.data.phoneNumber;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile == null || mobile.trim == "") {
      that.alert('手机号不能为空')
      return ;
    }
    if (!myreg.test(mobile)) {
      that.alert('请输入正确的手机号')
      return;
    }
    netWork.paramsCB({ "mobile": mobile}, function (params) {
      netWork.httpPOST("/kcv1/user/isReg", params, function (res) {
        if (res.data.result.is_reg == 1){
            result = 'login';
        }else{
          result = 'getCode';
          that.sendMessageCode(that.CONSTANTS.SMS_CODE_TYPE_REGISTER);
        }
        that.setData({
          showDiv: result,
          inputPassword: that.data.phoneNumber
        })
      })
    })
  },
  
  //发送短信验证码
  sendMessageCode: function (e) {
    var that = this;
    that.clickVerify();
    // netWork.paramsCB({ "mobile": that.data.phoneNumber, "flag": that.CONSTANTS.SMS_CODE_TYPE_REGISTER}, function (params) {
    //   netWork.httpPOST("/kcv1/user/sendSmsCode", params, function (res) {
    //     if (res.code == 0) {
    //       //倒计时开始
    //       that.clickVerify()
    //     } else {
    //       that.alert(res.msg)
    //     }
    //   })
    // })
  },

  //登录
    login: function (e) {
      
    var that = this;
    var mobile = that.data.phoneNumber;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile == null || mobile.trim == "") {
      that.alert('手机号不能为空')
    }
    if (!myreg.test(mobile)) {
      that.alert('请输入正确的手机号')
    }

    netWork.paramsCB({ "mobile": mobile, "password": this.data.password,"registration_id":"1" }, function (params) {
      netWork.httpPOST("/kcv1/user/login", params, function (res) {
        console.log(res)
        if (res.code == 0) {
          wx.setStorage({ key: "key", data: res.data.result.key });
          wx.setStorage({ key: "token", data: res.data.result.token });
          wx.navigateTo({ 
            url: "/pages/waitting/waitting"
          })
        } else {
          that.alert('密码错误，请重新输入')
        }
      })
    })
  },

//倒计时
    clickVerify: function () {
      var that = this;
      // 将获取验证码按钮隐藏60s，60s后再次显示
      that.setData({
        is_show: (!that.data.is_show)  //false
      })
      settime(that);
    },


  //公共插件
  alert : function(msg){
    wx.showModal({
      title: msg,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确认')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})