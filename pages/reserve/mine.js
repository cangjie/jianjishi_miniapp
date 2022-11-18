// pages/reserve/mine.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    shopList: ['太舞店', '万龙店', '望京店', '回龙观店'],
    timeSegList: ['10:00-11:00', '11:30-12:30', '13:30-14:30', '15:00-16:00']
  },
  tabSwitch: function(e) {
    wx.redirectTo({
      url: e.detail.item.pagePath
    })
  },
  gotoAdmin(){
    wx.navigateTo({
      url: 'admin',
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    that.setData({tabBarItem: app.globalData.userTabBarItem})
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