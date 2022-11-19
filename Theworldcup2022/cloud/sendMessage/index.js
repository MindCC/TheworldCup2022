// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try{
    const result = await cloud.openapi.subscribeMessage.send({
      touser:"o8f_J4iGeQGtYC_ZzAVNar8PYxSY",
      page:'pages/index/index',
      data:{
        time1:{
          value:"2022年11月21日 0:00"
        },
        thing2:{
          value:"卡塔尔"
        },
        thing3:{
          value:"厄瓜多尔"
        }
      },
      templateId:"M288qASU7-WYEkq1hXPchiHdqK11DEfuGJpPyJq0jgY"
    })
    return result
  }catch(err){
    console.log(err)
    return err
  }
}