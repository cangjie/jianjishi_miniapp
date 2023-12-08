// pages/admin/reserve/reserve_refund.js
const app = getApp()
const util = require('../../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    memo: ''
  },
  setMemo(e){
    var that = this
    that.setData({memo: e.detail.value})
  },
  setRefundAmount(e){
    var v = parseFloat(e.detail.value)
    if (isNaN(v)){
      wx.showToast({
        title: '请正确填写退款金额。',
        icon: 'error'
      })
      return
    }
    var that = this
    that.setData({refundAmount: v})
  },
  tapRefund(){
    var that = this
    wx.showModal({
      title: '确认退款',
      content: '此操作不可逆。',
      complete: (res) => {
        if (res.cancel) {
          

        }
    
        if (res.confirm) {
          var refundUrl = app.globalData.requestPrefix + 'Reserve/Refund/' + that.data.reserve.id + '?amount=' + that.data.refundAmount + '&memo=' + encodeURIComponent(that.data.memo) + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
          wx.request({
            url: refundUrl,
            method: 'GET',
            success:(r)=>{
              if (r.statusCode != 200){
                return
              }
              wx.showToast({
                title: '退款成功',
                icon:'success'
              })
              wx.navigateBack()
            }
          })

        }
      }
    })
  },

  getData(){
    var that = this
    var getUrl = app.globalData.requestPrefix + 'Reserve/GetReserve/' + that.data.id + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get reserve', res.data)
        if (res.statusCode != 200){
          return
        }
        var reserve = res.data
        reserve.reserve_dateStr = util.formatDate(new Date(reserve.reserve_date))
        reserve.therapeutist_name = reserve.therapeutist_name == '' ? '——' : ''
        reserve.orderAmountStr = "¥0.00"
        if (reserve.order != null){
          reserve.orderAmountStr = util.showAmount(reserve.order.final_price)

        }
        that.setData({reserve: reserve, refundAmount: reserve.order.final_price})
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    that.setData({id: options.id})
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