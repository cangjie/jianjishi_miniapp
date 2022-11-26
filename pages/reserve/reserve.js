// pages/reserve/reserve.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    shopList: ['太舞店', '万龙店', '望京店', '回龙观店'],
    timeSegList: ['10:00-11:00', '11:30-12:30', '13:30-14:30', '15:00-16:00'],
    needAuth: false,
    cell: '',
    shop: '',
    reserveDate: util.formatDate(new Date()),
    timeTableDescList: ['请选择……'],
    timeTableIdList: [0],
    timeTableSelectIndex: 0
  },
  selectDate(e){
    console.log('date selected', e)
    var that = this
    that.setData({reserveDate: e.detail.value})
    that.fillTimeTable()
  },
  submit(){
    wx.showToast({
      title: '预约成功',
      icon:'none',
      duration: 5000,
      success:(res)=>{
        wx.redirectTo({
          url: 'mine',
        })
      }
    })
  },
  tabSwitch: function(e) {
    wx.redirectTo({
      url: e.detail.item.pagePath
    })
  },
  cellGetted: function(e){
    console.log('cell getted', e)
    var that = this
    that.setData({needAuth: false, cell: e.detail.userInfo.cell_number})
  },
  changeShop: function(e){
    console.log('shop changed', e)
    var that = this
    var that = this
    that.setData({shop: e.detail.shop, shopId: e.detail.shopId})
    that.fillTimeTable()
  },
  fillTimeTable: function(){
    var that = this
    var shopId = that.data.shopId
    var date = that.data.reserveDate
    var timeTableDescList = ['请选择……']
    var timeTableIdList = [0]
    var timeTableSelectIndex = 0
    if (shopId != 0){
      var getTimeTableUrl = app.globalData.requestPrefix + 'Shop/GetTimeTable/' + shopId + '?date=' + date
      wx.request({
        url: getTimeTableUrl,
        success: (res)=>{
          console.log('get time table', res)
          for(var i = 0; i < res.data.length; i++){
            var timeSeg = res.data[i]
            if (timeSeg.avaliableCount >0){
              timeTableDescList.push(timeSeg.description)
              timeTableIdList.push(timeSeg.id)
            }
          }
          that.setData({timeTableDescList: timeTableDescList, timeTableIdList: timeTableIdList, timeTableSelectIndex: 0})
        }
      })
    }
  },
  selectTime: function(e){
    console.log('time select', e)
    var that = this
    that.setData({timeTableSelectIndex: e.detail.value})
  },
  input: function(e){
    console.log('input', e)
    var that = this
    var value = e.detail.value.trim()
    switch(e.currentTarget.id)  {
      case 'name':
        that.setData({name: value})
        break
      case 'cell':
        that.setData({cell: value})
        break
      default:
        break
    }
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    that.setData({tabBarItem: app.globalData.userTabBarItem})
    app.loginPromise.then(function (resolve){
      var cell = ''
      var name = ''
      if (app.globalData.userInfo != null && app.globalData.userInfo.cell_number != null &&  !isNaN(app.globalData.userInfo.cell_number) )
      {
        cell = app.globalData.userInfo.cell_number
      }
      if (app.globalData.userInfo != null && app.globalData.userInfo.real_name != undefined && app.globalData.userInfo.real_name != null){
        name = app.globalData.userInfo.real_name.trim()
      }
      that.setData({real_name: name})
      if (cell == ''){
        console.log('need auth')
        that.setData({needAuth: true})
      }
      else{
        that.setData({cell: cell, needAuth: false})
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