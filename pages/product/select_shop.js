// pages/product/select_shop.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },

  getTimeTable(){
    var that = this
    
    var shopId = that.data.selectedShopId
    var productId = that.data.productId
    var getUrl = app.globalData.requestPrefix + 'Reserve/GetShopDailyTimeList/' + shopId.toString() 
      + '?date=' + encodeURIComponent(that.data.selectedDate) + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get time table', res)
        if (res.statusCode != 200){
          return
        }
        var timeTable = res.data
        var now = new Date()
        for(var i = 0; i < timeTable.timeList.length; i++){
          timeTable.timeList[i].startTime = new Date(timeTable.timeList[i].startTime)
          if (timeTable.timeList[i].startTime <= now){
            timeTable.timeList[i].pastDue = true
            
          }
          else{
            timeTable.timeList[i].pastDue = false
          }
          for(var j = 0; j < timeTable.timeList[i].therapeutistTimeList.length; j++){
            timeTable.timeList[i].therapeutistTimeList[j].pastDue = timeTable.timeList[i].pastDue
          }
        }
        console.log('get time table', timeTable)
        that.setData({timeTable: timeTable})
      }
    })
  },

  changeShop(e){
    console.log('change shop', e)
    var that = this
    that.setData({selectedShopId: e.detail.shopId})
    that.getTimeTable()
  },
  selectTime(e){
    console.log('select time', e)
    var that = this
    var shopId = that.data.selectedShopId
    var productId = that.data.product.id
    var date = that.data.selectedDate
    var selectedId = e.detail.value
    var navUrl = '../reserve/reserve_confirm?shopId=' + shopId + '&productId=' + productId + '&date=' + date + '&selectedId=' + selectedId
    console.log('nav url', navUrl)
    wx.navigateTo({
      url: navUrl
    })
  },


  changeDate(e){
    console.log('change date', e)
    var that = this
    that.setData({selectedDate: e.detail.value})
    that.getTimeTable()
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    if (that.data.shopId != undefined){
      that.setData({shopId: that.data.shopId})
    }
    else{
      that.setData({shopId: 8})
    }
    var selectedDate = util.formatDate(new Date())
    that.setData({productId: options.productId, selectedDate: selectedDate, nowDate: new Date()})
    //that.getTimeTable()
    var getUrl = app.globalData.requestPrefix + 'Product/GetSingleProduct/' + options.productId
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var product = res.data
        that.setData({product: product})
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