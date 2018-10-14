const app = getApp();
class IndexService{

  getTargets(){
    wx.request({
      url: app.globalData.RequestURL + 'suggestion',
      data: suggestionparam,
      header: {
        "content-type": "application/json"
      },
      method: 'GET',
      success(data) {
        let res = data["data"];
        if (res["status"] === 0) {
          otherparam.success(res);
        } else {
          otherparam.fail({
            errMsg: res["message"],
            statusCode: res["status"]
          });
        }
      },
      fail(data) {
        otherparam.fail(data);
      }
    });
  }


}