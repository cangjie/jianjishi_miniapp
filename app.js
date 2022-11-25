// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    console.log('launch')
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    /*
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

      }
    })
    */
  },
  loginPromise: new Promise(function(resolve){
    
    wx.login({
      success: res => {
        console.log('user login', res.code)
        const app = getApp()
        var getSessionKeyUrl = app.globalData.requestPrefix + 'MiniAppLogin/GetSessionKey?code=' + res.code
        wx.request({
          url: getSessionKeyUrl,
          success: res => {
            console.log('session key', res)

          }
        })
      }
    })

  }),
  globalData: {
    userInfo: null,
    requestPrefix: 'https://jjsmini.luqinwenda.com/api/',
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
