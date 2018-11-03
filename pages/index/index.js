//获取应用实例
const app = getApp();
// 引用百度地图微信小程序JSAPI模块 
var bmap = require('../../libs/bmap-wx.min.js');
var netWork = require('../../utils/netWork.js')
var amapFile = require('../../libs/amap-wx.js');
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
    hiddenEgg: 'show',
    timeWait: '1分钟后',
    pathOfCar: app.globalData.GlobalIMG + 'alc@2x.png',
    aim: app.globalData.GlobalIMG + 'sy_dingwei@2x.png',
    getOnTheCar: app.globalData.GlobalIMG + 'sy_tixing@2x.png',
    chatImg: app.globalData.GlobalIMG + 'sy_tishi@2x.png',
    btn_user2x: app.globalData.GlobalIMG + "btn_user@2x.png",
    carSign: "/pages/common/img/car-sign.png",
    motto: '888',
    prePrices: '',
    distanceStr: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nicknameImg: app.globalData.GlobalIMG + "zc_touxiang_tx@2x.png",
    mycall: '',
    petname: '点击登录',
    TravelItinerary: app.globalData.GlobalIMG + "zx_xingcheng@2x.png",
    tool: app.globalData.GlobalIMG + "zx_shezhi@2x.png",
    mySwitch: 'none',
    heightOfMap: (100 - 46.3),
    showmap: 'block',
    showCar: 'hide',
    typeOfCar: '快车',
    star: app.globalData.GlobalIMG + "pc_xx1@2x.png",
    people: app.globalData.GlobalIMG + "pc_renshu@2x.png",
    timeImg: app.globalData.GlobalIMG + "pc_shijian@2x.png",
    aim: app.globalData.GlobalIMG + "pc_dingwei@2x.png",
    array: ['乘车人数', '1人', '2人', '3人', '4人', '5人', '6人', '7人'],
    allResult: [],
    choiceResult: {},
    index: 0,
    step: "choice",
    history: {
      from_address: "",
      from_city: "",
      from_district: "",
      from_id: "",
      from_location: "",
    },
    time:'',
    fare:0,
    singleFare:0,
    multiArray: [
      ["选择时间","现在","今天", "明天", "后天"],
      ["1点", "2点", "3点", "4点", "5点", "6点", "7点", "8点", "9点", "10点", "11点", "12点", "13点", "14点", "15点", "16点", "17点", "18点", "19点", "20点", "21点", "22点", "23点", "24点"],
      ["00分", "01分", "02分", "03分", "04分", "05分", "06分", "07分", "08分", "09分", "10分", "11分", "12分", "13分", "14分", "15分", "16分", "17分", "18分", "19分", "20分", "21分", "22分", "23分", "24分", "25分", "26分", "27分", "28分", "29分", "30分", "31分", "32分", "33分", "34分", "35分", "36分", "37分", "38分", "39分", "40分", "41分", "42分", "43分", "44分", "45分", "46分", "47分", "48分", "49分", "50分", "51分", "52分", "53分", "54分", "55分", "56分", "57分", "58分", "59分"]],
    time: '选择时间'
  },

  // 输入框获得焦点事件
  FuncshowMap() {
    this.setData({
      showmap: 'block'
    })
  },
  switchExpress: function() {
    console.log(1)
    this.setData({
      typeOfCar: '快车'
    })
  },
  switchCarPooling: function() {
    var that = this;
    console.log(1)
    this.setData({
      typeOfCar: '拼车'
    })

    //获取起点
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "from_keyword": '上海'
    }, function(params) {
      netWork.httpPOST("/kcv1/user/searchRoute", params, function(res) {
        that.setData({
          allResult: res.data.result
        })
      })
    })
    //获取终点
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "from_id": '25'
    }, function(params) {
      netWork.httpPOST("/kcv1/user/getRouteEnd", params, function(res) {
        console.log(res)
      })
    })
  },
  // 输入框失去焦点事件
  FuncHiddenMap() {
    var city = this.data.city;
    wx.navigateTo({
      url: this.data.typeOfCar == "快车" ? "/pages/destination/destination?city=" + city : "/pages/pooldestination/destination"
    })
  },
  // 绑定input输入 
  bindKeyInput: function(e) {
    console.log("e", e.detail.value)
    if (e.detail.value == null || e.detail.value == '') {
      return;
    }
    var that = this;
    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: '9nxZMWueKmnnnGgrt6Ie7fR3EdjYTD6N'
    });
    var fail = function(data) {
      console.log(data)
    };
    var success = function(data) {
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
  },

  choiceAddress: function(e) {
    this.setData({
      hiddenEgg: 'hidden'
    })
  },

  clear: function(e) {
    this.setData({
      sugResult: []
    })
  },

  makertap: function(e) {
    var that = this;
    var id = e.markerId;
    that.showSearchInfo(wxMarkerData, id);
  },

  showSearchInfo: function(data, i) {
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
  checkLogin: function(e) {
    var token = wx.getStorageSync('token');
    if (token == null || token == "") {
      wx.navigateTo({ //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
        url: "/pages/login/login"
      })
    }
    //查询附近司机
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "location": wx.getStorageSync('from_location')
    }, function(params) {
      netWork.httpPOST("/kcv1/user/nearDriver", params, function(res) {
        console.log(res)
        if (res.data.result.length > 0) {
          wx.navigateTo({
            url: "/pages/waitting/waitting"
          })
        } else {
          wx.showToast({
            title: '附近暂无司机',
            icon: 'none',
            duration: 2000
          })
        }
      })
    });
  },

  toLogin: function() {
    if (this.data.petname == '点击登录') {
      wx.navigateTo({
        url: "/pages/login/login"
      })
    }
  },


  onLoad: function(options) {
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    that.regeocoding();

    //检查一下是否从快车结果页面过来
    if (options.carflag == 1) {
      that.setData({
        showCar: 'show'
      })
      var origin = wx.getStorageSync("from_location_gd");
      var destination = wx.getStorageSync("to_location_gd");
      that.getDrivingLine(origin, destination)
      var origin = wx.getStorageSync("from_location_gd");
      var destination = wx.getStorageSync("to_location_gd");
      that.getDrivingLine(origin, destination);
    }

    //检查一下是否从拼车结果页面过来
    if (options.carflag == 2) {
      that.setData({
        step: 'detail',
        typeOfCar: '拼车',
        choiceResult: options,
        fare: options.fare,
        singleFare: options.fare
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    //查询用户信息
    if (token) {
      netWork.paramsCB({
        "token": token
      }, function(params) {
        netWork.httpPOST("/kcv1/user/userInfo", params, function(res) {
          if (res.code == 0) {
            that.setData({
              nicknameImg: res.data.result.head_pic,
              mycall: res.data.result.mobile,
              petname: res.data.result.nickname,
            })
          } else {
            alert("网络错误")
          }
        })
      })
    }
  },

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  removeAddress: function() {
    wx.removeStorageSync('to_location')
    wx.removeStorageSync('to_address')

    this.setData({
      showCar: 'hide',
      polyline: [{
        points: null,
      }]
    })
  },

  //退出登录
  logout: function() {
    netWork.paramsCB({
      "token": wx.getStorageSync('token')
    }, function(params) {
      netWork.httpPOST("/kcv1/user/logout", params, function(res) {
        if (res.code == 0) {
          wx.removeStorageSync('token')
          wx.removeStorageSync('key')
          wx.removeStorageSync('jetlag')
          wx.navigateTo({
            url: "/pages/login/login"
          })
        } else {
          alert("网络错误")
        }
      })
    })

  },

  //行程列表
  tripList: function() {
    wx.navigateTo({
      url: '../history/history'
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var singleFare = this.data.singleFare;
    var index = e.detail.value;
    this.setData({
      index: index,
      fare: singleFare * (index) 
    })
  },
  
  bindMultiPickerChange: function(e) {
    var index = e.detail.value;
    var multiArray = this.data.multiArray;
    var time = multiArray[0][index[0]] + ' ' + multiArray[1][index[1]] + ' ' + multiArray[2][index[2]];
    if(index[0]==0){
      return;
    }
    if(index[0]==1){
        time='现在';
    }
    this.setData({
      time: time
    })
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  longShow: function() {
    this.setData({
      mySwitch: 'block'
    })
  },
  choiceTarget: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var choiceResult = that.data.allResult[index];
    wx.setStorage({
      key: "route_id"
    });
    that.setData({
      choiceResult: choiceResult,
      fare: choiceResult.fare,
      singleFare: choiceResult.fare,
      step:'detail'
    })

  },
  changeSwitch: function(e) {
    if (this.data.mySwitch == 'none') {
      this.setData({
        mySwitch: "block",
        showmap: "none"
      })
    } else {
      this.setData({
        mySwitch: 'none',
        showmap: 'block'
      })
    }

  },

  alert: function(msg) {
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
  },
  regeocoding: function() {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: '4f3444ea6fce9a52d068cb97c9f3faf5'
    });
    myAmapFun.getRegeo({
      success: function(data) {
        that.setData({
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          address: data[0].name,
          desc: data[0].desc,
          city: data[0].regeocodeData.addressComponent.district
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
        wx.setStorage({
          key: "from_location_gd",
          data: from_location_gd
        });

      },
      fail: function(info) {
        //失败回调
        console.log(info)
      }
    });



  },
  getDrivingLine: function(origin, destination) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: '4f3444ea6fce9a52d068cb97c9f3faf5'
    });
    myAmapFun.getDrivingRoute({
      origin: origin,
      destination: destination,
      success: function(data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0047fc",
            width: 8
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          var distance = data.paths[0].distance / 1000 + '';

          that.setData({
            distanceStr: distance.substring(0, distance.indexOf(".") + 3)
          });
        }
        if (data.taxi_cost) {
          var prePricesStr = data.taxi_cost + "";
          that.setData({
            prePrices: prePricesStr.substring(0, prePricesStr.indexOf(".") + 3),
          });
        }

      },
      fail: function(info) {

      }
    })
  }
})