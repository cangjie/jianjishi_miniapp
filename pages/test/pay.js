// pages/test/pay.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    login: false
  },
  payTest(e){
    var placeOrderUrl = app.globalData.requestPrefix + 'Order/PlaceWepayOrderSimple?amount=' + encodeURIComponent('0.01') + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: placeOrderUrl,
      method: 'GET',
      success:(res)=>{
        console.log('place order', res)
        var paymentId = res.data.payments[0].id
        var payUrl = app.globalData.requestPrefix + 'Order/TenpayRequest/' + paymentId + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
        wx.request({
          url: payUrl,
          method: 'GET',
          success:(res)=>{
            console.log('pay parameters', res)
            wx.requestPayment({
              nonceStr: res.data.nonce,
              package: 'prepay_id=' + res.data.prepay_id,
              paySign: res.data.sign,
              timeStamp: res.data.timeStamp,
              signType: 'RSA'
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
    app.loginPromise.then(function(resolve){
      that.setData({login: true})
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