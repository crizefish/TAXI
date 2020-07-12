//获取应用实例
const app = getApp();
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
    whereAreUGoing: '晨沐广场',
    hiddenEgg: 'show',
    timeWait: '1分钟后',
    pathOfCar: app.globalData.GlobalIMG + 'alc@2x.png',
    aim: app.globalData.GlobalIMG + 'sy_dingwei@2x.png',
    getOnTheCar: app.globalData.GlobalIMG + 'sy_tixing@2x.png',
    chatImg: app.globalData.GlobalIMG + 'sy_tishi@2x.png',
    btn_user2x: app.globalData.GlobalIMG + "btn_user@2x.png",
    carSign: "/pages/common/img/car-sign.png",
    fromImg: app.globalData.GlobalIMG + "sy_qidian@2x.png",
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
    typeOfCar: '出租车',
    star: app.globalData.GlobalIMG + "pc_xx1@2x.png",
    people: app.globalData.GlobalIMG + "pc_renshu@2x.png",
    timeImg: app.globalData.GlobalIMG + "pc_shijian@2x.png",
    aim: app.globalData.GlobalIMG + "pc_dingwei@3x.png",
    array: ['1人', '2人', '3人', '4人', '5人', '6人', '7人'],
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
    time: '',
    city: '',
    adcode: '',
    descPool: '',
    descPoolId: '',
    finalTime: 0,
    fare: 0,
    singleFare: 0,
    multiArray: [
      ["现在", "今天", "明天", "后天"],
      ["", "1点", "2点", "3点", "4点", "5点", "6点", "7点", "8点", "9点", "10点", "11点", "12点", "13点", "14点", "15点", "16点", "17点", "18点", "19点", "20点", "21点", "22点", "23点", "0点"],
      ["", "00分", "01分", "02分", "03分", "04分", "05分", "06分", "07分", "08分", "09分", "10分", "11分", "12分", "13分", "14分", "15分", "16分", "17分", "18分", "19分", "20分", "21分", "22分", "23分", "24分", "25分", "26分", "27分", "28分", "29分", "30分", "31分", "32分", "33分", "34分", "35分", "36分", "37分", "38分", "39分", "40分", "41分", "42分", "43分", "44分", "45分", "46分", "47分", "48分", "49分", "50分", "51分", "52分", "53分", "54分", "55分", "56分", "57分", "58分", "59分"]
    ],
    time: '现在'
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
      typeOfCar: '出租车',
      step: 'choice'
    })
  },
  switchCarPooling: function() {
    var that = this;
    if(that.checkLogin()){
      that.setData({
        typeOfCar: '合乘'
      })
      that.getCarFromAddress()

      //获取起点
      netWork.paramsCB({
        "token": wx.getStorageSync('token'),
        "from_keyword": that.data.city
      }, function (params) {
        netWork.httpPOST("/kcv1/user/searchRoute", params, function (res) {
          that.setData({
            allResult: res.data.result
          })
        })
      })
      //获取终点
      netWork.paramsCB({
        "token": wx.getStorageSync('token'),
        "from_id": '25'
      }, function (params) {
        netWork.httpPOST("/kcv1/user/getRouteEnd", params, function (res) {
          console.log(res)
        })
      })
    }
    
  },
  // 输入框失去焦点事件
  FuncHiddenMap() {
    var city = this.data.city;
    var from_id = this.data.descPoolId;
    var from_address = this.data.descPool;
    wx.navigateTo({
      url: this.data.typeOfCar == "出租车" ? "/pages/destination/destination?city=" + city : "/pages/pooldestination/destination?from_id=" + from_id + "&from_address=" + from_address + "&city=" + city
    })
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
      return false;
    }
    return true;
  },

  checkNearDriver: function() {
    var that = this;
    that.checkLogin();
    //查询附近司机
    netWork.paramsCB({
      "token": wx.getStorageSync('token'),
      "location": wx.getStorageSync('from_location')
    }, function(params) {
      netWork.httpPOST("/kcv1/user/nearDriver", params, function(res) {
        console.log(res)
        if (res.code == 0 && res.data.result.length > 0) {
          that.sendOrder();
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
    console.log(options)
    //检查一下是否从出租车结果页面过来
    if (options && options.carflag == 1) {
      that.setData({
        showCar: 'show'
      })
      var origin = wx.getStorageSync("from_location_gd");
      var destination = wx.getStorageSync("to_location_gd");
      that.getDrivingLine(origin, destination)
    }

    //检查一下是否从合乘结果页面过来
    if (options && options.carflag == 2) {
      that.setData({
        step: 'detail',
        typeOfCar: '合乘',
        choiceResult: options,
        fare: options.fare,
        singleFare: options.fare
      })
    }

    //检查一下是否从合乘起点页面过来
    if (options && options.carflag == 3) {
     
      that.setData({
        typeOfCar: '合乘',
        descPool: options.from_address,
        descPoolId: options.from_id,
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
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var singleFare = this.data.singleFare;
    var index = e.detail.value;
    this.setData({
      index: index,
      fare: singleFare * (Number(index) + 1)
    })
  },

  bindMultiPickerChange: function(e) {
    var index = e.detail.value;
    var multiArray = this.data.multiArray;
    var finalTime;
    var now = new Date();
    var yy = now.getFullYear(); //年
    var mm = now.getMonth() + 1; //月
    var dd = now.getDate();
    var nowTimeStamp = parseInt(new Date().getTime() / 1000);

    var time = multiArray[0][index[0]] + ' ' + multiArray[1][index[1]] + ' ' + multiArray[2][index[2]];
    if (index[0] == '现在') {
      time = '现在';
    } else {
      //时
      var hh = index[1];
      if (hh < 10) hh = "0" + hh;
      //分
      var ii = index[2];
      if (ii < 10) ii = "0" + ii;
      //时间戳
      var clock = yy + "/";
      if (mm < 10) clock += "0";
      clock += mm + "/";
      if (dd < 10) clock += "0";
      clock += dd + " ";
      clock += hh + ":";
      clock += ii + ":";
      clock += '00';
      clock += ':000'
      console.log(clock)
      var timestamp = new Date(clock).getTime() / 1000;
      console.log('timestamp', timestamp)
      if (index[0] == 0) {
        time = '现在';
        finalTime = 0;
      }
      //今天
      if (index[0] == 1) {
        finalTime = timestamp + 86400;
        if (finalTime > nowTimeStamp) {
          wx.showModal({
            title: '您选的时间已过期，请重新选择',
            content: '',
          })
        }
      }
      //明天
      if (index[0] == 2) {
        finalTime = timestamp + 86400 * 2;
      }




      this.setData({
        time: time,
        finalTime: finalTime,
      })
    }
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
  choiceTarget: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var choiceResult = that.data.allResult[index];
    wx.setStorage({
      key: "route_id",
      data: choiceResult.route_id
    });
    that.setData({
      choiceResult: choiceResult,
      fare: choiceResult.fare,
      singleFare: choiceResult.fare,
      step: 'detail'
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
      key: app.globalData.MapKey,
    });
    myAmapFun.getRegeo({
      success: function(data) {


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
        wx.setStorage({
          key: "adcode",
          data: that.data.adcode
        });
        wx.setStorage({
          key: "from_location",
          data: "31.19863667538746,121.60027899370256"
        });
         wx.setStorage({
          key: "from_address",
          data: "上海浦东软件园祖冲之园-X座西南198米|||上海市浦东新区X620(金科路)"
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

  sendPoolOrder: function() {
    var that = this;
    var warnStr = [];

    if (that.data.finalTime === -1) {
      warnStr.push("请选择出发时间！")
    }
    if (warnStr.length != 0) {
      wx.showModal({
        title: warnStr[0],
      })
    } else {
      netWork.paramsCB({
        "route_id": wx.getStorageSync('route_id'),
        "start_time": that.data.finalTime,
        "people": Number(that.data.index) + 1,
        "user_location": wx.getStorageSync('from_location'),
        "user_address": wx.getStorageSync('from_address'),
        "token": wx.getStorageSync('token')
      }, function(params) {
        netWork.httpPOST("/kcv1/pcUser/sendPc", params, function(res) {
          if (res.code == 0) {
            wx.setStorage({
              key: "pc_sn",
              data: res.data.result.id
            });
            wx.navigateTo({
              url: "/pages/pctakeover/takeover"
            })
          } else if (res.code == 1) {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
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
  getDrivingLine: function(origin, destination) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: app.globalData.MapKey
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
  
        netWork.paramsCB({
          "tip": 0,
          "start_time": 0,
          "from_location": wx.getStorageSync('from_location'),
          "to_location": wx.getStorageSync('to_location'),
          "token": wx.getStorageSync('token')
        }, function(params) {
          netWork.httpPOST("/kcv1/user/preFeeDetail", params, function(res) {
            if (res.code == 0) {
              that.setData({
                prePrices: res.data.result.fee_amount,
                distanceStr: res.data.result.distance

              });
            }
          })
        })
      },
      fail: function(info) {

      }
    })
  },
  getCarFromAddress: function() {
    var that = this;
    netWork.paramsCB({
      //"from_keyword":'钦州',
      "from_keyword": that.data.city,
      "token": wx.getStorageSync('token') 
    }, function(params) {
      netWork.httpPOST("/kcv1/user/getRouteStart", params, function(res) {

        console.log("qqqqqqqq", res)
        that.setData({
          descPool: res.data.result[0].from_address,
          descPoolId: res.data.result[0].from_id
        })
      })
    })
  },
  regionchange(e) {
    var that = this;
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      console.log(e)
      this.mapCtx = wx.createMapContext("navi_map");
      this.mapCtx.getCenterLocation({
        type: 'gcj02',
        success: function(res) {
          console.log(res)
          that.setData({
            latitude: res.latitude,
            longitude: res.longitude,

            // markers: [{
            //   latitude: res.latitude,
            //   longitude: res.longitude,
            //   color: '#FF0000DD',
            //   fillColor: '#d1edff88',
            //   radius: 3000, //定位点半径
            //   strokeWidth: 1,
            //   iconPath: '',//'/img/sy_qidian@2x.png',

            // }]
          })
          var myAmapFun = new amapFile.AMapWX({
            key: app.globalData.MapKey,
          });
          myAmapFun.getRegeo({
            location: res.longitude + "," + res.latitude,
            success: function(data) {
              console.log("qqq", data)
              that.setData({
                latitude: data[0].latitude,
                longitude: data[0].longitude,
                address: data[0].name,
                desc: data[0].desc,
                adcode: data[0].regeocodeData.addressComponent.adcode,
              });
            }
          })
        }
      })
    }


  },
  //定位到自己的位置事件
  my_location: function(e) {
    var that = this;
    that.onLoad();
  },

  toPoolOrign:function(e){
    wx.navigateTo({
      url: "/pages/poolorigin/origin"
    })
  },

  sendOrder :function(){
    netWork.paramsCB({
      "from_address": wx.getStorageSync("from_address"),
      "from_location": wx.getStorageSync("from_location"),
      "start_time": "0",
      "token": wx.getStorageSync("token"),
      "to_address": wx.getStorageSync("to_address"),
      "to_location": wx.getStorageSync("to_location"),
      "tip": "0"
    }, function (params) {
      netWork.httpPOST("/kcv1/user/sendOrder", params, function (res) {
        console.log(params)
        console.log(res)
        if (res.code == 0) {
          wx.setStorage({ key: "order_sn", data: res.data.result.order_sn });
          wx.navigateTo({
            url: "/pages/takeover/takeover"
          })
        } else if (res.msg == '您有订单正在进行中。') {
          netWork.paramsCB({
            "token": wx.getStorageSync('token'),
            "order_sn": wx.getStorageSync('order_sn')
          }, function (params) {
            netWork.httpPOST("/kcv1/user/orderDetail", params, function (res) {
              if (res.code == 0) {
                var orderStatus = res.data.result.order.order_status;
                //  -3 超时取消 -2 司机取消 -1 用户取消  0 发单 1 已抢单 2 到达乘客地点 3 接到乘客  4 到达目的地  5 发起收款  6 已确认付款
                if (orderStatus == 5) {

                  wx.navigateTo({
                    url: "/pages/paythefare/paythefare"
                  })
                } else {
                  wx.showModal({
                    title: res.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: "/pages/takeover/takeover"
                        })
                      } else if (res.cancel) {
                        wx.navigateTo({
                          url: "/pages/index/index"
                        })
                      }
                    }
                  })
                }
              }
            })
          })
        } else {
          wx.showToast({
            title: '附近暂无司机',
            icon: 'none',
            duration: 2000
          })
        }
      })
    })
  }
})