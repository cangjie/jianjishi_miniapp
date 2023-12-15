// pages/product/product_list.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },
  gotoSelectShop(e){
    var that = this
    var id = e.currentTarget.id
    var jumpUrl = 'select_shop?productId=' + id.toString()
    if (that.data.shopId != undefined){
      jumpUrl += 'shopId=' + that.data.shopId
    }
    wx.navigateTo({
      url: jumpUrl
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    if (options.shopId != undefined){
      that.setData({shopId: options.shopId})
    }
    
    var getUrl = app.globalData.requestPrefix + 'Product/GetReserveProductByRegion?region=' + encodeURIComponent('崇礼')
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var productList = res.data
        that.setData({productList: productList})
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