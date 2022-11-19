// 全局存储，方便随时调用
const app = getApp()

Page({
  data: {
    userInfo:[],
    show:false //展示登录按钮
  },
  onLoad: function() {   
        //获取用户openid
      wx.cloud.callFunction({
        name:"getOpenid1118"
      }).then(res=>{
        app.globalData.openid = res.result.openid
        console.log("获取openid成功",res)
        return res
      }).catch(res=>{
        console.log("获取openid失败",res)
        return res
      })

  },
  login() { 

    var that = this
    wx.getUserProfile({
      desc: '完善信息',  // 提示信息
      success(res){
        var user = res.userInfo
        app.globalData.userInfo = user   //把user里面的数据放在globalData里面使全页面可以调用
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          show:true
        })
        //云开发用以下方式 java 或者 php 做的数据表 我们要传则需要用request
        //需要检查是否之前已经授权登录了
//检查数据库中是否已经有记录：
wx.cloud.database().collection('login_users').where({
  _openid:app.globalData.openid
  }).get({
      success(res){
        console.log(app.globalData.openid)
        console.log(res)
          if(res.data.length==0){
          //向数据库中添加登陆记录
          wx.cloud.database().collection('login_users').add({
              data:{
                  avatarUrl:user.avatarUrl,
                  nickName:user.nickName,
              },
              success(res){
                  wx.showToast({
                  title: '登录成功',
                  })
              }
          })
          }else{
              that.setData({
                  userInfo:res.data[0],
                  hasUserInfo:true
              })
              app.globalData.userInfo=res.data[0]
          }
      }
  })
      }
    })
  }
})
