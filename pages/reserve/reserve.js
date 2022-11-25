// pages/reserve/reserve.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    shopList: ['太舞店', '万龙店', '望京店', '回龙观店'],
    timeSegList: ['10:00-11:00', '11:30-12:30', '13:30-14:30', '15:00-16:00'],
    needAuth: false,
    cell: ''
  },
  submit(){
    wx.showToast({
      title: '预约成功',
      icon:'none',
      duration: 5000,
      success:(res)=>{
        wx.redirectTo({
          url: 'mine',
        })
      }
    })
  },
  tabSwitch: function(e) {
    wx.redirectTo({
      url: e.detail.item.pagePath
    })
  },
  cellGetted: function(e){
    console.log('cell getted', e)
    var that = this
    that.setData({needAuth: false, cell: e.detail.userInfo.cell_number})
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    that.setData({tabBarItem: app.globalData.userTabBarItem})
    app.loginPromise.then(function (resolve){
      var cell = ''
      if (app.globalData.userInfo != null && app.globalData.userInfo.cell_number != null &&  !isNaN(app.globalData.userInfo.cell_number) )
      {
        cell = app.globalData.userInfo.cell_number
      }
      if (cell == ''){
        console.log('need auth')
        that.setData({needAuth: true})
      }
      else{
        that.setData({cell: cell, needAuth: false})
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})