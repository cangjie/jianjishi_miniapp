// pages/kol/follow_list.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },
  getData(){
    var that = this
    var userId = that.data.userId
    var getUrl = app.globalData.requestPrefix + 'ChannelFollow/' + userId + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('follow list', res)
        if (res.statusCode != 200){
          return
        }
        var total = 0;
        var followList = res.data
        for(var i = 0; i < followList.length; i++){
          var date = new Date(followList[i].key)
          followList[i].key = util.formatDate(date)
          total += parseInt(followList[i].value)
        }
        that.setData({followList: followList, total: total})
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    app.loginPromise.then(function(resolve){
      var userId = app.globalData.userInfo.user_id
      that.setData({userId: userId})
      that.getData()
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