//app.js
var netWork = require('utils/netWork.js')

App({
  onLaunch: function() {
    this.getScreenHeight()
    console.log(this.globalData.RequestURL)
    var diff = 0;
    var code = 0;

    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        wx.setStorageSync('code', res.code);
      }
    })
 
       

    // 获取用户信息
    wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                // 可以将 res 发送给后台解码出 unionId
                this.globalData.userInfo = res.userInfo

                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                // 所以此处加入 callback 以防止这种情况
                if (this.userInfoReadyCallback) {
                  this.userInfoReadyCallback(res)
                }
              }
            })
          }
        }
      })


  },

//<<<<<<<<<<<<<<<<<<<<<<<<<红旗出行<<<<<<<<<<<<<<<<<<<<<<
  globalData: {
    //全局变量
    userInfo: null,
    GlobalIMG: "http://xcx.durmi.cn/tp/",
    GlobalAPI: "https://xcx.durmi.cn",
    ProjectId: "wx8c8991f86b4e43bb",
    MapKey: "3259495939e6ec6205b07ded12a76578",
    Screenheight: '',
  },
//>>>>>>>>>>>>>>>>>>>>>>>>红旗出行>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<印象出行<<<<<<<<<<<<<<<<<<<<<<
  // globalData: {
  //   //全局变量
  //   userInfo: null,
  //   GlobalIMG: "https://yxcx.zmkjgame.com/tp/",
  //   GlobalAPI: "https://yxcx.zmkjgame.com",
  //   ProjectId: "wxce577c2f98cb3f35",
  //   MapKey: "4f3444ea6fce9a52d068cb97c9f3faf5",
  // },
//>>>>>>>>>>>>>>>>>>>>>>>印象出行>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<网上安运<<<<<<<<<<<<<<<<<<<<<<<
  // globalData: {
  //   //全局变量
  //   userInfo: null,
  //   GlobalIMG: "https://yxcx.zmkjgame.com/tp/",
  //   GlobalAPI: "https://aswsay.zmkjgame.com",
  //   ProjectId: "wxddd07851a8ebd960",
  //   MapKey: "56d49539de780128a63229ba18b1a2ec",
  // },
//>>>>>>>>>>>>>>>>>>>>>>>网上安运>>>>>>>>>>>>>>>>>>>>>>>
//<<<<<<<<<<<<<<<<<<<<<<<<约约出行<<<<<<<<<<<<<<<<<<<<<<
  // globalData: {
  //   //全局变量
  //   userInfo: null,
  //   GlobalIMG: "https://yxcx.zmkjgame.com/tp/",
  //   GlobalAPI: "https://yxcx.zmkjgame.com",
  //   ProjectId: "wx24ae4b0b2b19b9ed",
  //   MapKey: "4f3444ea6fce9a52d068cb97c9f3faf5",
  // },
//>>>>>>>>>>>>>>>>>>>>>>>约约出行>>>>>>>>>>>>>>>>>>>>>>>

  userData: {
    TimeDiff: 0
  },

  getScreenHeight: function() {
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        // this.setData({
        //   Screenheight: res.windowHeight
        // })
        wx.setStorage({
          key: "Screenheight",
          data: res.windowHeight
        })
        console.log('=================》', wx.getStorageSync('Screenheight'))
      }
    })
  }
})