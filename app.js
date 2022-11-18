// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  globalData: {
    userInfo: null,
    userTabBarItem: [
      {
        "pagePath": "/pages/reserve/reserve",
        "text": "预约",
        //"iconPath": "/images/equip.jpg",
        //"selectedIconPath": "/images/equip.jpg"
      },
      {
        "pagePath": "/pages/reserve/mine",
        "text": "查看",
        //"iconPath": "/images/equip.jpg",
        //"selectedIconPath": "/images/equip.jpg"
      }
    ]
  }
})
