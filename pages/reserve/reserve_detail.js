// pages/reserve/reserve_detail.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {
    scene: 'view',
    isPast: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var that = this
    that.setData({tabBarItem: app.globalData.userTabBarItem, id: options.id})
    app.loginPromise.then(function(resolve){
      var getReserveUrl = app.globalData.requestPrefix + 'Shop/GetReserve/' + that.data.id + '?sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
      wx.request({
        url: getReserveUrl,
        method: 'GET',
        success: (res)=>{
          console.log('get reserve', res)
          var reserve = res.data
          reserve.reserve_date_str = util.formatDate(new Date(reserve.reserve_date))
          var nowDateStr = util.formatDate(new Date()).split('T')[0].trim()
          var isPast = (util.formatDate(new Date(reserve.reserve_date)) < util.formatDate(new Date(nowDateStr)))
          
          that.setData({reserve: res.data, isPast: isPast, shopId: reserve.shop_id})
          var getShopUrl = app.globalData.requestPrefix + 'Shop/GetShop'
          wx.request({
            url: getShopUrl,
            success:(res)=>{
              that.setData({shopList: res.data})
              that.getShopAddress()
            }
          })
        }
      })
    })
  },
  changeShop(e){
    console.log('change shop', e)
    var that = this
    var scene = that.data.scene
    if (scene=='mod'){
      scene = 'shop'
    }
    else{
      scene = 'time'
    }
    
    
    that.setData({shopId: e.detail.shopId, scene: scene})
    that.fillTimeTable()
    that.getShopAddress()
  },

  getShopAddress(){
    var that = this
    var shopId = that.data.shopId
    var shopList = that.data.shopList

    var address = ''

    for(var i = 0; i < shopList.length; i++){
      if (shopList[i].id == shopId){
        address = shopList[i].address
        break
      }
    }
    that.setData({address: address})
  },

  fillTimeTable: function(){
    var that = this
    var shopId = that.data.shopId
    var date = that.data.reserve.reserve_date_str
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
              if (that.data.reserve.time_table_id == timeSeg.id){
                timeTableSelectIndex = i + 1
              }
            }
          }
          that.setData({timeTableDescList: timeTableDescList, timeTableIdList: timeTableIdList, timeTableSelectIndex: timeTableSelectIndex})
        }
      })
    }
  },
  mod(){
    var that = this
    that.setData({scene: 'mod'})
  },
  selectTime: function(e){
    console.log('time select', e)
    var that = this
    var selectedIndex = e.detail.value
    var timeId = that.data.timeTableIdList[selectedIndex]
    that.setData({timeTableSelectIndex: selectedIndex, timeId: timeId, scene: 'submit'})
    
  },

  submit(){
    var that = this
    console.log('shop id:' + that.data.shopId + ' time id:' + that.data.timeId )
    var updateUrl = app.globalData.requestPrefix + 'Shop/ModReserve/' + that.data.reserve.id + '?shopId=' + that.data.shopId + '&timeTableId=' + that.data.timeId + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: updateUrl,
      method: 'GET',
      success:(res)=>{
        if (res.statusCode == 200 && res.data.id > 0){
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            success:()=>{
              wx.redirectTo({
                url: 'mine',
              })
            }
          })
        }
      }
    })
  },

  getShopInfo(){
    var that = this
    var shopId = that.data.shopId
    var getShopInfoUrl = app.globalData.requestPrefix + 'Shop/'
  },

  tabSwitch: function(e) {
    wx.redirectTo({
      url: e.detail.item.pagePath
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