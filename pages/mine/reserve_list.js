// pages/mine/reserve_list.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },

  getData(){
    var that = this
    var getUrl = app.globalData.requestPrefix + 'Reserve/GetMyReserveList?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get reserve list', res)
        if (res.statusCode != 200){
          return
        }
        var reserveList = res.data
        for (var i = 0; i < reserveList.length; i++){
          reserveList[i].reserveDateStr = util.formatDate(new Date(reserveList[i].reserve_date))
          if (reserveList[i].therapeutist_name == ''){
            reserveList[i].therapeutist_name = '——'
          }
        }
        that.setData({reserveList: reserveList})
      }
    })
  },

  refund(e){
    var id = e.currentTarget.id
    var that = this
    var reserveList = that.data.reserveList
    var reserve = {id:0}
    for(var i = 0; i < reserveList.length; i++){
      if (reserveList[i].id == parseInt(id)){
        reserve = reserveList[i]
        break
      }
    }
    if (reserve.id == 0 || reserve.order == null){
      return
    }
    var refundUrl = app.globalData.requestPrefix + 'Reserve/Refund/' + reserve.id + '?amount=' + reserve.order.final_price + '&memo=' + encodeURIComponent('用户主动取消') + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: refundUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        wx.showToast({
          title: '已申请退款。',
          icon:'success'
        })
        that.getData()
      }
    })
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

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