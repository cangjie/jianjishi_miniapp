// pages/reserve/reserve_confirm.js
const app = getApp()
Page({

  /**
   * Page initial data
   */
  data: {
    therapeutist:{ name: '——'}
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    var shopId = options.shopId
    var productId = options.productId
    var date = options.date
    var selectedId = options.selectedId
    that.setData({shopId: shopId, productId: productId, date: date, selectedId: selectedId})
    var getUrl = app.globalData.requestPrefix + 'Shop/GetSingleShop/' + shopId.toString()
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        that.setData({shop: res.data})
      }
    })
    getUrl = app.globalData.requestPrefix + 'Product/GetSingleProduct/' + productId.toString()
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var product = res.data
        that.setData({product: product})
        if (product.need_therapeutist == 1){
          getUrl = app.globalData.requestPrefix + 'Reserve/GetTherapeutistTime/' + that.data.selectedId
          wx.request({
            url: getUrl,
            method: 'GET',
            success:(res)=>{
              if (res.statusCode != 200){
                return
              }
              that.setData({timeTableItem: res.data.shopTimeTable, therapeutist: res.data.therapeutist, therapeutistTimeItem: res.data})
            }
          })
        }
        else{
          getUrl = app.globalData.requestPrefix + 'Reserve/GetTimeTableItem/' + that.data.selectedId
          wx.request({
            url: getUrl,
            method: 'GET',
            success:(res)=>{
              if (res.statusCode != 200){
                return
              }
              that.setData({timeTableItem: res.data})
            }
          })
        }
      }
    })
  },

  reserve(){
    var therapeutistTimeId = 0
    var that = this
    if (that.data.therapeutistTimeItem != undefined){
      therapeutistTimeId = that.data.therapeutistTimeItem.id
    }
    var timeTableId = that.data.timeTableItem.id
    var reserveUrl = app.globalData.requestPrefix + 'Reserve/Reserve/' + that.data.product.id + '?timeId=' + timeTableId.toString() + '&therapeutistTimeId=' + therapeutistTimeId.toString() + '&date=' + encodeURIComponent(that.data.date) + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: reserveUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          wx.showToast({
            title: '预约失败',
            icon: 'error'
          })
        }
        else{
          wx.showToast({
            title: '预约成功，请尽快支付！',
            icon: 'success'
          })
          var orderId = res.data.order.id
          var payUrl = app.globalData.requestPrefix + 'Order/PayOrder/' + orderId + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
          wx.request({
            url: payUrl,
            method: 'GET',
            success:(res)=>{
              console.log('ready to pay', res)
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
                signType: 'RSA'
              })
            }
          })
        }
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
    app.loginPromise.then(function(resolve){

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