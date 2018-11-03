const app = getApp();
var util = require('../utils/util.js') ;
var md5 = require('../libs/md5.js');


class LoginService{



  httpPOST(url,data,callback){
  
    wx.request({
      url: app.globalData.RequestURL + url,
      data: data ,
      header: {
        "content-type": "application/json"
      },
      method: 'POST',
      success(data) {
        callback(data)
      },
      fail(data) {


      }
    });
  }

  //获取网络时间
   netWorktimeJetlag(cb) {
  var nowdate = Date.parse(new Date())
  nowdate = nowdate / 1000
  var jetlag
  wx.request({
    url: app.globalData.RequestURL + '/kcv1/index/getServerTime',
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success: function (res) {
      if (res.data.code == 0) {
        var netWorktime = res.data.data.result
        jetlag = nowdate - netWorktime
        wx.setStorage({
          key: "jetlag",
          data: jetlag
        })
        typeof cb == "function" && cb(jetlag);
      }
    }
  })
  return
}

//获取时间
 newDate(cb) {
  var nowdate = Date.parse(new Date());
  var that = this;
  nowdate = nowdate / 1000
  try {
    var value = wx.getStorageSync('jetlag')
    console.log("value:" + value)
    // Do something with return value
    if (value == "") {
      //本地没有时差获取网络时间得到时差
      that.netWorktimeJetlag(function (jetlag) {
        typeof cb == "function" && cb(jetlag + nowdate);
      })
    } else {
      typeof cb == "function" && cb(value + nowdate);
    }
  } catch (e) {
    // Do something when catch error
    console.log(e)
  }
}

 getstorageOfKey(cb) {
  try {
    var value = wx.getStorageSync('key')
    // Do something with return value
    if (value == "") {
      typeof cb == "function" && cb("ieuggue");
    } else {
      typeof cb == "function" && cb(value);
    }
  } catch (e) {
    // Do something when catch error
    console.log(e)
  }
}
//参数组装
 paramsCB(params, cb) {
 var that = this;
 that.getstorageOfKey(function (signStrres) {
    // console.log(signStrres)
   that.newDate(function (jetlag) {
      var arrKey = []
      for (var obj in params) {
        arrKey.push(obj)
      }
      arrKey = arrKey.sort()
      var signStr = ""
      for (var obj in arrKey) {
        signStr = signStr + params[arrKey[obj]]
      }
      // console.log(signStr)

      signStr = signStr + jetlag + signStrres
       console.log("before=========>"+signStr)
      signStr = md5.hecvxMD5(signStr)
      console.log("after=========>" + signStr)
      params.time = jetlag

      params.sign = signStr
      typeof cb == "function" && cb(params);
    })
  })
}


}
module.exports.LoginService = LoginService;