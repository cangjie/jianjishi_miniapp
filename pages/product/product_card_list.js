// pages/product/product_card_list.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },

  submit(e){
    var id = e.currentTarget.id
    var placeUrl = app.globalData.requestPrefix + 'Product/PlaceOrder/' + id + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: placeUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var order = res.data
        var payUrl = app.globalData.requestPrefix + 'Order/PayOrder/' + order.id + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
        wx.request({
          url: payUrl,
          method: 'GET',
          success:(res)=>{
            if (res.statusCode != 200){
              return
            }
            var nonce = res.data.nonce
            var prepay_id = res.data.prepay_id
            var sign = res.data.sign
            var timeStamp = res.data.timeStamp
            wx.requestPayment({
              nonceStr: nonce,
              package: 'prepay_id=' + prepay_id,
              paySign: sign,
              timeStamp: timeStamp,
              signType: 'RSA',
              success:(res)=>{
                console.log('pay suc', res)
                wx.showToast({
                  title: '支付成功',
                  icon:'success'
                })
              }
            })
          }
        })
      }
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
    app.loginPromise.then(function(resovle){

    })
    
    var getUrl = app.globalData.requestPrefix + 'Product/GetCardProductByRegion?region=' + encodeURIComponent('崇礼')
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