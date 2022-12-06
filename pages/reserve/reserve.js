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
    timeTableSelectIndex: 0,
    name: '',
    shopAddress: '',
    hand: 'shop'
  },
  setHand(){
    var that = this
    var data = that.data
    if (data.shop == ''){
      that.setData({hand: 'shop'})
    }
    else if (data.timeTableSelectIndex == 0){
      that.setData({hand: 'time'})
    }
    else if (data.name == ''){
      that.setData({hand: 'name'})
    }
    else if (data.cell == ''){
      that.setData({hand: 'cell'})
    }
    else{
      that.setData({hand: ''})
    }
  },
  selectDate(e){
    console.log('date selected', e)
    var that = this
    that.setData({reserveDate: e.detail.value})
    that.fillTimeTable()
  },
  submit(){
    var that = this
    var shopId = that.data.shopId
    var timeTableId = that.data.timeTableIdList[that.data.timeTableSelectIndex]
    var name = that.data.name
    var cell = that.data.cell
    var date = that.data.reserveDate
    var message = ''
    if (shopId == 0){
      message = '请选择店铺'
    }
    else if (timeTableId == 0){
      message = '请选择时间段'
    }
    else if (name == ''){
      message = '请填写姓名'
    }
    else if (cell == ''){
      message = '请填写手机号'
    }

    if (message != ''){
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 3000
      })
      return
    }

    //var getMyReserveUrl = app.globalData.requestPrefix + 'Shop/'
    var getMyReservePromise = new Promise(function(resolve){
      var getMyReserveUrl = app.globalData.requestPrefix + 'Shop/GetMyReserve/' + encodeURIComponent(app.globalData.sessionKey)
      wx.request({
        url: getMyReserveUrl,
        method: 'GET',
        success:(res)=>{
          var reserved = false
          for(var i = 0; i < res.data.length; i++){
            if (util.formatDate(new Date(res.data[i].reserve_date)) == date){
              reserved = true
              break
            }
          }
          resolve({reserved: reserved})
        }
      })
    })

    getMyReservePromise.then(function(resolve){
      if (resolve.reserved){
        wx.showToast({
          title: '您在' + date + '已经预约过，当日一人只可预约一次，请改日再约。',
          icon: 'none',
          duration: 3000
        })
        return
      }
      else{
        var reserveUrl = app.globalData.requestPrefix + 'Shop/Reserve/' + shopId + '?timeTableId=' + timeTableId 
        + '&date=' + encodeURIComponent(date) + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey) 
        + '&cell=' + cell + '&name=' + encodeURIComponent(name)
        wx.request({
          url: reserveUrl,
          method: 'GET',
          success:(res)=>{
            
            if (res.data.id > 0){
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
            }
            else{
              wx.showToast({
                title: '预约失败',
                icon:'none',
                duration: 5000,
                success:(res)=>{
                  
                }
              })
            }
          }
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
    that.setHand()
  },
  changeShop: function(e){
    console.log('shop changed', e)
    var that = this
    
    var shopId = e.detail.shopId
    var shopList = e.detail.shopList
    var shopAddress = ''
    for(var i = 0; i < shopList.length; i++){
      if (shopList[i].id == shopId){
        shopAddress = shopList[i].address
        break
      }
    }
    that.setData({shop: e.detail.shop, shopId: e.detail.shopId, shopAddress: shopAddress})
    that.fillTimeTable()
    that.setHand()
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
    that.setHand()
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
    that.setHand()
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
      that.setData({name: name})
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