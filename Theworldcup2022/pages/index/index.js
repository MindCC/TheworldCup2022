const db = wx.cloud.database()
// 全局存储，方便随时调用
const app = getApp()
Page({

  //获取用户授权
  getaccess(){
    console.log(this.data.choseNames)
    if(!app.globalData.userInfo){
      wx.showToast({
        title: '请先登录',
        })
    }else{
      wx.requestSubscribeMessage({
        tmplIds: ['M288qASU7-WYEkq1hXPchiHdqK11DEfuGJpPyJq0jgY'],
        success(res){
          wx.cloud.database().collection('push').where({
            _openid:app.globalData.openid
            }).get({
                success(res){
                  console.log(app.globalData.openid)
                  console.log(res)
                    if(res.data.length==0){
                    //向数据库中添加登陆记录
                    wx.cloud.database().collection('push').add({
                        data:{
                            avatarUrl:user.avatarUrl,
                            nickName:user.nickName,
                            choseName:this.data.choseNames,
                            isdelete:0,
                            ispush:0
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
        },
        fail(res){
          console.log('授权失败',res)
        }
      })
    }
    
    
  },
  //发送消息给单个用户
  sendone(){
 
    this.sendFun("o8f_J4iGeQGtYC_ZzAVNar8PYxSY")
  
  },

    //发送消息给多个用户
    sendall(){
      users.forEach(item=>{
        console.log("1")
      })
    },
    //封装的发送方法
    sendFun(openid){
      wx.cloud.callFunction({
        name:"sendMessage",
        data:{
          openid:openid
        }
      }).then(res=>{
        console.log("发送成功",res)
      }).catch(res=>{
        console.log("发送失败",res)
      })
    },
    data: {
      select_all: false,//是否全选
      schedule_list: [
      ],
      choseNames: '', //选中的名字列表
    },
    
  // 请求云端赛程表数据
  onLoad: function () {

    db.collection('schedule').get({
      success:res=> {
        console.log('赛程表获取成功',res)
        // this.setData({
        //   schedule_list: res.data
        // })
        let waitOrder = res.data
        // 格式化日期
        waitOrder.map((item) => {
          item.time = this.dateFormat(item.time, "MM-dd HH:mm")
        })
        this.setData({
          schedule_list:waitOrder
        }).catch((err)=>{
          console.log(err)
        })
      },
      catch:res=> {
        console.log('赛程表获取失败！',res)
      },
    })
  },
    //全选与反全选
    selectall: function (e) {
      var arr = []; //存放选中id的数组
      for (let i = 0; i < this.data.schedule_list.length; i++) {
  
        this.data.schedule_list[i].checked = (!this.data.select_all)
  
        if (this.data.schedule_list[i].checked == true) {
          // 全选获取选中的值
          arr = arr.concat(this.data.schedule_list[i]._id);
        }
      }
      this.setData({
        schedule_list: this.data.schedule_list,
        select_all: (!this.data.select_all),
        choseNames: arr
      })
    },
  
    // 单选
    checkboxChange: function (e) {
      this.setData({
        choseNames: e.detail.value, //单个选中的值
      })
      if (this.data.choseNames.length == this.data.schedule_list.length) {
        this.setData({
          select_all: true
        })
      } else {
        this.setData({
          select_all: false
        })
      }
    },

    //处理时间
    dateFormat(date, fmt) { 
      var o = {
        "M+": date.getMonth() + 1, // 月份
        "d+": date.getDate(), // 日
        "H+": date.getHours(), // 小时
        "m+": date.getMinutes(), // 分
        "s+": date.getSeconds(), // 秒
        "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
      for (var k in o) { if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length))) }
      return fmt
    }
})