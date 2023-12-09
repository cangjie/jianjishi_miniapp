// pages/therapeutist/select_product.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },

  getTherapeutist(){
    var that = this
    var getUrl = app.globalData.requestPrefix + 'Shop/GetTherapeutist/' + that.data.therapeutistId
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('thera', res)
        if (res.statusCode != 200){
          return
        }
        var therapeutist = res.data
        that.setData({therapeutist: therapeutist})
        getUrl = app.globalData.requestPrefix + 'Product/GetReserveProductByRegion?region=' + encodeURIComponent(therapeutist.region)
        wx.request({
          url: getUrl,
          method: 'GET',
          success:(res)=>{
            console.log('get product', res)
            if (res.statusCode != 200){
              return 
            }
            var products = res.data
            for(var i = 0; i < products.length; i++){
              products[i].sale_priceStr = util.showAmount(products[i].sale_price)
            }
            that.setData({products: products})
          }
        })
      }
    })
  },

  getTimeTableItem(){
    var that = this
    var getUrl = app.globalData.requestPrefix + 'Reserve/GetTimeTableItem/' + that.data.timeId
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('time table item', res)
        if (res.statusCode != 200){
          return
        }
        var timeTableItem = res.data
        that.setData({timeTableItem: timeTableItem})
      }
    })
  },
  selectProduct(e){
    var that = this
    var shopId = that.data.timeTableItem.shop_id
    var productId = e.currentTarget.id
    var selectedProduct = {}
    for(var i = 0; i < that.data.products.length; i++){
      if (that.data.products[i].id == productId){
        selectedProduct = that.data.products[i]
        break
      }
    }
    var selectedId = 0
    if (selectedProduct.need_therapeutist == 0){
      selectedId = that.data.timeTableItem.id
    }
    else{
      for(var i = 0; i < that.data.timeTableItem.therapeutistTimeList.length; i++){
        if (that.data.timeTableItem.therapeutistTimeList[i].therapeutist_id == that.data.therapeutistId){
          selectedId = that.data.timeTableItem.therapeutistTimeList[i].id
          break
        }
      }
    }
    var navUrl = '../reserve/reserve_confirm?shopId=' + shopId + '&productId=' + productId + '&date=' + that.data.date + '&selectedId=' + selectedId
    console.log('nav url', navUrl)
    wx.navigateTo({
      url: navUrl
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    that.setData({date: options.date, therapeutistId: options.therapeutist_id, timeId: options.time_id})
    that.getTherapeutist()
    that.getTimeTableItem()
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