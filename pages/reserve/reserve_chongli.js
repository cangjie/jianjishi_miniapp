// pages/reserve/reserve_chongli.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    shopSelectIndex: 0,
    productSelectIndex: 0,
    selectedDate: ''
  },
  Jump(e){
    wx.navigateTo({
      url: 'reserve',
    })
  },

  getProduct(){
    var that = this
    var getUrl = app.globalData.requestPrefix + 'Product/GetReserveProductByRegion?region=' + that.data.region
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get product', res)
        if (res.statusCode != 200){
          return
        }
        var products = res.data
        var productNames = []
        for(var i = 0; i < products.length; i++){
          productNames.push(products[i].name)
        }
        that.setData({products: products, productNames: productNames})
      }
    })
  },

  getShop(){
    var that = this
    var getUrl = app.globalData.requestPrefix + 'Shop/GetShopByRegion?region=' + that.data.region
    wx.request({
      url: getUrl,
      method:'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var shops = res.data
        var shopNames = []
        for(var i = 0; i < shops.length; i++){
          shopNames.push(shops[i].name)
        }
        console.log('get shop', res)
        that.setData({shops: shops, shopNames: shopNames})
      }
    })
  },

  getTimeTable(){
    var that = this
    if (that.data.shops == undefined|| that.data.products == undefined
      || that.data.shops.length == 0 || that.data.products.length == 0){
        return
    }
    var shopId = that.data.shops[that.data.shopSelectIndex].id
    var productId = that.data.products[that.data.productSelectIndex].id
    var getUrl = app.globalData.requestPrefix + 'Reserve/GetShopDailyTimeList/' + shopId.toString() 
      + '?date=' + encodeURIComponent(that.data.selectedDate) + '&sessionKey=aaa'
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get time table', res)
        if (res.statusCode != 200){
          return
        }
        that.setData({timeTable: res.data})
      }
    })
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    console.log('onLoad')
    var region = '崇礼'
    var that = this
    if (options.region != undefined){
      region = options.region
    }
    var selectedDate = util.formatDate(new Date())
    region = encodeURIComponent(region)
    that.setData({region: region, selectedDate: selectedDate})
    that.getProduct()
    that.getShop()
    
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {
    console.log('onReady')
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    console.log('onShow')
    var that = this
    app.loginPromise.then(function(resolve){
      that.getTimeTable()
    })
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