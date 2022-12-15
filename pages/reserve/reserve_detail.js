// pages/reserve/reserve_detail.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    that.setData({tabBarItem: app.globalData.userTabBarItem, id: options.id})
    app.loginPromise.then(function(resolve){
      var getReserveUrl = app.globalData.requestPrefix + 'Shop/GetReserve/' + that.data.id + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
      wx.request({
        url: getReserveUrl,
        method: 'GET',
        success: (res)=>{
          console.log('get reserve', res)
          var reserve = res.data
          reserve.reserve_date_str = util.formatDate(new Date(reserve.reserve_date))
          that.setData({reserve: res.data})
        }
      })
    })
  },
  changeShop(e){
    console.log('change shop', e)
    var that = this
    that.setData({shopId: e.detail.shopId})
    that.fillTimeTable()
  },

  fillTimeTable: function(){
    var that = this
    var shopId = that.data.shopId
    var date = that.data.reserve.reserve_date_str
    var timeTableDescList = ['请选择……']
    var timeTableIdList = [0]
    var timeTableSelectIndex = 0
    if (shopId != 0){
      var getTimeTableUrl = app.globalData.requestPrefix + 'Shop/GetTimeTable/' + shopId + '?date=' + date
      wx.request({
        url: getTimeTableUrl,
        success: (res)=>{
          console.log('get time table', res)
          for(var i = 0; i < res.data.length; i++){
            var timeSeg = res.data[i]
            if (timeSeg.avaliableCount >0){
              timeTableDescList.push(timeSeg.description)
              timeTableIdList.push(timeSeg.id)
              if (that.data.reserve.time_table_id == timeSeg.id){
                timeTableSelectIndex = i + 1
              }
            }
          }
          that.setData({timeTableDescList: timeTableDescList, timeTableIdList: timeTableIdList, timeTableSelectIndex: timeTableSelectIndex})
        }
      })
    }
  },

  tabSwitch: function(e) {
    wx.redirectTo({
      url: e.detail.item.pagePath
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