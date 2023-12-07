// pages/admin/reserve/reserve_list.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    shopSelectIndex: 0,
    region: '崇礼'
  },
  changeDate(e){
    var that = this
    that.setData({currentDate: e.detail.value})
    that.getData()
  },
  changeShop(e){
    var that = this
    that.setData({shopSelectIndex: e.detail.value})
    that.getData()
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
  getData(){
    var that = this
    var shopName = '万龙滑雪场店'
    if (that.data.shopNames != undefined){
      shopName = that.data.shopNames[that.data.shopSelectIndex]
    }
    var getUrl = app.globalData.requestPrefix + 'Reserve/GetReserveListByStaff?shop=' + encodeURIComponent(shopName) + '&date=' + encodeURIComponent(that.data.currentDate) + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get all reserve', res)
        if (res.statusCode != 200){
          return
        }
        var reserveList = res.data
        for(var i = 0; i < reserveList.length; i++){
          var r = reserveList[i]
          if (r.therapeutist_name == ''){
            r.therapeutist_name = '——'
          }
          r.orderAmountStr = util.showAmount(r.order.final_price)
        }
        that.setData({reserveList: reserveList})

      }
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    var currentDate = util.formatDate(new Date())
    that.getShop()
    that.setData({currentDate: currentDate})
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
    var that = this
    app.loginPromise.then(function(resolve){
      
      that.getData()
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