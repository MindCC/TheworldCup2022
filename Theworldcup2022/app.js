// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env:"study-0gpwdl2dfb7f1dd8"
    })

  },
  
  globalData: {
    userInfo: null,
    openid:null
  }
})
