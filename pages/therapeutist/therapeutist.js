// pages/therapeutist/therapeutist.js
const app = getApp()
const util = require('../../utils/util.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },

  getTimeTable(){
    var that = this
    var getShopUrl = app.globalData.requestPrefix + 'Shop/GetShopByRegion?region=' + encodeURIComponent(that.data.therapeutist.region)
    wx.request({
      url: getShopUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get shops', res)
        if (res.statusCode != 200){
          return
        }
        var shops = res.data
        that.setData({shops: shops})
        for(var i = 0; i < shops.length; i++){
          that.getShopTimeTable(i)
        }
      }
    })  
  },

  getShopTimeTable(index){
    var that = this
    var shops = that.data.shops
    var shop = shops[index]
    shop.avaliable = false
    var getUrl = app.globalData.requestPrefix + 'Reserve/GetShopDailyTimeList/' + shop.id.toString() 
      + '?date=' + encodeURIComponent(that.data.nowDate) + '&sessionKey=' + encodeURIComponent(app.globalData.sessionKey)
    wx.request({
      url: getUrl,
      method: 'GET',
      success:(res)=>{
        console.log('get time table', res)
        var shopTimeTable = res.data
        for(var i = 0; i < shopTimeTable.timeList.length; i++){
          if (shopTimeTable.timeList[i].avaliableCount <= 0 || new Date(shopTimeTable.timeList[i].startTime) < new Date()){
            shopTimeTable.timeList[i].avaliable = false
            continue
          }
          var therapeutistList = shopTimeTable.timeList[i].therapeutistTimeList
          for(var j = 0; j < therapeutistList.length; j++){
            if (therapeutistList[j].therapeutist_id == that.data.therapeutist.id){
              shop.avaliable = true
              if (therapeutistList[j].avaliable){
                shopTimeTable.timeList[i].avaliable = true
              }
              else{
                shopTimeTable.timeList[i].avaliable = false
              }
              
            }
            
          }
        }
        shop.timeList = shopTimeTable.timeList
        shops[index] = shop
        console.log(shop.name, shop)
        that.setData({shops: shops})
      }
    })
  },

  changeDate(e){
    console.log('date change',e)
    var that = this
    var v = new Date(e.detail.value)
    that.setData({nowDate: util.formatDate(v)})
    that.getTimeTable()
  },

  gotoSelectProduct(e){
    console.log('check', e)
    var that = this
    var url = 'select_product?date=' + that.data.nowDate + '&therapeutist_id=' + that.data.therapeutist.id + '&time_id=' + e.currentTarget.id
    wx.navigateTo({
      url: url
    })
  },


  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    var id = options.id
    var that = this
    var nowDate = util.formatDate(new Date())
    that.setData({id: id, nowDate: nowDate})
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
    var getUrl = app.globalData.requestPrefix + 'Shop/GetTherapeutists'
    wx.request({
      url: getUrl,
      method:'GET',
      success:(res)=>{
        if (res.statusCode != 200){
          return
        }
        var therapeutistList = res.data
        for(var i = 0; i < therapeutistList.length; i++){
          if (therapeutistList[i].id == that.data.id){
            var desc = therapeutistList[i].desc
            desc = desc.replace(/\r\n/g, '<br/>')
            console.log('desc', desc)
            therapeutistList[i].desc = desc
            that.setData({therapeutist: therapeutistList[i]})
            break;
          }
        }
        that.getTimeTable()
        //that.setData({therapeutistList: therapeutistList})
        
      }
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