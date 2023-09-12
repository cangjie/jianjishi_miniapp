// pages/reserve/admin.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    startDate: util.formatDate(new Date()),
    endDate: util.formatDate(new Date()),
    shopId: 0
  },
  changeShop: function(e){
    console.log('shop changed', e)
    var that = this
    var that = this
    that.setData({shop: e.detail.shop, shopId: e.detail.shopId})
    that.GetData()
    //that.fillTimeTable()
  },
  selectDate(e){
    console.log('date selected', e)
    var that = this
    switch(e.currentTarget.id){
      case 'start':
        that.setData({startDate: e.detail.value})
        break
      case 'end':
        that.setData({endDate: e.detail.value})
        break
      default:
        break
    }
    that.GetData()
    //that.setData({reserveDate: e.detail.value})
    //that.fillTimeTable()
  },
  GetData(){
    var that = this
    var getDataUrl = app.globalData.requestPrefix + 'Shop/GetReserveByStaff/' + encodeURIComponent(app.globalData.sessionKey)
    + '?start=' + that.data.startDate + '&end=' + that.data.endDate + '&shopId=' + that.data.shopId
    wx.request({
      url: getDataUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get data', res)
        var list = res.data
        for(var i = 0; i < list.length; i++){
          list[i].reserve_date = util.formatDate(new Date(list[i].reserve_date))
        }
        that.setData({reserveList: list})
      }
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    app.loginPromise.then(function(resolve){
      if (options.date != undefined){
        var date = new Date(options.date)
        var dateStr = util.formatDate(date);
        that.setData({startDate: dateStr, endDate: dateStr})
      }
      that.GetData()
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