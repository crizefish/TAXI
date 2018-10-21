var md5 = require('../libs/md5.js');
const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}



function apiDataUtil(prop) { 
  // var timeDiff = app.userData.TimeDiff;
  // console.log("254234:"+app.userData.TimeDiff);
  // console.log('timeD============》' + app.userData.TimeDiff);

  // //排序
  // function objKeySort(obj) {//排序的函数
  //   var newkey = Object.keys(obj).sort();
  //   　　//先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  //   var newObj = {};//创建一个新的对象，用于存放排好序的键值对
  //   for (var i = 0; i < newkey.length; i++) {//遍历newkey数组
  //     newObj[newkey[i]] = obj[newkey[i]];//向新创建的对象中按照排好的顺序依次增加键值对
  //   }
  //   return newObj;//返回排好序的新对象
  // }
  // objKeySort(prop)
  
  // // 时间戳 :本地时间 + 时间差
  // prop.time = Date.parse(new Date()) / 1000 + timeDiff;
  // prop.test = "1"
  // console.log('time2============》' + prop.time);
  // //待加密字符串
  // var str = '188888888888' + "1"+prop.time + 'ieuggue';
  // prop.sign = md5.hexMD5(str);
  // return prop;

  //获取网络时间
  function netWorktimeJetlag(cb) {
    var nowdate = Date.parse(new Date())
    nowdate = nowdate / 1000
    var jetlag
    wx.request({
      url: apiURL + '/kcv1/index/getServerTime',
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
  function newDate(cb) {
    var nowdate = Date.parse(new Date())
    nowdate = nowdate / 1000
    try {
      var value = wx.getStorageSync('jetlag')
      // Do something with return value
      if (value == "") {
        //本地没有时差获取网络时间得到时差
        netWorktimeJetlag(function (jetlag) {
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

  function alertInfo(msg) {
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

  function getstorageOfKey(cb) {
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
  function paramsCB(params, cb) {

    getstorageOfKey(function (signStrres) {
      // console.log(signStrres)
      newDate(function (jetlag) {
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
        // console.log(signStr)
        signStr = md5.hex_md5(signStr)
        // console.log(signStr)
        params.time = jetlag

        params.sign = signStr
        typeof cb == "function" && cb(params);
      })
    })
  }

}

module.exports = {
  formatTime: formatTime,
  apiDataUtil: apiDataUtil,
}