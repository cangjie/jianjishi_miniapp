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
        that.setData({timeTable: timeTable})
      }
    })
  },

  pickerChange(e){
    var that = this
    var id = e.currentTarget.id
    console.log('change ' + id, e)
    var value = e.detail.value
    switch(id){
      case 'shopPicker':
        that.setData({shopSelectIndex: parseInt(value)})
        break
      case 'productPicker':
        that.setData({productSelectIndex: parseInt(value)})
        break
      case 'datePicker':
        that.setData({selectedDate: value})
        break
      default:
        break
    }
    that.getTimeTable()
  },

  reserve(e){
    console.log('reserve', e)
    var that = this
    var shopId = that.data.shops[that.data.shopSelectIndex].id
    var date = that.data.selectedDate
    var productId = that.data.products[that.data.productSelectIndex].id
    var selectedId = e.detail.value
    var jumpUrl = 'reserve_confirm?shopId=' + shopId.toString() + '&productId=' + productId.toString() + '&selectedId=' + selectedId + '&date=' + date
    wx.navigateTo({
      url: jumpUrl
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